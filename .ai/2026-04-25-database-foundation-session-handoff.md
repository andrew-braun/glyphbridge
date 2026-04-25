# Task: Database foundation session handoff

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Goal

Capture the exact end-of-session state of the database foundation work so the next implementation pass can resume without rebuilding context from chat history.

## Current State

- Durable references now exist in `docs/app-philosophy.md`, `docs/database-dto-spec.md`, and `docs/db.md`.
- The local Supabase foundation exists under `supabase/` with baseline schema, grants, RLS, and the initial `internal_api.sync_lesson_attempt_batch(...)` path.
- Database-aware instruction files now point future work at the correct docs and preserve the `curriculum` / `internal_api` versus `delivery` / `learner` boundary.
- The shipped app runtime still uses static lesson data in `src/lib/data/*` and local client persistence; no seeded curriculum, publication data, or server-backed runtime path has landed yet.

## Next Steps

- Seed the current Thai course into `curriculum.*` and validate parity against `src/lib/data/thai.ts`.
- Publish the first learner-facing lesson bundles into `delivery.course_publications` and `delivery.course_publication_lessons`.
- Add the first server-side SvelteKit boundary for published lesson reads and `internal_api.sync_lesson_attempt_batch(...)`.
- Decide whether to add Drizzle now for typed server queries or defer until after the first DB-backed route and sync path are working.
- Keep `docs/db.md`, `docs/database-dto-spec.md`, and the nearest instruction files aligned as those steps land.

## Validation

- Passed: `pnpm check`
