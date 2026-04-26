# Task: Supabase security remediation plan

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Turn the current database security audit into a concrete remediation sequence, decide which findings are true blockers, and define what must land before the first authenticated server-backed route.

## Assessment Summary

- No critical audit findings are being dismissed as false positives.
- The current foundation is not ready for the first authenticated learner route.
- The main risk is a boundary mismatch: the schema currently exposes direct client write paths that bypass the server-owned projection and request-identity model described elsewhere in the workstream.
- Durable references in `docs/` should change only in the same PR as the migrations and app code that implement each decision.

## Decision Rules

- Apply now when a finding creates a real write-path, privilege, or surface-area risk in the current schema or config.
- Apply with the first authenticated SvelteKit boundary when the issue becomes active only once SSR auth or server-side DB access exists.
- Defer to deployment hardening only when the current repo state is still local-dev-only and the secure setting depends on real production context.

## Remediation Decisions

### Apply now in DB and config hardening

- `C1`, `H3`: remove direct client `insert` access to `learner.lesson_attempts` and make `internal_api.sync_lesson_attempt_batch(...)` the only write path for attempts and progress.
- `C2`: drop `p_user_id` from the sync function and derive caller identity inside the function from the JWT/auth context, while still validating enrollment ownership.
- `C3`, `L1`, `L2`: pin every `SECURITY DEFINER` function to `set search_path = ''` or `pg_catalog` and fully qualify every reference.
- `H1`, `H2`, `M5`, `M10`: add input bounds for batch size, `completed_at`, text lengths, numeric ranges, and JSON payload size. Do size caps now; defer full JSON schema validation until the payload contract stabilizes.
- `H6`, `M3`, `M6`: enforce schema invariants with a same-course FK, a published-version immutability trigger, and `created_by` FKs.
- `H7`, `M1`, `M2`: enable deny-by-default RLS on `curriculum.*`, remove unnecessary API exposure via `public` and relaxed `extra_search_path`, and move enums out of `public` if practical in the same migration. If moving enums is too noisy for one pass, keep them fully qualified and still remove `public` from request resolution.
- `M7`, `L7`: disable unused Realtime and S3 protocol surface in local config and fix the incorrect redirect URL entry.
- `L3`: remove direct `insert` policies on `learner.profiles` and `learner.preferences` unless a concrete recovery path requires them.

### Apply now by shrinking unused write surfaces

- `M4`, `M9`, part of `H8`: `learner.devices` is not needed by the current app runtime. Revoke direct client writes now instead of hardening an unused public write surface, then reintroduce it later behind a dedicated server-owned function if device registration becomes a real feature.
- Remaining `H8`: do not do a blanket column-level-grant pass on every learner table yet. Instead, keep the first authenticated rollout server-owned and add column-level grants only for any table intentionally exposed for direct client writes.

### Apply with the first authenticated SvelteKit boundary

- `H5`, `L5`: replace the module-scoped client in `src/lib/supabase.ts` with request-scoped `@supabase/ssr` clients before any server route, server load, remote function, or action imports Supabase.
- `M11`: keep anonymous auth disabled until the anon-to-account flow, captcha, and rate-limit posture are designed together.
- Any remaining profile or preferences write-surface decisions should be made together with the actual server actions or remote functions that own them.

### Deployment and process hardening, not blocking current local-only planning

- `H4`: treat most auth config findings as production gates, not immediate local-dev blockers. Keep them as deployment checklist items, but do not rely on the current local defaults for a hosted rollout.
- `M8`: document SSL enforcement and network restrictions as production requirements.
- `L6`: add `pnpm exec supabase db lint` and advisor review to the migration workflow before more DB changes land.

### No change or already covered

- `L4`: empty `seed.sql` is not a security issue by itself.
- `L8`: already enforced; no change required.
- `Positive Findings`: preserve these properties during the remediation migrations.

## Execution Order

1. `DB hardening migration`
   - remove direct client writes to `learner.lesson_attempts`
   - remove or reduce direct writes to unused learner tables
   - fix `sync_lesson_attempt_batch(...)` identity and search path
   - tighten exposed schemas, request search path, and schema invariants
2. `Input-bounds migration`
   - add attempt batch, timestamp, text-length, numeric-range, and payload-size guards
   - decide whether any device write surface remains; if yes, add hard caps and ownership checks
3. `App boundary change`
   - adopt `@supabase/ssr`
   - move to request-scoped clients in `hooks.server.ts`
   - keep writes behind server-owned routes, actions, or remote functions
4. `Resume product work`
   - seed Thai curriculum
   - publish first `delivery.*` bundles
   - add the first authenticated sync and read routes only after phases 1 through 3 pass
5. `Workflow hardening`
   - add `supabase db lint`
   - add a small SQL smoke-test suite for the highest-value invariants

## Concrete Outputs To Land

- one or more SQL migrations under `supabase/migrations/`
- config changes in `supabase/config.toml`
- SSR auth and client changes in `src/lib/supabase.ts`, `src/hooks.server.ts`, and the first server-owned DB routes
- matching updates to `docs/db.md`, `docs/database-dto-spec.md`, and any instruction file that documents DB or auth boundaries

## Progress Snapshot

- [x] Deferred next-phase items recorded in the planning docs.
- [x] Added `20260425143000_security_hardening_phase1.sql` for the first DB hardening wave.
- [x] Validated the new migration with `pnpm exec supabase db reset --yes`.
- [x] Added the remaining config, docs, and workflow updates tied to the first hardening wave.
- [x] Ran `pnpm exec supabase db lint` against the updated schema after the first hardening wave.
- [x] Added `20260426100000_security_hardening_phase2.sql` for private enums and narrower direct learner update grants.
- [x] Re-ran `pnpm exec supabase db reset --yes` and `pnpm exec supabase db lint` for phase two.

## Blocking Resume Point

Do not start curriculum seeding or wire the first authenticated learner route until the DB hardening and input-bounds phases are complete.
