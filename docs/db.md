# Database Guide

This is the quick-reference guide for GlyphBridge's database. Use it when you need to understand how the database is organized, where a feature should read or write, and how to inspect the live schemas without re-reading the full design docs.

For the precise table-by-table contract, see [database-dto-spec.md](./database-dto-spec.md). This file is the README-style overview and inspection guide.

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

### Open Supabase Studio

The local config currently uses:

- Studio: `http://127.0.0.1:54323`
- API: `http://127.0.0.1:54321`
- Postgres port: `54322`

### Connect with `psql`

If you want direct SQL access:

```sh
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

If the local connection details ever change, `pnpm exec supabase status` and `pnpm exec supabase start` will print the current values.

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

## Common Footguns

- Querying `curriculum.*` directly from learner-facing code.
- Writing directly to `learner.lesson_progress` from the client.
- Storing a derived fact when it should be computed from lesson completion.
- Adding an exposed table without matching grants and RLS policies.
- Changing the schema without confirming the local reset still succeeds.

## Current State

As of now:

- The baseline SQL schema exists and resets cleanly locally.
- The local seed file is intentionally empty.
- The first real curriculum seed and publication generation are still future work.
- The app is not yet wired to read from the database.

## Fastest Files To Read First

If you only have five minutes, read these in order:

1. [db.md](./db.md)
2. [database-dto-spec.md](./database-dto-spec.md)
3. [supabase/config.toml](../supabase/config.toml)
4. [20260425130000_schema_foundation.sql](../supabase/migrations/20260425130000_schema_foundation.sql)
5. [20260425131000_security_and_sync.sql](../supabase/migrations/20260425131000_security_and_sync.sql)
