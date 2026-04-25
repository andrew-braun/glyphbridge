# Task: Supabase DB foundation implementation status

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Track the implemented foundation of the Supabase and database workstream, summarize what landed, and capture the concrete next steps required to move the app from static data and local progress to seeded curriculum, published bundles, and server-backed sync.

## Consolidated From

- `2026-04-25-supabase-sql-schema-foundation.md`
- `2026-04-25-db-reference-doc.md`
- `2026-04-25-instruction-files-db-guidance.md`
- `2026-04-25-database-foundation-session-handoff.md`

## Implemented Foundation

- Added the local `supabase/` project foundation and configured runtime-exposed schemas for `delivery` and `learner`.
- Added baseline SQL migrations for schemas, enums, tables, indexes, triggers, grants, RLS policies, user bootstrap, and `internal_api.sync_lesson_attempt_batch(...)`.
- Added `docs/db.md` as the operator-style database overview and inspection guide.
- Updated repo-wide and DB-adjacent instruction files so future DB work starts from `docs/db.md` and `docs/database-dto-spec.md` and preserves the private-versus-runtime schema boundary.

## Current State

- Durable references now exist in `docs/app-philosophy.md`, `docs/database-dto-spec.md`, and `docs/db.md`.
- The local Supabase foundation exists under `supabase/` with baseline schema, grants, RLS, and the initial sync function.
- Database-aware instruction files now point future work at the correct docs and preserve the `curriculum` / `internal_api` versus `delivery` / `learner` boundary.
- The shipped app runtime still uses static lesson data in `src/lib/data/*` and local client persistence; no seeded curriculum, publication data, or server-backed runtime path has landed yet.

## Deliverables Produced

- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/migrations/20260425130000_schema_foundation.sql`
- `supabase/migrations/20260425131000_security_and_sync.sql`
- `docs/db.md`
- Updated DB-aware instruction files across the repo

## Validation

- Passed: `pnpm exec supabase start`
- Passed: `pnpm exec supabase db reset --yes`
- Passed: `pnpm check`

## Near-Term Next Steps

- Seed the current Thai course into `curriculum.*` and validate parity against `src/lib/data/thai.ts`.
- Generate the first `delivery.course_publication_lessons` payloads from that canonical content.
- Add the first server-side SvelteKit boundary for published lesson reads and `internal_api.sync_lesson_attempt_batch(...)`.
- Decide whether to add Drizzle before or after the first DB-backed route and sync path.
- Add migration smoke tests or integration checks once app code starts depending on the DB surface.

## Maintenance Rule

- Keep this document focused on implementation state and actionable next steps.
- Put durable technical truth in `docs/database-dto-spec.md` and `docs/db.md`, not here.
