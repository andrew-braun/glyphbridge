begin;

create extension if not exists pgcrypto with schema extensions;

create schema if not exists curriculum;
create schema if not exists delivery;
create schema if not exists learner;
create schema if not exists internal_api;

create type public.app_direction as enum ('ltr', 'rtl');
create type public.course_version_status as enum ('draft', 'published', 'archived');
create type public.grapheme_role as enum ('new', 'review');
create type public.drill_type as enum ('recognize', 'match', 'sound', 'spot');
create type public.lesson_progress_status as enum ('not_started', 'in_progress', 'completed');

create function internal_api.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create table curriculum.languages (
	code text primary key,
	name text not null,
	native_name text not null,
	direction public.app_direction not null,
	created_at timestamptz not null default now()
);

create table curriculum.script_systems (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	name text not null,
	native_name text not null,
	direction public.app_direction not null,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now()
);

create table curriculum.courses (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	language_code text not null references curriculum.languages(code) on delete restrict,
	script_system_id uuid not null references curriculum.script_systems(id) on delete restrict,
	name text not null,
	native_name text not null,
	hero_title text not null,
	hero_subtitle text not null,
	seo_title text not null,
	seo_description text not null,
	ui_config jsonb not null default '{}'::jsonb,
	is_active boolean not null default false,
	current_published_version_id uuid,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table curriculum.course_versions (
	id uuid primary key default gen_random_uuid(),
	course_id uuid not null references curriculum.courses(id) on delete restrict,
	version_ordinal integer not null check (version_ordinal > 0),
	display_version text not null,
	source_locale text not null default 'en',
	status public.course_version_status not null default 'draft',
	release_title text,
	release_summary text,
	release_notes jsonb not null default '{}'::jsonb,
	content_hash text,
	released_at timestamptz,
	created_by uuid,
	created_at timestamptz not null default now(),
	constraint course_versions_course_id_version_ordinal_key unique (course_id, version_ordinal),
	constraint course_versions_course_id_id_key unique (course_id, id)
);

alter table curriculum.courses
	add constraint courses_current_published_version_fkey
	foreign key (current_published_version_id)
	references curriculum.course_versions(id)
	on delete set null;

create table curriculum.graphemes (
	id uuid primary key default gen_random_uuid(),
	script_system_id uuid not null references curriculum.script_systems(id) on delete restrict,
	key text not null,
	text text not null,
	kind text not null,
	sort_order integer not null default 0,
	unicode_codepoints text[] not null default '{}'::text[],
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	constraint graphemes_script_system_id_key_key unique (script_system_id, key),
	constraint graphemes_script_system_id_text_key unique (script_system_id, text)
);

create table curriculum.course_version_graphemes (
	course_version_id uuid not null references curriculum.course_versions(id) on delete cascade,
	grapheme_id uuid not null references curriculum.graphemes(id) on delete restrict,
	romanization text,
	pronunciation_hint text,
	mnemonic text,
	position text,
	pedagogical_group_key text,
	pedagogical_group_label text,
	details jsonb not null default '{}'::jsonb,
	tags text[] not null default '{}'::text[],
	primary key (course_version_id, grapheme_id)
);

create table curriculum.orthography_rules (
	id uuid primary key default gen_random_uuid(),
	course_version_id uuid not null references curriculum.course_versions(id) on delete cascade,
	key text not null,
	name text not null,
	short_description text not null,
	explanation text not null,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	constraint orthography_rules_course_version_id_key_key unique (course_version_id, key)
);

create table curriculum.orthography_rule_examples (
	id uuid primary key default gen_random_uuid(),
	rule_id uuid not null references curriculum.orthography_rules(id) on delete cascade,
	example_order integer not null check (example_order > 0),
	text text not null,
	translation text,
	constraint orthography_rule_examples_rule_id_example_order_key unique (rule_id, example_order)
);

create table curriculum.lessons (
	id uuid primary key default gen_random_uuid(),
	course_version_id uuid not null references curriculum.course_versions(id) on delete cascade,
	slug text not null,
	lesson_ordinal integer not null check (lesson_ordinal > 0),
	stage integer not null check (stage > 0),
	title text not null,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	constraint lessons_course_version_id_slug_key unique (course_version_id, slug),
	constraint lessons_course_version_id_lesson_ordinal_key unique (course_version_id, lesson_ordinal),
	constraint lessons_course_version_id_id_key unique (course_version_id, id)
);

create table curriculum.anchor_targets (
	id uuid primary key default gen_random_uuid(),
	lesson_id uuid not null unique references curriculum.lessons(id) on delete cascade,
	slug text not null,
	display_text text not null,
	normalized_text text not null,
	meaning text not null,
	pronunciation text not null,
	category_key text,
	context_note text,
	metadata jsonb not null default '{}'::jsonb
);

create table curriculum.anchor_segments (
	id uuid primary key default gen_random_uuid(),
	anchor_target_id uuid not null references curriculum.anchor_targets(id) on delete cascade,
	segment_order integer not null check (segment_order > 0),
	text text not null,
	sound text not null,
	kind text,
	metadata jsonb not null default '{}'::jsonb,
	constraint anchor_segments_anchor_target_id_segment_order_key unique (anchor_target_id, segment_order)
);

create table curriculum.lesson_graphemes (
	lesson_id uuid not null references curriculum.lessons(id) on delete cascade,
	grapheme_id uuid not null references curriculum.graphemes(id) on delete restrict,
	role public.grapheme_role not null,
	ordinal_in_role integer not null check (ordinal_in_role > 0),
	primary key (lesson_id, grapheme_id, role),
	constraint lesson_graphemes_lesson_id_role_ordinal_in_role_key unique (lesson_id, role, ordinal_in_role)
);

create table curriculum.lesson_rules (
	lesson_id uuid not null references curriculum.lessons(id) on delete cascade,
	rule_id uuid not null references curriculum.orthography_rules(id) on delete restrict,
	rule_order integer not null check (rule_order > 0),
	primary key (lesson_id, rule_id),
	constraint lesson_rules_lesson_id_rule_order_key unique (lesson_id, rule_order)
);

create table curriculum.drills (
	id uuid primary key default gen_random_uuid(),
	course_version_id uuid not null references curriculum.course_versions(id) on delete cascade,
	key text not null,
	type public.drill_type not null,
	prompt text not null,
	hint text,
	payload jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	constraint drills_course_version_id_key_key unique (course_version_id, key)
);

create table curriculum.drill_options (
	id uuid primary key default gen_random_uuid(),
	drill_id uuid not null references curriculum.drills(id) on delete cascade,
	option_order integer not null check (option_order > 0),
	text text not null,
	is_correct boolean not null default false,
	rationale text,
	constraint drill_options_drill_id_option_order_key unique (drill_id, option_order)
);

create table curriculum.lesson_drills (
	lesson_id uuid not null references curriculum.lessons(id) on delete cascade,
	drill_id uuid not null references curriculum.drills(id) on delete restrict,
	drill_order integer not null check (drill_order > 0),
	primary key (lesson_id, drill_id),
	constraint lesson_drills_lesson_id_drill_order_key unique (lesson_id, drill_order)
);

create table delivery.course_publications (
	id uuid primary key default gen_random_uuid(),
	course_version_id uuid not null references curriculum.course_versions(id) on delete restrict,
	manifest_hash text not null unique,
	is_active boolean not null default false,
	created_by uuid,
	created_at timestamptz not null default now()
);

create table delivery.course_publication_lessons (
	id uuid primary key default gen_random_uuid(),
	publication_id uuid not null references delivery.course_publications(id) on delete cascade,
	lesson_id uuid not null references curriculum.lessons(id) on delete restrict,
	lesson_slug text not null,
	lesson_ordinal integer not null,
	payload jsonb not null,
	payload_hash text not null,
	created_at timestamptz not null default now(),
	constraint course_publication_lessons_publication_id_lesson_id_key unique (publication_id, lesson_id),
	constraint course_publication_lessons_publication_id_lesson_slug_key unique (publication_id, lesson_slug)
);

create table learner.profiles (
	user_id uuid primary key references auth.users(id) on delete cascade,
	display_name text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table learner.devices (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	client_device_id text not null,
	platform text,
	last_seen_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	constraint devices_user_id_client_device_id_key unique (user_id, client_device_id)
);

create table learner.course_enrollments (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	course_id uuid not null,
	course_version_id uuid not null,
	current_lesson_id uuid references curriculum.lessons(id) on delete set null,
	started_at timestamptz not null default now(),
	last_active_at timestamptz not null default now(),
	completed_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint course_enrollments_user_id_course_id_course_version_id_key unique (user_id, course_id, course_version_id),
	constraint course_enrollments_id_user_id_key unique (id, user_id),
	constraint course_enrollments_course_id_course_version_id_fkey
		foreign key (course_id, course_version_id)
		references curriculum.course_versions(course_id, id)
		on delete restrict
);

create table learner.lesson_attempts (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	enrollment_id uuid not null,
	lesson_id uuid not null references curriculum.lessons(id) on delete restrict,
	device_id uuid references learner.devices(id) on delete set null,
	client_attempt_id text not null,
	score integer check (score between 0 and 100),
	completed boolean not null default false,
	time_spent_ms integer check (time_spent_ms >= 0),
	attempt_payload jsonb not null default '{}'::jsonb,
	completed_at timestamptz not null,
	processed_at timestamptz,
	created_at timestamptz not null default now(),
	constraint lesson_attempts_enrollment_id_client_attempt_id_key unique (enrollment_id, client_attempt_id),
	constraint lesson_attempts_enrollment_id_user_id_fkey
		foreign key (enrollment_id, user_id)
		references learner.course_enrollments(id, user_id)
		on delete cascade
);

create table learner.lesson_progress (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	enrollment_id uuid not null,
	lesson_id uuid not null references curriculum.lessons(id) on delete restrict,
	status public.lesson_progress_status not null default 'not_started',
	best_score integer check (best_score between 0 and 100),
	latest_score integer check (latest_score between 0 and 100),
	attempt_count integer not null default 0 check (attempt_count >= 0),
	first_completed_at timestamptz,
	last_attempt_at timestamptz,
	updated_at timestamptz not null default now(),
	constraint lesson_progress_enrollment_id_lesson_id_key unique (enrollment_id, lesson_id),
	constraint lesson_progress_enrollment_id_user_id_fkey
		foreign key (enrollment_id, user_id)
		references learner.course_enrollments(id, user_id)
		on delete cascade
);

create table learner.preferences (
	user_id uuid primary key references auth.users(id) on delete cascade,
	show_romanization boolean not null default true,
	show_pronunciation_hints boolean not null default true,
	auto_prefetch_lessons boolean not null default true,
	updated_at timestamptz not null default now()
);

create index courses_language_code_idx on curriculum.courses (language_code);
create index courses_script_system_id_idx on curriculum.courses (script_system_id);
create index courses_current_published_version_id_idx on curriculum.courses (current_published_version_id);
create index course_versions_course_id_status_idx on curriculum.course_versions (course_id, status);
create index graphemes_script_system_id_sort_order_idx on curriculum.graphemes (script_system_id, sort_order);
create index course_version_graphemes_course_version_id_idx on curriculum.course_version_graphemes (course_version_id);
create index course_version_graphemes_tags_gin_idx on curriculum.course_version_graphemes using gin (tags);
create index lessons_course_version_id_stage_idx on curriculum.lessons (course_version_id, stage);
create index anchor_targets_category_key_idx on curriculum.anchor_targets (category_key);
create index lesson_graphemes_grapheme_id_idx on curriculum.lesson_graphemes (grapheme_id);
create index drills_course_version_id_type_idx on curriculum.drills (course_version_id, type);
create unique index drill_options_single_correct_answer_idx on curriculum.drill_options (drill_id) where is_correct = true;
create index course_publications_course_version_id_is_active_idx on delivery.course_publications (course_version_id, is_active);
create index course_publication_lessons_publication_id_lesson_ordinal_idx on delivery.course_publication_lessons (publication_id, lesson_ordinal);
create index course_publication_lessons_publication_id_payload_hash_idx on delivery.course_publication_lessons (publication_id, payload_hash);
create index devices_user_id_last_seen_at_idx on learner.devices (user_id, last_seen_at desc);
create index course_enrollments_user_id_last_active_at_idx on learner.course_enrollments (user_id, last_active_at desc);
create index course_enrollments_course_version_id_idx on learner.course_enrollments (course_version_id);
create index lesson_attempts_user_id_enrollment_id_processed_at_idx on learner.lesson_attempts (user_id, enrollment_id, processed_at);
create index lesson_attempts_enrollment_id_lesson_id_completed_at_idx on learner.lesson_attempts (enrollment_id, lesson_id, completed_at);
create index lesson_progress_user_id_enrollment_id_idx on learner.lesson_progress (user_id, enrollment_id);
create index lesson_progress_enrollment_id_status_idx on learner.lesson_progress (enrollment_id, status);

create trigger set_courses_updated_at
	before update on curriculum.courses
	for each row
	execute function internal_api.set_updated_at();

create trigger set_profiles_updated_at
	before update on learner.profiles
	for each row
	execute function internal_api.set_updated_at();

create trigger set_course_enrollments_updated_at
	before update on learner.course_enrollments
	for each row
	execute function internal_api.set_updated_at();

create trigger set_preferences_updated_at
	before update on learner.preferences
	for each row
	execute function internal_api.set_updated_at();

commit;
