begin;

create function internal_api.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, learner
as $$
begin
	insert into learner.profiles (user_id)
	values (new.id)
	on conflict (user_id) do nothing;

	insert into learner.preferences (user_id)
	values (new.id)
	on conflict (user_id) do nothing;

	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
	after insert on auth.users
	for each row
	execute function internal_api.handle_new_user();

create function internal_api.sync_lesson_attempt_batch(
	p_user_id uuid,
	p_enrollment_id uuid,
	p_device_id uuid,
	p_attempts jsonb
)
returns table (
	inserted_attempt_count integer,
	updated_lesson_count integer,
	current_lesson_id uuid,
	current_lesson_slug text,
	processed_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public, curriculum, learner, delivery, internal_api
as $$
declare
	v_course_version_id uuid;
	v_current_lesson_id uuid;
	v_current_lesson_slug text;
	v_processed_at timestamptz := now();
	v_inserted_attempt_count integer := 0;
	v_updated_lesson_count integer := 0;
	v_invalid_attempt_count integer := 0;
	v_duplicate_attempt_id_count integer := 0;
begin
	if jsonb_typeof(p_attempts) is distinct from 'array' then
		raise exception 'p_attempts must be a JSON array';
	end if;

	select ce.course_version_id
	into v_course_version_id
	from learner.course_enrollments ce
	where ce.id = p_enrollment_id
		and ce.user_id = p_user_id
	for update;

	if not found then
		raise exception 'Enrollment % does not belong to user %', p_enrollment_id, p_user_id;
	end if;

	if p_device_id is not null then
		perform 1
		from learner.devices d
		where d.id = p_device_id
			and d.user_id = p_user_id;

		if not found then
			raise exception 'Device % does not belong to user %', p_device_id, p_user_id;
		end if;
	end if;

	with payload_rows as (
		select *
		from jsonb_to_recordset(p_attempts) as payload(
			client_attempt_id text,
			lesson_id uuid,
			completed boolean,
			score integer,
			time_spent_ms integer,
			attempt_payload jsonb,
			completed_at timestamptz
		)
	)
	select count(*)::integer
	into v_duplicate_attempt_id_count
	from (
		select payload_rows.client_attempt_id
		from payload_rows
		group by payload_rows.client_attempt_id
		having count(*) > 1
	) duplicated_attempt_ids;

	if v_duplicate_attempt_id_count > 0 then
		raise exception 'p_attempts contains duplicate client_attempt_id values';
	end if;

	with payload_rows as (
		select *
		from jsonb_to_recordset(p_attempts) as payload(
			client_attempt_id text,
			lesson_id uuid,
			completed boolean,
			score integer,
			time_spent_ms integer,
			attempt_payload jsonb,
			completed_at timestamptz
		)
	)
	select count(*)::integer
	into v_invalid_attempt_count
	from payload_rows
	left join curriculum.lessons l
		on l.id = payload_rows.lesson_id
		and l.course_version_id = v_course_version_id
	where payload_rows.client_attempt_id is null
		or payload_rows.lesson_id is null
		or payload_rows.completed_at is null
		or l.id is null;

	if v_invalid_attempt_count > 0 then
		raise exception 'p_attempts contains invalid or out-of-version lesson references';
	end if;

	with payload_rows as (
		select *
		from jsonb_to_recordset(p_attempts) as payload(
			client_attempt_id text,
			lesson_id uuid,
			completed boolean,
			score integer,
			time_spent_ms integer,
			attempt_payload jsonb,
			completed_at timestamptz
		)
	),
	validated_rows as (
		select
			payload_rows.client_attempt_id,
			payload_rows.lesson_id,
			coalesce(payload_rows.completed, false) as completed,
			payload_rows.score,
			payload_rows.time_spent_ms,
			coalesce(payload_rows.attempt_payload, '{}'::jsonb) as attempt_payload,
			payload_rows.completed_at
		from payload_rows
		join curriculum.lessons l
			on l.id = payload_rows.lesson_id
			and l.course_version_id = v_course_version_id
	),
	inserted_attempts as (
		insert into learner.lesson_attempts (
			id,
			user_id,
			enrollment_id,
			lesson_id,
			device_id,
			client_attempt_id,
			score,
			completed,
			time_spent_ms,
			attempt_payload,
			completed_at,
			created_at
		)
		select
			gen_random_uuid(),
			p_user_id,
			p_enrollment_id,
			validated_rows.lesson_id,
			p_device_id,
			validated_rows.client_attempt_id,
			validated_rows.score,
			validated_rows.completed,
			validated_rows.time_spent_ms,
			validated_rows.attempt_payload,
			validated_rows.completed_at,
			v_processed_at
		from validated_rows
		on conflict (enrollment_id, client_attempt_id) do nothing
		returning id, lesson_id, client_attempt_id, score, completed, completed_at
	),
	per_lesson as (
		select
			inserted_attempts.lesson_id,
			count(*)::integer as attempt_count_delta,
			max(inserted_attempts.score) as batch_best_score,
			min(inserted_attempts.completed_at) filter (where inserted_attempts.completed) as batch_first_completed_at,
			max(inserted_attempts.completed_at) as batch_last_attempt_at,
			bool_or(inserted_attempts.completed) as batch_completed
		from inserted_attempts
		group by inserted_attempts.lesson_id
	),
	latest_per_lesson as (
		select distinct on (inserted_attempts.lesson_id)
			inserted_attempts.lesson_id,
			inserted_attempts.score as batch_latest_score
		from inserted_attempts
		order by inserted_attempts.lesson_id, inserted_attempts.completed_at desc, inserted_attempts.client_attempt_id desc
	),
	upserted_progress as (
		insert into learner.lesson_progress (
			id,
			user_id,
			enrollment_id,
			lesson_id,
			status,
			best_score,
			latest_score,
			attempt_count,
			first_completed_at,
			last_attempt_at,
			updated_at
		)
		select
			gen_random_uuid(),
			p_user_id,
			p_enrollment_id,
			per_lesson.lesson_id,
			case
				when per_lesson.batch_completed then 'completed'::public.lesson_progress_status
				else 'in_progress'::public.lesson_progress_status
			end,
			per_lesson.batch_best_score,
			latest_per_lesson.batch_latest_score,
			per_lesson.attempt_count_delta,
			per_lesson.batch_first_completed_at,
			per_lesson.batch_last_attempt_at,
			v_processed_at
		from per_lesson
		join latest_per_lesson using (lesson_id)
		on conflict (enrollment_id, lesson_id) do update
		set status = case
			when learner.lesson_progress.status = 'completed'::public.lesson_progress_status
				or excluded.status = 'completed'::public.lesson_progress_status
			then 'completed'::public.lesson_progress_status
			else 'in_progress'::public.lesson_progress_status
		end,
		best_score = case
			when learner.lesson_progress.best_score is null then excluded.best_score
			when excluded.best_score is null then learner.lesson_progress.best_score
			else greatest(learner.lesson_progress.best_score, excluded.best_score)
		end,
		latest_score = excluded.latest_score,
		attempt_count = learner.lesson_progress.attempt_count + excluded.attempt_count,
		first_completed_at = case
			when learner.lesson_progress.first_completed_at is null then excluded.first_completed_at
			when excluded.first_completed_at is null then learner.lesson_progress.first_completed_at
			else least(learner.lesson_progress.first_completed_at, excluded.first_completed_at)
		end,
		last_attempt_at = case
			when learner.lesson_progress.last_attempt_at is null then excluded.last_attempt_at
			when excluded.last_attempt_at is null then learner.lesson_progress.last_attempt_at
			else greatest(learner.lesson_progress.last_attempt_at, excluded.last_attempt_at)
		end,
		updated_at = v_processed_at
		returning lesson_id
	),
	marked_attempts as (
		update learner.lesson_attempts
		set processed_at = v_processed_at
		where learner.lesson_attempts.processed_at is null
			and exists (
				select 1
				from inserted_attempts
				where inserted_attempts.id = learner.lesson_attempts.id
			)
		returning id
	)
	select
		coalesce((select count(*)::integer from inserted_attempts), 0),
		coalesce((select count(distinct lesson_id)::integer from upserted_progress), 0)
	into v_inserted_attempt_count, v_updated_lesson_count;

	select
		l.id,
		l.slug
	into v_current_lesson_id, v_current_lesson_slug
	from curriculum.lessons l
	left join learner.lesson_progress lp
		on lp.enrollment_id = p_enrollment_id
		and lp.lesson_id = l.id
		and lp.status = 'completed'::public.lesson_progress_status
	where l.course_version_id = v_course_version_id
		and lp.id is null
	order by l.lesson_ordinal
	limit 1;

	update learner.course_enrollments ce
	set current_lesson_id = v_current_lesson_id,
		last_active_at = v_processed_at,
		completed_at = case
			when v_current_lesson_id is null then coalesce(ce.completed_at, v_processed_at)
			else null
		end,
		updated_at = v_processed_at
	where ce.id = p_enrollment_id;

	return query
	select
		v_inserted_attempt_count,
		v_updated_lesson_count,
		v_current_lesson_id,
		v_current_lesson_slug,
		v_processed_at;
end;
$$;

revoke all on schema curriculum from public, anon, authenticated;
revoke all on schema internal_api from public, anon, authenticated;

grant usage on schema delivery to anon, authenticated;
grant usage on schema learner to authenticated;

grant select on delivery.course_publications to anon, authenticated;
grant select on delivery.course_publication_lessons to anon, authenticated;

grant select, insert, update on learner.profiles to authenticated;
grant select, insert, update, delete on learner.devices to authenticated;
grant select on learner.course_enrollments to authenticated;
grant select, insert on learner.lesson_attempts to authenticated;
grant select on learner.lesson_progress to authenticated;
grant select, insert, update on learner.preferences to authenticated;

alter table delivery.course_publications enable row level security;
alter table delivery.course_publication_lessons enable row level security;
alter table learner.profiles enable row level security;
alter table learner.devices enable row level security;
alter table learner.course_enrollments enable row level security;
alter table learner.lesson_attempts enable row level security;
alter table learner.lesson_progress enable row level security;
alter table learner.preferences enable row level security;

create policy delivery_course_publications_public_select
	on delivery.course_publications
	for select
	to anon, authenticated
	using (is_active = true);

create policy delivery_course_publication_lessons_public_select
	on delivery.course_publication_lessons
	for select
	to anon, authenticated
	using (
		exists (
			select 1
			from delivery.course_publications cp
			where cp.id = publication_id
				and cp.is_active = true
		)
	);

create policy learner_profiles_select_own
	on learner.profiles
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_profiles_insert_own
	on learner.profiles
	for insert
	to authenticated
	with check (auth.uid() = user_id);

create policy learner_profiles_update_own
	on learner.profiles
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy learner_devices_select_own
	on learner.devices
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_devices_insert_own
	on learner.devices
	for insert
	to authenticated
	with check (auth.uid() = user_id);

create policy learner_devices_update_own
	on learner.devices
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy learner_devices_delete_own
	on learner.devices
	for delete
	to authenticated
	using (auth.uid() = user_id);

create policy learner_course_enrollments_select_own
	on learner.course_enrollments
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_lesson_attempts_select_own
	on learner.lesson_attempts
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_lesson_attempts_insert_own
	on learner.lesson_attempts
	for insert
	to authenticated
	with check (auth.uid() = user_id);

create policy learner_lesson_progress_select_own
	on learner.lesson_progress
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_preferences_select_own
	on learner.preferences
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy learner_preferences_insert_own
	on learner.preferences
	for insert
	to authenticated
	with check (auth.uid() = user_id);

create policy learner_preferences_update_own
	on learner.preferences
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

revoke all on all tables in schema curriculum from anon, authenticated;
revoke all on all tables in schema internal_api from anon, authenticated;
revoke all on all functions in schema internal_api from public, anon, authenticated;

commit;
