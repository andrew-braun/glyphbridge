begin;

create table curriculum.vocabulary_items (
	id uuid primary key default gen_random_uuid(),
	course_version_id uuid not null references curriculum.course_versions(id) on delete cascade,
	key text not null,
	display_text text not null,
	normalized_text text not null,
	meaning text not null,
	pronunciation text not null,
	category_key text,
	context_note text,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	constraint vocabulary_items_course_version_id_key_key unique (course_version_id, key),
	constraint vocabulary_items_course_version_id_normalized_text_key unique (course_version_id, normalized_text),
	constraint vocabulary_items_key_length_check check (length(key) <= 64),
	constraint vocabulary_items_display_text_length_check check (length(display_text) <= 160),
	constraint vocabulary_items_normalized_text_length_check check (length(normalized_text) <= 160),
	constraint vocabulary_items_meaning_length_check check (length(meaning) <= 160),
	constraint vocabulary_items_pronunciation_length_check check (length(pronunciation) <= 160),
	constraint vocabulary_items_category_key_length_check check (category_key is null or length(category_key) <= 64),
	constraint vocabulary_items_context_note_length_check check (context_note is null or length(context_note) <= 320)
);

create table curriculum.vocabulary_segments (
	id uuid primary key default gen_random_uuid(),
	vocabulary_item_id uuid not null references curriculum.vocabulary_items(id) on delete cascade,
	segment_order integer not null check (segment_order > 0),
	text text not null,
	sound text not null,
	kind text,
	metadata jsonb not null default '{}'::jsonb,
	constraint vocabulary_segments_vocabulary_item_id_segment_order_key unique (vocabulary_item_id, segment_order),
	constraint vocabulary_segments_text_length_check check (length(text) <= 128),
	constraint vocabulary_segments_sound_length_check check (length(sound) <= 128),
	constraint vocabulary_segments_kind_length_check check (kind is null or length(kind) <= 64)
);

create table curriculum.lesson_vocabulary (
	lesson_id uuid not null references curriculum.lessons(id) on delete cascade,
	vocabulary_item_id uuid not null references curriculum.vocabulary_items(id) on delete restrict,
	role_key text not null,
	ordinal_in_role integer not null check (ordinal_in_role > 0),
	is_drill_target boolean not null default false,
	metadata jsonb not null default '{}'::jsonb,
	primary key (lesson_id, vocabulary_item_id),
	constraint lesson_vocabulary_lesson_id_role_key_ordinal_in_role_key unique (lesson_id, role_key, ordinal_in_role),
	constraint lesson_vocabulary_role_key_length_check check (length(role_key) <= 64)
);

create index vocabulary_items_course_version_id_category_key_idx
	on curriculum.vocabulary_items (course_version_id, category_key);

create index vocabulary_segments_vocabulary_item_id_idx
	on curriculum.vocabulary_segments (vocabulary_item_id);

create index lesson_vocabulary_vocabulary_item_id_idx
	on curriculum.lesson_vocabulary (vocabulary_item_id);

create index lesson_vocabulary_lesson_id_is_drill_target_idx
	on curriculum.lesson_vocabulary (lesson_id, is_drill_target);

create unique index lesson_vocabulary_single_anchor_idx
	on curriculum.lesson_vocabulary (lesson_id)
	where role_key = 'anchor';

commit;
