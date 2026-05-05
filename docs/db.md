# Database Guide

This is the durable operations guide for GlyphBridge's database. Use it when you need
to understand how the database is organized, which schema a feature should read or
write, how to inspect the live database, which Supabase CLI commands matter day to
day, and how to deploy the schema to a remote Supabase project safely.

For the exact table-by-table contract, constraints, and DTO mapping, see
[database-dto-spec.md](./database-dto-spec.md). This file is the README-style
overview and runbook.

## What The Database Is For

The database has four jobs:

- Store the canonical curriculum model.
- Store published lesson bundles that the runtime app can safely read.
- Store learner-owned progress and attempt history.
- Provide privileged server-side functions for sync and projection.

The important separation is this:

- `curriculum` is the source-of-truth authoring model.
- `delivery` is the runtime-facing published content.
- `learner` is the user-owned progress model.
- `internal_api` is where privileged SQL logic lives.

## Current Local Seeded State

At the time of writing:

- the local seed contains `1` course and `1` published course version
- the Thai seed contains `13` lessons
- the current vocabulary model contains `39` vocabulary items
- the current publication layer contains `13` `delivery.course_publication_lessons`
  rows
- `src/lib/data/thai.ts` remains the curriculum source of truth, and
  `scripts/generate-thai-seed.mjs` regenerates `supabase/seed.sql`
- the runtime app reads published lesson bundles from `delivery.*` through
  server-owned SvelteKit boundaries and generated publication artifacts

## Schema Map

### `curriculum`

Private authoring data. The app runtime should not query this schema directly.

Main table groups:

- course metadata: `languages`, `script_systems`, `courses`, `course_versions`
- lesson content: `lessons`, `vocabulary_items`, `vocabulary_segments`, `anchor_targets`, `anchor_segments`
- script teaching model: `graphemes`, `course_version_graphemes`
- rules and drills: `orthography_rules`, `orthography_rule_examples`, `drills`, `drill_options`
- lesson joins: `lesson_graphemes`, `lesson_rules`, `lesson_drills`, `lesson_vocabulary`

Anchor note:

- `anchor_targets` remains the featured lesson word for the current runtime contract.
- Reusable lesson vocabulary now belongs in `vocabulary_items` and `lesson_vocabulary` so the same word can appear in multiple lessons and later power standalone vocabulary drilling.

## Table Role Reference

Use this section when you need a fast answer to “what does this table do?” without
opening the full DTO spec.

### `curriculum` table roles

| Table                       | Role                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `languages`                 | Reference list of spoken languages supported by courses.                                                  |
| `script_systems`            | Reference list of writing systems and rendering metadata.                                                 |
| `courses`                   | Learner-facing course container with hero copy, SEO copy, and current published version pointer.          |
| `course_versions`           | Immutable curriculum releases for a course.                                                               |
| `graphemes`                 | Canonical script units independent of lesson ordering.                                                    |
| `course_version_graphemes`  | Course-version-specific pedagogy for each grapheme, such as mnemonics and pronunciation hints.            |
| `lessons`                   | Ordered lesson metadata within a course version.                                                          |
| `vocabulary_items`          | Reusable words taught in a course version.                                                                |
| `vocabulary_segments`       | Ordered syllabic or segment breakdown for each vocabulary item.                                           |
| `lesson_vocabulary`         | Join table assigning vocabulary items to lessons with `anchor` or `support` role and drill-target status. |
| `anchor_targets`            | Featured lesson-word projection for the current runtime lesson contract.                                  |
| `anchor_segments`           | Segment breakdown for the featured anchor target.                                                         |
| `orthography_rules`         | Reusable reading or spelling rules introduced in lessons.                                                 |
| `orthography_rule_examples` | Ordered examples attached to a rule.                                                                      |
| `lesson_graphemes`          | Join table describing which graphemes are new or review content in a lesson.                              |
| `lesson_rules`              | Ordered rule assignments for a lesson.                                                                    |
| `drills`                    | Canonical drill prompts for a course version.                                                             |
| `drill_options`             | Ordered answer options for a drill, including the correct option marker.                                  |
| `lesson_drills`             | Ordered drill assignments for a lesson.                                                                   |

### `delivery` table roles

| Table                        | Role                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `course_publications`        | Immutable publication manifest for a course version.                           |
| `course_publication_lessons` | Per-lesson published JSON bundle that learner-facing runtime reads should use. |

### `learner` table roles

| Table                | Role                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------ |
| `profiles`           | User profile shell tied to Supabase Auth user IDs.                                   |
| `devices`            | Known learner devices or installations for sync and diagnostics.                     |
| `course_enrollments` | Learner membership in a course version, including current lesson pointer.            |
| `lesson_attempts`    | Append-only raw learner attempts received by the server-owned sync boundary.         |
| `lesson_progress`    | Derived canonical learner progress per lesson.                                       |
| `preferences`        | Learner-level study preferences such as romanization and pronunciation-hint toggles. |

### `internal_api` function roles

| Function                         | Role                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `handle_new_user()`              | Bootstrap helper invoked from auth-trigger flow.                                          |
| `set_updated_at()`               | Shared trigger helper for mutable tables.                                                 |
| `sync_lesson_attempt_batch(...)` | Privileged projector that validates attempts, inserts them, and updates learner progress. |

### `delivery`

Published runtime bundles. This is what learner-facing reads should use.

Main tables:

- `course_publications`
- `course_publication_lessons`

### `learner`

User-owned progress and preferences, protected by RLS.

Main tables:

- `profiles`
- `devices`
- `course_enrollments`
- `lesson_attempts`
- `lesson_progress`
- `preferences`

### `internal_api`

Privileged SQL helpers that should only be called from server-side code.

Current functions:

- `handle_new_user()`
- `set_updated_at()`
- `sync_lesson_attempt_batch(...)`

## How Data Flows

The database is designed around a one-way content flow and a one-way progress flow.

### Content flow

1. Curriculum is authored in `curriculum.*`.
2. A course version is published into `delivery.course_publications` and `delivery.course_publication_lessons`.
3. The learner-facing app reads published bundles from `delivery.*`.

### Learner flow

1. A learner is enrolled in a course version through `learner.course_enrollments`.
2. The client sends lesson attempts to a server-owned SvelteKit boundary.
3. Server-side code calls `internal_api.sync_lesson_attempt_batch(...)`, which inserts validated attempts into `learner.lesson_attempts`.
4. That function updates `learner.lesson_progress` and the learner's current lesson pointer.

## Runtime Boundaries

These rules are the most important part of the database design.

- Do not read `curriculum.*` directly from learner-facing routes or components.
- Read published lesson content from `delivery.*`.
- Do not let clients write directly to `learner.lesson_attempts`; route attempt sync through server-owned code.
- Do not let clients write directly to `learner.lesson_progress`.
- Treat `learner.devices` as a future server-owned registration surface, not an open client-write table.
- Project progress through `internal_api.sync_lesson_attempt_batch(...)`.
- Treat `curriculum` and `internal_api` as private implementation schemas.

If a feature crosses these boundaries, stop and review the design before adding code.

## Where Things Live In The Repo

- Local Supabase config: [supabase/config.toml](../supabase/config.toml)
- Baseline schema migration: [supabase/migrations/20260425130000_schema_foundation.sql](../supabase/migrations/20260425130000_schema_foundation.sql)
- Security and sync migration: [supabase/migrations/20260425131000_security_and_sync.sql](../supabase/migrations/20260425131000_security_and_sync.sql)
- Local seed entry point: [supabase/seed.sql](../supabase/seed.sql)
- Detailed contract doc: [database-dto-spec.md](./database-dto-spec.md)

## Local Development Workflow

### Start the local stack

```sh
pnpm exec supabase start
```

This starts the local Postgres database, API, Studio, auth, and other Supabase services.

### Stop the local stack

```sh
pnpm exec supabase stop
```

Use `--no-backup` only if you explicitly want to discard local database state.

### Reset the database from migrations

```sh
pnpm exec supabase db reset --yes
```

Use this whenever you want to rebuild the local database from scratch and re-run the seed file.

### Check local service status

```sh
pnpm exec supabase status
```

This is the quickest way to confirm the local stack is up and to see current service URLs.

### Current local access surfaces

When the local stack is running, `supabase status` will print the current URLs.
Typical local values in this repo are:

- Studio: `http://127.0.0.1:54323`
- REST API: `http://127.0.0.1:54321/rest/v1`
- GraphQL API: `http://127.0.0.1:54321/graphql/v1`
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

Use REST or GraphQL only for exposed schemas and least-privilege access paths. Do not
try to build learner-facing features by reaching directly into private `curriculum` or
`internal_api` objects from client code.

### Open Supabase Studio

Open the Studio URL shown by `pnpm exec supabase status`.

### Connect with `psql`

If you want direct SQL access:

```sh
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

If the local connection details ever change, `pnpm exec supabase status` and `pnpm exec supabase start` will print the current values.

## Supabase CLI Workflow

These are the commands you will use most often in this repo.

### Create a migration file

```sh
pnpm exec supabase migration new add_some_change
```

This creates a timestamped SQL file in `supabase/migrations/`.

### Lint the database

```sh
pnpm exec supabase db lint
```

Use this after schema changes. The CLI also supports linting the linked remote
project with `pnpm exec supabase db lint --linked`.

### Run database advisors

```sh
pnpm exec supabase db advisors
```

Use this for an extra security or performance sanity check locally or with
`--linked` against a linked remote project.

### Generate database types

```sh
pnpm exec supabase gen types --local > types.ts
```

This repo does not currently commit generated DB types, but this command is the
standard way to generate them when you need an integration check.

### Compare migrations with a database

```sh
pnpm exec supabase db diff
```

Use this when you need to understand drift between the migration files and a live
database. Prefer fixing drift through explicit migrations rather than manual edits.

## Common SQL Queries

These are the queries you will run most often while working on curriculum, delivery,
or learner-state features.

### Check the seeded content footprint

```sql
select
  (select count(*) from curriculum.courses) as courses,
  (select count(*) from curriculum.course_versions) as course_versions,
  (select count(*) from curriculum.lessons) as lessons,
  (select count(*) from curriculum.vocabulary_items) as vocabulary_items,
  (select count(*) from delivery.course_publication_lessons) as publication_lessons;
```

### List courses, versions, and active publications

```sql
select
  c.slug as course_slug,
  cv.version_ordinal,
  cv.display_version,
  cp.id as publication_id,
  cp.is_active,
  cp.manifest_hash,
  count(cpl.id) as lesson_bundle_count
from curriculum.courses c
join curriculum.course_versions cv
  on cv.course_id = c.id
left join delivery.course_publications cp
  on cp.course_version_id = cv.id
left join delivery.course_publication_lessons cpl
  on cpl.publication_id = cp.id
group by
  c.slug,
  cv.version_ordinal,
  cv.display_version,
  cp.id,
  cp.is_active,
  cp.manifest_hash
order by c.slug, cv.version_ordinal;
```

### List lessons with anchor words, vocabulary counts, and drill counts

```sql
select
  l.lesson_ordinal,
  l.slug as lesson_slug,
  l.title,
  a.display_text as anchor_word,
  (
    select count(*)
    from curriculum.lesson_vocabulary lv
    where lv.lesson_id = l.id
  ) as vocabulary_count,
  (
    select count(*)
    from curriculum.lesson_rules lr
    where lr.lesson_id = l.id
  ) as rule_count,
  (
    select count(*)
    from curriculum.lesson_drills ld
    where ld.lesson_id = l.id
  ) as drill_count
from curriculum.lessons l
left join curriculum.anchor_targets a
  on a.lesson_id = l.id
order by l.lesson_ordinal;
```

### Inspect the vocabulary taught in one lesson

```sql
select
  l.lesson_ordinal,
  l.slug as lesson_slug,
  lv.role_key,
  lv.ordinal_in_role,
  lv.is_drill_target,
  vi.display_text,
  vi.meaning,
  vi.pronunciation
from curriculum.lessons l
join curriculum.lesson_vocabulary lv
  on lv.lesson_id = l.id
join curriculum.vocabulary_items vi
  on vi.id = lv.vocabulary_item_id
where l.slug = 'maak'
order by lv.role_key, lv.ordinal_in_role;
```

### Fetch one published lesson bundle by slug

```sql
select
  c.slug as course_slug,
  cpl.lesson_slug,
  cpl.lesson_ordinal,
  cpl.payload
from curriculum.courses c
join curriculum.course_versions cv
  on cv.id = c.current_published_version_id
join delivery.course_publications cp
  on cp.course_version_id = cv.id
  and cp.is_active = true
join delivery.course_publication_lessons cpl
  on cpl.publication_id = cp.id
where c.slug = 'thai'
  and cpl.lesson_slug = 'maak';
```

### Inspect new and review graphemes for one lesson

```sql
select
  l.lesson_ordinal,
  l.slug as lesson_slug,
  lg.role,
  lg.ordinal_in_role,
  g.text,
  cvg.romanization,
  cvg.pronunciation_hint
from curriculum.lessons l
join curriculum.lesson_graphemes lg
  on lg.lesson_id = l.id
join curriculum.graphemes g
  on g.id = lg.grapheme_id
join curriculum.course_version_graphemes cvg
  on cvg.course_version_id = l.course_version_id
  and cvg.grapheme_id = g.id
where l.slug = 'maak'
order by lg.role, lg.ordinal_in_role;
```

### Inspect learner progress for one user

```sql
select
  ce.id as enrollment_id,
  c.slug as course_slug,
  l.lesson_ordinal,
  l.slug as lesson_slug,
  lp.status,
  lp.best_score,
  lp.latest_score,
  lp.attempt_count,
  lp.last_attempt_at
from learner.course_enrollments ce
join curriculum.courses c
  on c.id = ce.course_id
join learner.lesson_progress lp
  on lp.enrollment_id = ce.id
join curriculum.lessons l
  on l.id = lp.lesson_id
where ce.user_id = '00000000-0000-0000-0000-000000000000'::uuid
order by l.lesson_ordinal;
```

Replace the placeholder UUID before running this query.

## How To Inspect The Database Quickly

### In Supabase Studio

Use Studio when you want a fast visual view of:

- tables and columns
- row data
- policies
- function presence

Good first checks:

- open the table editor and verify which schema a table lives in
- open the SQL editor when you need to inspect joins, policies, or indexes

### In `psql`

These commands are the fastest way to navigate the live database.

List schemas:

```sql
\dn
```

List all tables in the database:

```sql
\dt *.*
```

List tables in one schema:

```sql
\dt curriculum.*
\dt delivery.*
\dt learner.*
```

Describe a table:

```sql
\d curriculum.lessons
\d learner.lesson_progress
```

List functions in the private API schema:

```sql
\df internal_api.*
```

### With SQL introspection queries

Use these queries when you want something copy-pasteable and precise.

List all non-system tables by schema:

```sql
select
  table_schema,
  table_name
from information_schema.tables
where table_schema in ('curriculum', 'delivery', 'learner', 'internal_api')
  and table_type = 'BASE TABLE'
order by table_schema, table_name;
```

Show columns for one table:

```sql
select
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'learner'
  and table_name = 'lesson_progress'
order by ordinal_position;
```

Show foreign keys:

```sql
select
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema as foreign_table_schema,
  ccu.table_name as foreign_table_name,
  ccu.column_name as foreign_column_name,
  tc.constraint_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema in ('curriculum', 'delivery', 'learner')
order by tc.table_schema, tc.table_name, tc.constraint_name;
```

Show indexes:

```sql
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname in ('curriculum', 'delivery', 'learner')
order by schemaname, tablename, indexname;
```

Show RLS policies:

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('delivery', 'learner')
order by schemaname, tablename, policyname;
```

Show functions in `internal_api`:

```sql
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as returns,
  p.prosecdef as is_security_definer
from pg_proc p
join pg_namespace n
  on n.oid = p.pronamespace
where n.nspname = 'internal_api'
order by p.proname;
```

Show which tables have RLS enabled:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname in ('delivery', 'learner')
order by schemaname, tablename;
```

## How To Analyze A Feature Against The Database

When building or reviewing a feature, use this order.

### If the feature changes course content

Start with:

- `curriculum.*` tables
- publication logic into `delivery.*`
- `docs/database-dto-spec.md`

Questions to answer:

- Is this a curriculum fact or a runtime projection?
- Does this belong in a normalized table or only in a published bundle?
- Does the runtime app really need this, or should it stay private to publication time?

### If the feature changes learner behavior

Start with:

- `learner.course_enrollments`
- `learner.lesson_attempts`
- `learner.lesson_progress`
- `internal_api.sync_lesson_attempt_batch(...)`

Questions to answer:

- Is this raw learner activity or derived progress?
- Should the client send an attempt, or is this read-only state?
- Will RLS allow the exact read or write path we want?

### If the feature changes what the app reads

Start with:

- `delivery.course_publications`
- `delivery.course_publication_lessons`

Questions to answer:

- Is the app reading published bundles only?
- Does the bundle already contain what the UI needs?
- If not, should the bundle change, rather than having the UI reach into `curriculum`?

## Remote Supabase Deployment Workflow

Use this workflow when the local database is ready to become a linked remote
Supabase project.

### 1. Authenticate the Supabase CLI

```sh
pnpm exec supabase login
```

For CI or non-interactive use, provide `SUPABASE_ACCESS_TOKEN` or use
`pnpm exec supabase login --token ...`.

### 2. List existing remote projects

```sh
pnpm exec supabase projects list
```

If the project does not exist yet, create it either in the Supabase dashboard or via
CLI.

### 3. Create a remote project from the CLI if needed

```sh
pnpm exec supabase projects create glyphbridge \
  --org-id your-org-id \
  --db-password "strong-db-password" \
  --region us-east-1
```

You need an organization ID, a chosen region, and a database password. Treat the DB
password like any other secret.

### 4. Link the local repo to the remote project

```sh
pnpm exec supabase link --project-ref your-project-ref -p "your-db-password"
```

After linking, commands such as `db push`, `db lint --linked`, and `gen types
--linked` know which remote project to target.

### 5. Preview the remote migration rollout

```sh
pnpm exec supabase db push --dry-run
```

Run this before every remote schema deployment so you can inspect what will be
applied.

### 6. Push migrations to the linked remote project

```sh
pnpm exec supabase db push
```

This applies the local migration chain to the linked remote database.

### 7. Include seed data only when you intentionally want bootstrap content

```sh
pnpm exec supabase db push --include-seed
```

Use `--include-seed` for a fresh remote environment when you explicitly want the
repository seed content loaded. Do not treat seed replay as the default production
content-update path once the remote environment is live.

### 8. Validate the linked remote database after deployment

```sh
pnpm exec supabase db lint --linked
pnpm exec supabase db advisors --linked
pnpm exec supabase gen types --linked > types.ts
```

Then run a few of the SQL queries from this document against the remote database using
Studio or a direct connection.

### Remote deployment cautions

- Never run `pnpm exec supabase db reset --linked` against a shared, staging, or
  production environment unless you explicitly intend to destroy and rebuild it.
- Do not make manual schema edits in the Supabase dashboard and then forget to capture
  them as migrations. This repo treats migration files as the source of truth.
- Treat `supabase/seed.sql` as bootstrap content for fresh environments, not as the
  normal mechanism for ongoing production content changes.
- Keep private schemas private. Client-facing features should still read from
  `delivery.*` and route learner writes through server-owned code.
- Push to staging before production whenever possible, especially once authenticated
  learner data exists remotely.

## Common Footguns

- Querying `curriculum.*` directly from learner-facing code.
- Writing directly to `learner.lesson_progress` from the client.
- Storing a derived fact when it should be computed from lesson completion.
- Adding an exposed table without matching grants and RLS policies.
- Changing the schema without confirming the local reset still succeeds.

## Current State

As of now:

- The baseline SQL schema exists and resets cleanly locally.
- The local seed file now contains the first real Thai curriculum seed.
- The first published lesson bundles now exist in `delivery.course_publication_lessons`.
- The app reads published lesson content through server-owned delivery helpers and
  generated publication artifacts.
- The first auth implementation now uses server-owned learner RPC wrappers rather
  than direct browser Supabase access.

## Fastest Files To Read First

If you only have five minutes, read these in order:

1. [db.md](./db.md)
2. [database-dto-spec.md](./database-dto-spec.md)
3. [supabase/config.toml](../supabase/config.toml)
4. [20260425130000_schema_foundation.sql](../supabase/migrations/20260425130000_schema_foundation.sql)
5. [20260425131000_security_and_sync.sql](../supabase/migrations/20260425131000_security_and_sync.sql)
