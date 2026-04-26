begin;

create type curriculum.app_direction as enum ('ltr', 'rtl');
create type curriculum.course_version_status as enum ('draft', 'published', 'archived');
create type curriculum.grapheme_role as enum ('new', 'review');
create type curriculum.drill_type as enum ('recognize', 'match', 'sound', 'spot');
create type curriculum.lesson_progress_status as enum ('not_started', 'in_progress', 'completed');

alter table curriculum.languages
	alter column direction type curriculum.app_direction
	using direction::text::curriculum.app_direction;

alter table curriculum.script_systems
	alter column direction type curriculum.app_direction
	using direction::text::curriculum.app_direction;

alter table curriculum.course_versions
	alter column status drop default,
	alter column status type curriculum.course_version_status
	using status::text::curriculum.course_version_status,
	alter column status set default 'draft'::curriculum.course_version_status;

alter table curriculum.lesson_graphemes
	alter column role type curriculum.grapheme_role
	using role::text::curriculum.grapheme_role;

alter table curriculum.drills
	alter column type type curriculum.drill_type
	using type::text::curriculum.drill_type;

alter table learner.lesson_progress
	alter column status drop default,
	alter column status type curriculum.lesson_progress_status
	using status::text::curriculum.lesson_progress_status,
	alter column status set default 'not_started'::curriculum.lesson_progress_status;

create or replace function internal_api.prevent_course_version_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	if tg_op = 'UPDATE' then
		if old.status = 'published'::curriculum.course_version_status then
			if (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status') then
				raise exception 'Published course versions are immutable';
			end if;

			if new.status not in ('published'::curriculum.course_version_status, 'archived'::curriculum.course_version_status) then
				raise exception 'Published course versions may only transition to archived';
			end if;
		elsif old.status = 'archived'::curriculum.course_version_status then
			if to_jsonb(new) is distinct from to_jsonb(old) then
				raise exception 'Archived course versions are immutable';
			end if;
		end if;

		return new;
	end if;

	if old.status in ('published'::curriculum.course_version_status, 'archived'::curriculum.course_version_status) then
		raise exception 'Published or archived course versions cannot be deleted';
	end if;

	return old;
end;
$$;

create or replace function internal_api.sync_lesson_attempt_batch(
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
set search_path = ''
as $$
declare
	v_user_id uuid;
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

	if jsonb_array_length(p_attempts) > 200 then
		raise exception 'p_attempts contains too many rows';
	end if;

	select coalesce(
		auth.uid(),
		nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
	)
	into v_user_id;

	if v_user_id is null then
		raise exception 'unauthenticated';
	end if;

	select ce.course_version_id
	into v_course_version_id
	from learner.course_enrollments ce
	where ce.id = p_enrollment_id
		and ce.user_id = v_user_id
	for update;

	if not found then
		raise exception 'Enrollment % does not belong to authenticated user', p_enrollment_id;
	end if;

	if p_device_id is not null then
		perform 1
		from learner.devices d
		where d.id = p_device_id
			and d.user_id = v_user_id;

		if not found then
			raise exception 'Device % does not belong to authenticated user', p_device_id;
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
		or length(payload_rows.client_attempt_id) < 1
		or length(payload_rows.client_attempt_id) > 64
		or payload_rows.lesson_id is null
		or payload_rows.completed_at is null
		or payload_rows.completed_at < v_processed_at - interval '30 days'
		or payload_rows.completed_at > v_processed_at + interval '1 minute'
		or (payload_rows.score is not null and (payload_rows.score < 0 or payload_rows.score > 100))
		or (payload_rows.time_spent_ms is not null and (payload_rows.time_spent_ms < 0 or payload_rows.time_spent_ms > 86400000))
		or octet_length(coalesce(payload_rows.attempt_payload, '{}'::jsonb)::text) > 32768
		or l.id is null;

	if v_invalid_attempt_count > 0 then
		raise exception 'p_attempts contains invalid, oversized, or out-of-window rows';
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
			extensions.gen_random_uuid(),
			v_user_id,
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
			extensions.gen_random_uuid(),
			v_user_id,
			p_enrollment_id,
			per_lesson.lesson_id,
			case
				when per_lesson.batch_completed then 'completed'::curriculum.lesson_progress_status
				else 'in_progress'::curriculum.lesson_progress_status
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
			when learner.lesson_progress.status = 'completed'::curriculum.lesson_progress_status
				or excluded.status = 'completed'::curriculum.lesson_progress_status
			then 'completed'::curriculum.lesson_progress_status
			else 'in_progress'::curriculum.lesson_progress_status
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
		and lp.status = 'completed'::curriculum.lesson_progress_status
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

revoke update on learner.profiles from authenticated;
grant update (display_name) on learner.profiles to authenticated;

revoke update on learner.preferences from authenticated;
grant update (show_romanization, show_pronunciation_hints, auto_prefetch_lessons) on learner.preferences to authenticated;

drop type if exists public.lesson_progress_status;
drop type if exists public.drill_type;
drop type if exists public.grapheme_role;
drop type if exists public.course_version_status;
drop type if exists public.app_direction;

commit;
