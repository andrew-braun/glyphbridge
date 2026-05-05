begin;

create or replace function learner.ensure_course_enrollment_for_publication(
	p_publication_id uuid
)
returns table (
	enrollment_id uuid,
	course_id uuid,
	course_version_id uuid,
	current_lesson_id uuid,
	current_lesson_slug text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_user_id uuid;
	v_course_id uuid;
	v_course_version_id uuid;
	v_first_lesson_id uuid;
begin
	select coalesce(
		auth.uid(),
		nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
	)
	into v_user_id;

	if v_user_id is null then
		raise exception 'unauthenticated';
	end if;

	select cp.course_version_id
	into v_course_version_id
	from delivery.course_publications cp
	where cp.id = p_publication_id
		and cp.is_active = true;

	if v_course_version_id is null then
		raise exception 'Active publication % was not found', p_publication_id;
	end if;

	select cv.course_id
	into v_course_id
	from curriculum.course_versions cv
	where cv.id = v_course_version_id;

	if v_course_id is null then
		raise exception 'Course version % was not found', v_course_version_id;
	end if;

	select l.id
	into v_first_lesson_id
	from curriculum.lessons l
	where l.course_version_id = v_course_version_id
	order by l.lesson_ordinal
	limit 1;

	if v_first_lesson_id is null then
		raise exception 'Course version % has no lessons', v_course_version_id;
	end if;

	insert into learner.course_enrollments (
		user_id,
		course_id,
		course_version_id,
		current_lesson_id
	)
	values (
		v_user_id,
		v_course_id,
		v_course_version_id,
		v_first_lesson_id
	)
	on conflict on constraint course_enrollments_user_id_course_id_course_version_id_key do nothing;

	return query
	select
		ce.id,
		ce.course_id,
		ce.course_version_id,
		ce.current_lesson_id,
		l.slug
	from learner.course_enrollments ce
	left join curriculum.lessons l
		on l.id = ce.current_lesson_id
	where ce.user_id = v_user_id
		and ce.course_id = v_course_id
		and ce.course_version_id = v_course_version_id;
end;
$$;

create or replace function learner.get_lesson_progress_projection(
	p_publication_id uuid
)
returns table (
	enrollment_id uuid,
	publication_id uuid,
	course_version_id uuid,
	current_lesson_id uuid,
	current_lesson_slug text,
	lesson_id uuid,
	lesson_slug text,
	lesson_ordinal integer,
	status text,
	best_score integer,
	latest_score integer,
	attempt_count integer,
	first_completed_at timestamptz,
	last_attempt_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_enrollment_id uuid;
	v_course_version_id uuid;
	v_current_lesson_id uuid;
	v_current_lesson_slug text;
begin
	select
		ensured.enrollment_id,
		ensured.course_version_id,
		ensured.current_lesson_id,
		ensured.current_lesson_slug
	into
		v_enrollment_id,
		v_course_version_id,
		v_current_lesson_id,
		v_current_lesson_slug
	from learner.ensure_course_enrollment_for_publication(p_publication_id) as ensured;

	return query
	select
		v_enrollment_id,
		p_publication_id,
		v_course_version_id,
		v_current_lesson_id,
		v_current_lesson_slug,
		cpl.lesson_id,
		cpl.lesson_slug,
		cpl.lesson_ordinal,
		coalesce(lp.status::text, 'not_started'),
		lp.best_score,
		lp.latest_score,
		coalesce(lp.attempt_count, 0),
		lp.first_completed_at,
		lp.last_attempt_at
	from delivery.course_publication_lessons cpl
	left join learner.lesson_progress lp
		on lp.enrollment_id = v_enrollment_id
		and lp.lesson_id = cpl.lesson_id
	where cpl.publication_id = p_publication_id
	order by cpl.lesson_ordinal;
end;
$$;

create or replace function learner.sync_lesson_attempt_batch_for_current_user(
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
language sql
security definer
set search_path = ''
as $$
	select
		inserted_attempt_count,
		updated_lesson_count,
		current_lesson_id,
		current_lesson_slug,
		processed_at
	from internal_api.sync_lesson_attempt_batch(p_enrollment_id, p_device_id, p_attempts);
$$;

revoke all on all tables in schema learner from public, anon, authenticated;

revoke all on function learner.ensure_course_enrollment_for_publication(uuid) from public, anon, authenticated;
revoke all on function learner.get_lesson_progress_projection(uuid) from public, anon, authenticated;
revoke all on function learner.sync_lesson_attempt_batch_for_current_user(uuid, uuid, jsonb) from public, anon, authenticated;

grant execute on function learner.ensure_course_enrollment_for_publication(uuid) to authenticated;
grant execute on function learner.get_lesson_progress_projection(uuid) to authenticated;
grant execute on function learner.sync_lesson_attempt_batch_for_current_user(uuid, uuid, jsonb) to authenticated;

commit;
