# Database And DTO Spec

This document turns the database foundation plan into a build-ready v1 specification. It defines the tables, constraints, schemas, runtime DTOs, and write boundaries required to start implementing the Supabase/PostgreSQL backend without reopening the product model each time.

## Final Decisions

These decisions close the remaining gaps in the planning docs.

- Use four database schemas:
  - `curriculum` for normalized authoring data. Not exposed to learners.
  - `delivery` for published runtime bundles. Exposed read-only to runtime surfaces.
  - `learner` for user-owned progress data. Exposed with RLS.
  - `internal_api` for `SECURITY DEFINER` functions and privileged publication/projection helpers. Never exposed directly.
- Resolve lesson-attempt projection with one batch function: `internal_api.sync_lesson_attempt_batch(...)`.
- Keep PostgreSQL enums only for genuinely closed sets such as direction, drill type, lesson-grapheme role, and progress status.
- Use text keys instead of PostgreSQL enums for fields expected to grow or vary by course, such as anchor category and pedagogical grouping.
- Use `anchor_targets` and `anchor_segments` as the canonical curriculum names. They match the product vocabulary better than `text_targets` and `text_segments`.
- Store instrumentation on `learner.lesson_attempts.time_spent_ms`. Do not duplicate it on canonical progress rows in v1.
- Keep translation locale modeling out of v1, but include `source_locale` on `curriculum.course_versions` so later localization work does not require a destructive rename.

## Build Scope

Build now:

- Reference metadata for languages, scripts, courses, and course versions
- Normalized curriculum tables for lessons, anchor targets, graphemes, rules, drills, and joins
- Published delivery bundles per lesson
- Learner enrollments, lesson attempts, lesson progress, device identities, and preferences
- Batch attempt sync and batch progress projection

Defer until the first real need:

- Translation tables
- Spaced-repetition projections
- Push notification preferences
- Admin CMS tables beyond minimal audit lineage
- Audio and image asset tables beyond nullable foreign-key hooks

## Schema Layout

### `curriculum`

Canonical authoring model. The app runtime should not query these tables directly.

### `delivery`

Immutable publication artifacts for runtime reads and offline caching.

### `learner`

Authenticated user data with RLS.

### `internal_api`

Privileged SQL functions called by server-side code only.

## Shared Conventions

- Primary keys: `uuid default gen_random_uuid()` unless noted otherwise.
- Timestamps: `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` on mutable tables.
- Slugs and stable keys are lowercase kebab-case text.
- All `jsonb` columns default to `'{}'::jsonb` unless they hold array payloads.
- Soft deletion is not used for learner-owned rows.
- Curriculum rows tied to published versions are not hard-deleted. Use archival flags on versions and courses.

## PostgreSQL Enums

Use PostgreSQL enums for these closed sets:

- `app_direction`: `ltr | rtl`
- `course_version_status`: `draft | published | archived`
- `grapheme_role`: `new | review`
- `drill_type`: `recognize | match | sound | spot`
- `lesson_progress_status`: `not_started | in_progress | completed`

Do not use PostgreSQL enums for pedagogical grouping, anchor categories, or script-specific labels.

## Table Spec

### `curriculum.languages`

Purpose: reference list of supported spoken languages.

| Column        | Type            | Constraints              |
| ------------- | --------------- | ------------------------ |
| `code`        | `text`          | PK                       |
| `name`        | `text`          | not null                 |
| `native_name` | `text`          | not null                 |
| `direction`   | `app_direction` | not null                 |
| `created_at`  | `timestamptz`   | not null default `now()` |

Indexes:

- PK on `code`

### `curriculum.script_systems`

Purpose: reference list of writing systems and rendering metadata.

| Column        | Type            | Constraints                    |
| ------------- | --------------- | ------------------------------ |
| `id`          | `uuid`          | PK default `gen_random_uuid()` |
| `slug`        | `text`          | not null unique                |
| `name`        | `text`          | not null                       |
| `native_name` | `text`          | not null                       |
| `direction`   | `app_direction` | not null                       |
| `metadata`    | `jsonb`         | not null default `'{}'::jsonb` |
| `created_at`  | `timestamptz`   | not null default `now()`       |

Indexes:

- unique on `slug`

### `curriculum.courses`

Purpose: learner-facing course container.

| Column                         | Type          | Constraints                                                        |
| ------------------------------ | ------------- | ------------------------------------------------------------------ |
| `id`                           | `uuid`        | PK default `gen_random_uuid()`                                     |
| `slug`                         | `text`        | not null unique                                                    |
| `language_code`                | `text`        | not null FK -> `curriculum.languages(code)` on delete restrict     |
| `script_system_id`             | `uuid`        | not null FK -> `curriculum.script_systems(id)` on delete restrict  |
| `name`                         | `text`        | not null                                                           |
| `native_name`                  | `text`        | not null                                                           |
| `hero_title`                   | `text`        | not null                                                           |
| `hero_subtitle`                | `text`        | not null                                                           |
| `seo_title`                    | `text`        | not null                                                           |
| `seo_description`              | `text`        | not null                                                           |
| `ui_config`                    | `jsonb`       | not null default `'{}'::jsonb`                                     |
| `is_active`                    | `boolean`     | not null default `false`                                           |
| `current_published_version_id` | `uuid`        | nullable FK -> `curriculum.course_versions(id)` on delete set null |
| `created_at`                   | `timestamptz` | not null default `now()`                                           |
| `updated_at`                   | `timestamptz` | not null default `now()`                                           |

Indexes:

- unique on `slug`
- index on `language_code`
- index on `script_system_id`
- index on `current_published_version_id`

### `curriculum.course_versions`

Purpose: immutable curriculum releases for a course.

| Column            | Type                    | Constraints                                                |
| ----------------- | ----------------------- | ---------------------------------------------------------- |
| `id`              | `uuid`                  | PK default `gen_random_uuid()`                             |
| `course_id`       | `uuid`                  | not null FK -> `curriculum.courses(id)` on delete restrict |
| `version_ordinal` | `integer`               | not null check `version_ordinal > 0`                       |
| `display_version` | `text`                  | not null                                                   |
| `source_locale`   | `text`                  | not null default `'en'`                                    |
| `status`          | `course_version_status` | not null default `'draft'`                                 |
| `release_title`   | `text`                  | nullable                                                   |
| `release_summary` | `text`                  | nullable                                                   |
| `release_notes`   | `jsonb`                 | not null default `'{}'::jsonb`                             |
| `content_hash`    | `text`                  | nullable                                                   |
| `released_at`     | `timestamptz`           | nullable                                                   |
| `created_by`      | `uuid`                  | nullable                                                   |
| `created_at`      | `timestamptz`           | not null default `now()`                                   |

Indexes:

- unique on `(course_id, version_ordinal)`
- index on `(course_id, status)`

### `curriculum.graphemes`

Purpose: immutable script-unit identity, without lesson-specific pedagogy.

| Column               | Type          | Constraints                                                       |
| -------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                 | `uuid`        | PK default `gen_random_uuid()`                                    |
| `script_system_id`   | `uuid`        | not null FK -> `curriculum.script_systems(id)` on delete restrict |
| `key`                | `text`        | not null                                                          |
| `text`               | `text`        | not null                                                          |
| `kind`               | `text`        | not null                                                          |
| `sort_order`         | `integer`     | not null default `0`                                              |
| `unicode_codepoints` | `text[]`      | not null default `'{}'`                                           |
| `metadata`           | `jsonb`       | not null default `'{}'::jsonb`                                    |
| `created_at`         | `timestamptz` | not null default `now()`                                          |

Indexes:

- unique on `(script_system_id, key)`
- unique on `(script_system_id, text)`
- index on `(script_system_id, sort_order)`

### `curriculum.course_version_graphemes`

Purpose: course-version-specific pedagogy for each grapheme.

| Column                    | Type     | Constraints                                                       |
| ------------------------- | -------- | ----------------------------------------------------------------- |
| `course_version_id`       | `uuid`   | not null FK -> `curriculum.course_versions(id)` on delete cascade |
| `grapheme_id`             | `uuid`   | not null FK -> `curriculum.graphemes(id)` on delete restrict      |
| `romanization`            | `text`   | nullable                                                          |
| `pronunciation_hint`      | `text`   | nullable                                                          |
| `mnemonic`                | `text`   | nullable                                                          |
| `position`                | `text`   | nullable                                                          |
| `pedagogical_group_key`   | `text`   | nullable                                                          |
| `pedagogical_group_label` | `text`   | nullable                                                          |
| `details`                 | `jsonb`  | not null default `'{}'::jsonb`                                    |
| `tags`                    | `text[]` | not null default `'{}'`                                           |

Primary key:

- `(course_version_id, grapheme_id)`

Indexes:

- index on `(course_version_id)`
- GIN index on `tags`

### `curriculum.orthography_rules`

Purpose: reusable rule definitions within a course version.

| Column              | Type          | Constraints                                                       |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                    |
| `course_version_id` | `uuid`        | not null FK -> `curriculum.course_versions(id)` on delete cascade |
| `key`               | `text`        | not null                                                          |
| `name`              | `text`        | not null                                                          |
| `short_description` | `text`        | not null                                                          |
| `explanation`       | `text`        | not null                                                          |
| `metadata`          | `jsonb`       | not null default `'{}'::jsonb`                                    |
| `created_at`        | `timestamptz` | not null default `now()`                                          |

Indexes:

- unique on `(course_version_id, key)`

### `curriculum.orthography_rule_examples`

Purpose: ordered examples for rules.

| Column          | Type      | Constraints                                                         |
| --------------- | --------- | ------------------------------------------------------------------- |
| `id`            | `uuid`    | PK default `gen_random_uuid()`                                      |
| `rule_id`       | `uuid`    | not null FK -> `curriculum.orthography_rules(id)` on delete cascade |
| `example_order` | `integer` | not null check `example_order > 0`                                  |
| `text`          | `text`    | not null                                                            |
| `translation`   | `text`    | nullable                                                            |

Indexes:

- unique on `(rule_id, example_order)`

### `curriculum.lessons`

Purpose: ordered lesson units within a course version.

| Column              | Type          | Constraints                                                       |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                    |
| `course_version_id` | `uuid`        | not null FK -> `curriculum.course_versions(id)` on delete cascade |
| `slug`              | `text`        | not null                                                          |
| `lesson_ordinal`    | `integer`     | not null check `lesson_ordinal > 0`                               |
| `stage`             | `integer`     | not null check `stage > 0`                                        |
| `title`             | `text`        | not null                                                          |
| `metadata`          | `jsonb`       | not null default `'{}'::jsonb`                                    |
| `created_at`        | `timestamptz` | not null default `now()`                                          |

Indexes:

- unique on `(course_version_id, slug)`
- unique on `(course_version_id, lesson_ordinal)`
- index on `(course_version_id, stage)`

### `curriculum.anchor_targets`

Purpose: the anchor word or tightly related reading target for a lesson.

| Column            | Type    | Constraints                                                      |
| ----------------- | ------- | ---------------------------------------------------------------- |
| `id`              | `uuid`  | PK default `gen_random_uuid()`                                   |
| `lesson_id`       | `uuid`  | not null unique FK -> `curriculum.lessons(id)` on delete cascade |
| `slug`            | `text`  | not null                                                         |
| `display_text`    | `text`  | not null                                                         |
| `normalized_text` | `text`  | not null                                                         |
| `meaning`         | `text`  | not null                                                         |
| `pronunciation`   | `text`  | not null                                                         |
| `category_key`    | `text`  | nullable                                                         |
| `context_note`    | `text`  | nullable                                                         |
| `metadata`        | `jsonb` | not null default `'{}'::jsonb`                                   |

Indexes:

- unique on `(lesson_id)`
- unique on `(lesson_id, slug)`
- index on `category_key`

### `curriculum.anchor_segments`

Purpose: ordered readable segments of an anchor target.

| Column             | Type      | Constraints                                                      |
| ------------------ | --------- | ---------------------------------------------------------------- |
| `id`               | `uuid`    | PK default `gen_random_uuid()`                                   |
| `anchor_target_id` | `uuid`    | not null FK -> `curriculum.anchor_targets(id)` on delete cascade |
| `segment_order`    | `integer` | not null check `segment_order > 0`                               |
| `text`             | `text`    | not null                                                         |
| `sound`            | `text`    | not null                                                         |
| `kind`             | `text`    | nullable                                                         |
| `metadata`         | `jsonb`   | not null default `'{}'::jsonb`                                   |

Indexes:

- unique on `(anchor_target_id, segment_order)`

### `curriculum.lesson_graphemes`

Purpose: ordered lesson membership for new and review graphemes.

| Column            | Type            | Constraints                                                  |
| ----------------- | --------------- | ------------------------------------------------------------ |
| `lesson_id`       | `uuid`          | not null FK -> `curriculum.lessons(id)` on delete cascade    |
| `grapheme_id`     | `uuid`          | not null FK -> `curriculum.graphemes(id)` on delete restrict |
| `role`            | `grapheme_role` | not null                                                     |
| `ordinal_in_role` | `integer`       | not null check `ordinal_in_role > 0`                         |

Primary key:

- `(lesson_id, grapheme_id, role)`

Indexes:

- unique on `(lesson_id, role, ordinal_in_role)`
- index on `(grapheme_id)`

### `curriculum.lesson_rules`

Purpose: ordered rule membership per lesson.

| Column       | Type      | Constraints                                                          |
| ------------ | --------- | -------------------------------------------------------------------- |
| `lesson_id`  | `uuid`    | not null FK -> `curriculum.lessons(id)` on delete cascade            |
| `rule_id`    | `uuid`    | not null FK -> `curriculum.orthography_rules(id)` on delete restrict |
| `rule_order` | `integer` | not null check `rule_order > 0`                                      |

Primary key:

- `(lesson_id, rule_id)`

Indexes:

- unique on `(lesson_id, rule_order)`

### `curriculum.drills`

Purpose: deterministic drill definitions.

| Column              | Type          | Constraints                                                       |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                    |
| `course_version_id` | `uuid`        | not null FK -> `curriculum.course_versions(id)` on delete cascade |
| `key`               | `text`        | not null                                                          |
| `type`              | `drill_type`  | not null                                                          |
| `prompt`            | `text`        | not null                                                          |
| `hint`              | `text`        | nullable                                                          |
| `payload`           | `jsonb`       | not null default `'{}'::jsonb`                                    |
| `created_at`        | `timestamptz` | not null default `now()`                                          |

Indexes:

- unique on `(course_version_id, key)`
- index on `(course_version_id, type)`

Notes:

- `payload` is for drill-type-specific fields that are not shared across every drill family.
- If JSON Schema enforcement is added in SQL, keep it inside `internal_api` or migration helpers, not route code.

### `curriculum.drill_options`

Purpose: answer choices for choice-based drills.

| Column         | Type      | Constraints                                              |
| -------------- | --------- | -------------------------------------------------------- |
| `id`           | `uuid`    | PK default `gen_random_uuid()`                           |
| `drill_id`     | `uuid`    | not null FK -> `curriculum.drills(id)` on delete cascade |
| `option_order` | `integer` | not null check `option_order > 0`                        |
| `text`         | `text`    | not null                                                 |
| `is_correct`   | `boolean` | not null default `false`                                 |
| `rationale`    | `text`    | nullable                                                 |

Indexes:

- unique on `(drill_id, option_order)`
- partial unique index on `(drill_id)` where `is_correct = true`

### `curriculum.lesson_drills`

Purpose: ordered drill membership per lesson.

| Column        | Type      | Constraints                                               |
| ------------- | --------- | --------------------------------------------------------- |
| `lesson_id`   | `uuid`    | not null FK -> `curriculum.lessons(id)` on delete cascade |
| `drill_id`    | `uuid`    | not null FK -> `curriculum.drills(id)` on delete restrict |
| `drill_order` | `integer` | not null check `drill_order > 0`                          |

Primary key:

- `(lesson_id, drill_id)`

Indexes:

- unique on `(lesson_id, drill_order)`

### `delivery.course_publications`

Purpose: immutable publication manifests for runtime delivery.

| Column              | Type          | Constraints                                                        |
| ------------------- | ------------- | ------------------------------------------------------------------ |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                     |
| `course_version_id` | `uuid`        | not null FK -> `curriculum.course_versions(id)` on delete restrict |
| `manifest_hash`     | `text`        | not null unique                                                    |
| `is_active`         | `boolean`     | not null default `false`                                           |
| `created_by`        | `uuid`        | nullable                                                           |
| `created_at`        | `timestamptz` | not null default `now()`                                           |

Indexes:

- unique on `(course_version_id, manifest_hash)`
- index on `(course_version_id, is_active)`

### `delivery.course_publication_lessons`

Purpose: lesson-level published bundles for runtime reads.

| Column           | Type          | Constraints                                                         |
| ---------------- | ------------- | ------------------------------------------------------------------- |
| `id`             | `uuid`        | PK default `gen_random_uuid()`                                      |
| `publication_id` | `uuid`        | not null FK -> `delivery.course_publications(id)` on delete cascade |
| `lesson_id`      | `uuid`        | not null FK -> `curriculum.lessons(id)` on delete restrict          |
| `lesson_slug`    | `text`        | not null                                                            |
| `lesson_ordinal` | `integer`     | not null                                                            |
| `payload`        | `jsonb`       | not null                                                            |
| `payload_hash`   | `text`        | not null                                                            |
| `created_at`     | `timestamptz` | not null default `now()`                                            |

Indexes:

- unique on `(publication_id, lesson_id)`
- unique on `(publication_id, lesson_slug)`
- index on `(publication_id, lesson_ordinal)`
- index on `(publication_id, payload_hash)`

### `learner.profiles`

Purpose: user profile shell tied to Supabase auth.

| Column         | Type          | Constraints                                 |
| -------------- | ------------- | ------------------------------------------- |
| `user_id`      | `uuid`        | PK FK -> `auth.users(id)` on delete cascade |
| `display_name` | `text`        | nullable                                    |
| `created_at`   | `timestamptz` | not null default `now()`                    |
| `updated_at`   | `timestamptz` | not null default `now()`                    |

### `learner.devices`

Purpose: known learner devices or installations for sync and diagnostics.

| Column             | Type          | Constraints                                       |
| ------------------ | ------------- | ------------------------------------------------- |
| `id`               | `uuid`        | PK default `gen_random_uuid()`                    |
| `user_id`          | `uuid`        | not null FK -> `auth.users(id)` on delete cascade |
| `client_device_id` | `text`        | not null                                          |
| `platform`         | `text`        | nullable                                          |
| `last_seen_at`     | `timestamptz` | not null default `now()`                          |
| `created_at`       | `timestamptz` | not null default `now()`                          |

Indexes:

- unique on `(user_id, client_device_id)`
- index on `(user_id, last_seen_at desc)`

### `learner.course_enrollments`

Purpose: learner membership and course-version pinning.

| Column              | Type          | Constraints                                                        |
| ------------------- | ------------- | ------------------------------------------------------------------ |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                     |
| `user_id`           | `uuid`        | not null FK -> `auth.users(id)` on delete cascade                  |
| `course_id`         | `uuid`        | not null FK -> `curriculum.courses(id)` on delete restrict         |
| `course_version_id` | `uuid`        | not null FK -> `curriculum.course_versions(id)` on delete restrict |
| `current_lesson_id` | `uuid`        | nullable FK -> `curriculum.lessons(id)` on delete set null         |
| `started_at`        | `timestamptz` | not null default `now()`                                           |
| `last_active_at`    | `timestamptz` | not null default `now()`                                           |
| `completed_at`      | `timestamptz` | nullable                                                           |
| `created_at`        | `timestamptz` | not null default `now()`                                           |
| `updated_at`        | `timestamptz` | not null default `now()`                                           |

Indexes:

- unique on `(user_id, course_id, course_version_id)`
- index on `(user_id, last_active_at desc)`
- index on `(course_version_id)`

### `learner.lesson_attempts`

Purpose: append-only learner sync units.

| Column              | Type          | Constraints                                                       |
| ------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                | `uuid`        | PK default `gen_random_uuid()`                                    |
| `user_id`           | `uuid`        | not null FK -> `auth.users(id)` on delete cascade                 |
| `enrollment_id`     | `uuid`        | not null FK -> `learner.course_enrollments(id)` on delete cascade |
| `lesson_id`         | `uuid`        | not null FK -> `curriculum.lessons(id)` on delete restrict        |
| `device_id`         | `uuid`        | nullable FK -> `learner.devices(id)` on delete set null           |
| `client_attempt_id` | `text`        | not null                                                          |
| `score`             | `integer`     | nullable check `score between 0 and 100`                          |
| `completed`         | `boolean`     | not null default `false`                                          |
| `time_spent_ms`     | `integer`     | nullable check `time_spent_ms >= 0`                               |
| `attempt_payload`   | `jsonb`       | not null default `'{}'::jsonb`                                    |
| `completed_at`      | `timestamptz` | not null                                                          |
| `processed_at`      | `timestamptz` | nullable                                                          |
| `created_at`        | `timestamptz` | not null default `now()`                                          |

Indexes:

- unique on `(enrollment_id, client_attempt_id)`
- index on `(user_id, enrollment_id, processed_at)`
- index on `(enrollment_id, lesson_id, completed_at)`

### `learner.lesson_progress`

Purpose: canonical learner state per lesson.

| Column               | Type                     | Constraints                                                       |
| -------------------- | ------------------------ | ----------------------------------------------------------------- |
| `id`                 | `uuid`                   | PK default `gen_random_uuid()`                                    |
| `user_id`            | `uuid`                   | not null FK -> `auth.users(id)` on delete cascade                 |
| `enrollment_id`      | `uuid`                   | not null FK -> `learner.course_enrollments(id)` on delete cascade |
| `lesson_id`          | `uuid`                   | not null FK -> `curriculum.lessons(id)` on delete restrict        |
| `status`             | `lesson_progress_status` | not null default `'not_started'`                                  |
| `best_score`         | `integer`                | nullable check `best_score between 0 and 100`                     |
| `latest_score`       | `integer`                | nullable check `latest_score between 0 and 100`                   |
| `attempt_count`      | `integer`                | not null default `0` check `attempt_count >= 0`                   |
| `first_completed_at` | `timestamptz`            | nullable                                                          |
| `last_attempt_at`    | `timestamptz`            | nullable                                                          |
| `updated_at`         | `timestamptz`            | not null default `now()`                                          |

Indexes:

- unique on `(enrollment_id, lesson_id)`
- index on `(user_id, enrollment_id)`
- index on `(enrollment_id, status)`

### `learner.preferences`

Purpose: user-level learning preferences.

| Column                     | Type          | Constraints                                 |
| -------------------------- | ------------- | ------------------------------------------- |
| `user_id`                  | `uuid`        | PK FK -> `auth.users(id)` on delete cascade |
| `show_romanization`        | `boolean`     | not null default `true`                     |
| `show_pronunciation_hints` | `boolean`     | not null default `true`                     |
| `auto_prefetch_lessons`    | `boolean`     | not null default `true`                     |
| `updated_at`               | `timestamptz` | not null default `now()`                    |

## Runtime DTO Boundary

The app should consume delivery DTOs and learner DTOs, not normalized curriculum rows.

### Course DTOs

```ts
export type CourseSummaryDTO = {
	id: string;
	slug: string;
	name: string;
	nativeName: string;
	languageCode: string;
	scriptSystem: {
		slug: string;
		name: string;
		direction: "ltr" | "rtl";
	};
	currentVersion: {
		id: string;
		displayVersion: string;
		versionOrdinal: number;
	};
	heroTitle: string;
	heroSubtitle: string;
	seoTitle: string;
	seoDescription: string;
	totalLessons: number;
};

export type LessonListItemDTO = {
	id: string;
	slug: string;
	lessonOrdinal: number;
	stage: number;
	title: string;
	anchor: {
		text: string;
		meaning: string;
	};
	newGraphemeIds: string[];
	reviewGraphemeIds: string[];
};
```

### Lesson Bundle DTO

```ts
export type GraphemeDTO = {
	id: string;
	text: string;
	kind: string;
	romanization?: string;
	pronunciationHint?: string;
	mnemonic?: string;
	position?: string;
	pedagogicalGroupKey?: string;
	pedagogicalGroupLabel?: string;
	details?: Record<string, unknown>;
	tags?: string[];
};

export type AnchorSegmentDTO = {
	text: string;
	sound: string;
	kind?: string;
};

export type AnchorTargetDTO = {
	id: string;
	slug: string;
	text: string;
	meaning: string;
	pronunciation: string;
	categoryKey?: string;
	contextNote?: string;
	segments: AnchorSegmentDTO[];
};

export type RuleDTO = {
	id: string;
	key: string;
	name: string;
	shortDescription: string;
	explanation: string;
	examples: Array<{
		text: string;
		translation?: string;
	}>;
};

export type DrillOptionDTO = {
	text: string;
	isCorrect?: boolean;
	rationale?: string;
};

export type DrillDTO = {
	id: string;
	key: string;
	type: "recognize" | "match" | "sound" | "spot";
	prompt: string;
	hint?: string;
	payload?: Record<string, unknown>;
	options: DrillOptionDTO[];
};

export type LessonBundleDTO = {
	course: {
		id: string;
		slug: string;
		versionId: string;
		displayVersion: string;
	};
	lesson: {
		id: string;
		slug: string;
		lessonOrdinal: number;
		stage: number;
		title: string;
		anchor: AnchorTargetDTO;
		newGraphemes: GraphemeDTO[];
		reviewGraphemes: GraphemeDTO[];
		rules: RuleDTO[];
		drills: DrillDTO[];
	};
};
```

### Learner DTOs

```ts
export type EnrollmentProgressDTO = {
	enrollmentId: string;
	courseSlug: string;
	courseVersionId: string;
	currentLessonSlug?: string;
	completedLessonSlugs: string[];
	lessonProgress: Array<{
		lessonSlug: string;
		status: "not_started" | "in_progress" | "completed";
		bestScore?: number;
		latestScore?: number;
		attemptCount: number;
		firstCompletedAt?: string;
		lastAttemptAt?: string;
	}>;
};

export type LessonAttemptInputDTO = {
	clientAttemptId: string;
	lessonId: string;
	completed: boolean;
	score?: number;
	timeSpentMs?: number;
	attemptPayload?: Record<string, unknown>;
	completedAt: string;
};

export type SyncLessonAttemptBatchInputDTO = {
	enrollmentId: string;
	deviceId?: string;
	attempts: LessonAttemptInputDTO[];
};

export type SyncLessonAttemptBatchResultDTO = {
	insertedAttemptCount: number;
	updatedLessonCount: number;
	currentLessonId?: string;
	currentLessonSlug?: string;
	processedAt: string;
};
```

## Projection Contract

Projection is handled by one server-owned function:

- `internal_api.sync_lesson_attempt_batch(p_user_id uuid, p_enrollment_id uuid, p_device_id uuid, p_attempts jsonb)`

Required behavior:

- Insert only attempts whose `(enrollment_id, client_attempt_id)` pair does not already exist.
- Process attempts in ascending `completed_at`, then ascending `client_attempt_id` for deterministic ties.
- Upsert `learner.lesson_progress` in the same transaction.
- Set `processed_at` on inserted attempts in the same transaction.
- Update `learner.course_enrollments.current_lesson_id` to the first incomplete lesson after projection.
- Return inserted-attempt count, updated-lesson count, resolved current lesson, and batch timestamp.

Merge rules:

- `best_score = max(existing.best_score, incoming.score)`
- `latest_score = score of the newest processed attempt`
- `attempt_count = existing.attempt_count + number of newly inserted attempts for the lesson`
- `status = completed` once any processed attempt marks the lesson completed
- `first_completed_at = earliest completion timestamp ever observed`
- `last_attempt_at = latest processed attempt timestamp`

Failure behavior:

- If projection fails, no attempt in the batch is marked processed.
- Retrying the same batch is safe because attempt insertion is idempotent.

## RLS Boundary

This spec is not a full policy document, but these rules are fixed:

- `curriculum.*` is not exposed to `anon` or `authenticated`.
- `delivery.*` is read-only for runtime access.
- `learner.*` is user-owned and policy-scoped on `user_id = auth.uid()`.
- Clients may `select` and `insert` into `learner.lesson_attempts` for their own rows.
- Clients may only `select` from `learner.lesson_progress` and `learner.course_enrollments` for their own rows.
- Clients may not directly `insert`, `update`, or `delete` `learner.lesson_progress`.
- Server-side code calls `internal_api.sync_lesson_attempt_batch(...)` after verifying the authenticated user and enrollment.

## Migration Order

When building the DB, keep this order:

1. Create schemas and PostgreSQL enums.
2. Create reference tables and core curriculum tables.
3. Create delivery tables.
4. Create learner tables.
5. Add indexes and unique constraints that depend on created tables.
6. Add `internal_api` functions.
7. Enable RLS and add policies.
8. Seed reference data, then seed the first course and publish its first course version.

## Mapping From Current TypeScript Model

Current runtime model to target backend model:

- `LanguagePack` -> `curriculum.courses` + `curriculum.course_versions` + published `CourseSummaryDTO`
- `Lesson` -> `curriculum.lessons` + joins + published `LessonBundleDTO.lesson`
- `Word` -> `curriculum.anchor_targets`
- `SyllableBreakdown` -> `curriculum.anchor_segments`
- `Letter` -> `curriculum.graphemes` + `curriculum.course_version_graphemes`
- `Rule` -> `curriculum.orthography_rules` + `curriculum.orthography_rule_examples`
- `DrillQuestion` -> `curriculum.drills` + `curriculum.drill_options`
- `LessonProgress` -> `learner.lesson_progress`
- `AppProgress.currentLessonId` -> `learner.course_enrollments.current_lesson_id`
- `knownLetters` and `knownWords` -> derived from completed lessons, not stored canonically

## Build-Now Checklist

- Implement the schemas, enums, and tables in this document.
- Seed the current Thai course into the normalized curriculum model.
- Implement one publication generator that emits `LessonBundleDTO` payloads into `delivery.course_publication_lessons`.
- Implement one server-side batch sync function for lesson attempts.
- Keep route and component code bound only to the DTOs in this document.
