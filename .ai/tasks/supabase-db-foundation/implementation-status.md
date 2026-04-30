# Task: Supabase DB foundation implementation status

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Track the implemented foundation of the Supabase and database workstream, summarize what landed, and capture the concrete next steps required to move the app from static runtime reads and local progress to DB-backed lesson delivery and server-backed sync.

## Authority

- This is the authoritative resume-point and next-steps document for the Supabase DB foundation workstream.
- When the question is what should happen next, update and consult this file first.
- Keep architectural rationale in `foundation-plan.md` and auth-specific rollout planning in `auth-sync-strategy.md`.

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

- Durable references now exist in `docs/app-philosophy.md`, `docs/concept/approach-thai.md`, `docs/database-dto-spec.md`, and `docs/db.md`.
- The local Supabase foundation exists under `supabase/` with baseline schema, grants, RLS, and the initial sync function.
- Database-aware instruction files now point future work at the correct docs and preserve the `curriculum` / `internal_api` versus `delivery` / `learner` boundary.
- The shipped app runtime still uses static lesson data in `src/lib/data/*` and local client persistence, but that lesson data has now been rewritten into the approved 13-lesson frequency-first Thai curriculum.
- The runtime lesson model now also carries a first supporting-vocabulary slice per lesson, while preserving the featured `anchorWord` for the current lesson flow.
- `src/lib/stores/progress.ts` now uses snapshot version `2` so older local progress does not map onto the rewritten lesson IDs.
- Thai content seeding planning now lives in `../../2026-04-26-thai-content-seeding-plan.md` and `thai-curriculum-seed-dataset.md`, which now treat the rewritten runtime curriculum as the next seed source.
- `docs/database-dto-spec.md` now includes first-class reusable lesson vocabulary tables so the content model can grow into vocabulary drilling without another schema redesign.
- `supabase/migrations/20260430110000_lesson_vocabulary_tables.sql` now creates the reusable vocabulary tables in the live migration chain and validates cleanly with a local DB reset.
- `scripts/generate-thai-seed.mjs` now derives the first Thai curriculum seed directly from `src/lib/data/thai.ts`.
- `supabase/seed.sql` now seeds the rewritten Thai course into `curriculum.*` and the first learner-facing lesson bundles into `delivery.*`, and validates cleanly with a local DB reset.
- Direct SQL verification now confirms the local seeded database contains 1 course, 1 course version, 13 lessons, 39 vocabulary items, and 13 `delivery.course_publication_lessons` rows.

## Security Review Outcome

- The 2026-04-25 audit found real boundary and surface-area issues in the baseline DB design; the foundation is not ready for the first authenticated learner route yet.
- The critical findings around direct `lesson_attempts` writes, trusted caller identity, and mutable `SECURITY DEFINER` search paths were accepted as true positives and have been addressed in the hardening migrations.
- The active remediation tracker is `.ai/2026-04-25-supabase-security-remediation-plan.md`.
- `docs/database-dto-spec.md` and `docs/db.md` now reflect the hardened DB boundary and current schema contract.

## Completed DB Hardening

- Added `supabase/migrations/20260425143000_security_hardening_phase1.sql` to remove client-direct attempt writes, derive authenticated identity inside `internal_api.sync_lesson_attempt_batch(...)`, pin function search paths, shrink unused learner write surfaces, and add the first wave of DB-side bounds and invariants.
- Validated the first hardening migration with `pnpm exec supabase db reset --yes`.
- Added `supabase/migrations/20260426100000_security_hardening_phase2.sql` to move enum types into the private `curriculum` schema and narrow the remaining direct learner update grants to explicit columns.
- Validated the second hardening migration with `pnpm exec supabase db reset --yes` and `pnpm exec supabase db lint`.
- Added `supabase/migrations/20260426113000_text_length_constraints.sql` to set reasonable upper bounds on short and medium text fields across the private curriculum and delivery schemas.
- Validated the third hardening migration with `pnpm exec supabase db reset --yes` and `pnpm exec supabase db lint`.

## Deliverables Produced

- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/migrations/20260425130000_schema_foundation.sql`
- `supabase/migrations/20260425131000_security_and_sync.sql`
- `supabase/migrations/20260425143000_security_hardening_phase1.sql`
- `supabase/migrations/20260426100000_security_hardening_phase2.sql`
- `supabase/migrations/20260426113000_text_length_constraints.sql`
- `supabase/migrations/20260430110000_lesson_vocabulary_tables.sql`
- `scripts/generate-thai-seed.mjs`
- `docs/db.md`
- `docs/database-dto-spec.md`
- Updated DB-aware instruction files across the repo

## Validation

- Passed: `pnpm exec supabase start`
- Passed: `pnpm exec supabase db reset --yes`
- Passed: `pnpm check`
- Passed: `pnpm exec supabase db reset --yes` after adding `20260425143000_security_hardening_phase1.sql`
- Passed: `pnpm exec supabase db lint` after the first hardening wave.
- Passed: `pnpm exec supabase db reset --yes` after adding `20260426100000_security_hardening_phase2.sql`
- Passed: `pnpm exec supabase db lint` after the second hardening wave.
- Passed: `pnpm exec supabase db reset --yes` after adding `20260426113000_text_length_constraints.sql`
- Passed: `pnpm exec supabase db lint` after the third hardening wave.
- Passed: `pnpm exec supabase db reset --yes` after adding `20260430110000_lesson_vocabulary_tables.sql`.
- Passed: `pnpm check` after rewriting `src/lib/data/thai.ts`, resetting the progress snapshot version, and adding tone-mark coverage to the alphabet route.
- Passed: `pnpm check` after adding lesson vocabulary to the runtime model, progress store, and completion UI.
- Passed: `pnpm exec supabase db reset --yes` after generating the first real Thai curriculum seed in `supabase/seed.sql`.
- Passed: direct SQL verification against the local Postgres instance confirming 1 course, 1 course version, 13 lessons, 39 vocabulary items, and 13 publication lessons.

## Current Next Step

- The next implementation step is to add the first server-owned SvelteKit read path over `delivery.course_publication_lessons` so runtime lesson reads can move off static TypeScript data and onto the seeded publication bundle.
- The authenticated-runtime gate remains request-scoped `@supabase/ssr` before any authenticated route, server load function, action, or remote function imports Supabase.
- Concretely for the authenticated gate: replace the module-scoped client in `src/lib/supabase.ts`, add `hooks.server.ts` session wiring, and expose only verified server-owned Supabase access to the first authenticated runtime path.

## Near-Term Next Steps

- Keep `docs/concept/approach-thai.md` and `thai-curriculum-seed-dataset.md` aligned as the authoritative Thai source inventory for future grapheme and lesson expansion, especially the not-yet-encoded level 6 material.
- Keep `scripts/generate-thai-seed.mjs` and `supabase/seed.sql` aligned with `src/lib/data/thai.ts` whenever the Thai curriculum changes.
- Add a small parity or smoke-test step that checks the seeded `delivery.course_publication_lessons` bundles against the runtime lesson contract.
- Add the first server-side SvelteKit boundary for published lesson reads from `delivery.*`.
- Replace the module-scoped Supabase client with request-scoped `@supabase/ssr` integration before any authenticated server route or load function imports Supabase.
- After both the seeded content shape and the server boundary exist, add the first server-side SvelteKit boundary for published lesson reads and learner attempt sync.
- Add `supabase db lint` and targeted SQL smoke tests to the DB workflow as follow-on guardrails.

## Maintenance Rule

- Keep this document focused on implementation state and actionable next steps.
- Put durable technical truth in `docs/database-dto-spec.md` and `docs/db.md`, not here.
