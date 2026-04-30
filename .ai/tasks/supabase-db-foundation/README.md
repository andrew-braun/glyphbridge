# Supabase DB Foundation Task Bundle

## Purpose

This directory groups the active and recently completed `.ai` task documents for the Supabase and database foundation work so they are easier to scan as one workstream instead of a flat list of session slices.

## Authoritative Sources

- `implementation-status.md` is the authoritative next-steps and resume-point document for this workstream.
- `foundation-plan.md` is the authoritative architecture and schema-rationale document.
- `auth-sync-strategy.md` is the authoritative plan for the authenticated rollout lane only.
- `../../2026-04-26-thai-content-seeding-plan.md` is the authoritative planning record for the completed Thai content-seeding lane.
- `thai-curriculum-seed-dataset.md` is the authoritative DB-ready source inventory for Thai curriculum seed inputs.
- `../../../docs/concept/approach-thai.md` is the authoritative durable Thai concept source for grapheme sequencing, lesson expansion, and coverage targets.

## Recommended Reading Order

- `foundation-plan.md`
  - Strategic architecture and schema direction.
  - Keep this as the broad planning and rationale document.

- `implementation-status.md`
  - Current implementation state, completed foundation outputs, validation status, and concrete next steps.
  - Start here when resuming hands-on work.

- `../../2026-04-26-thai-content-seeding-plan.md`
  - Current Thai content-seeding plan, rewrite status, and implementation sequence.

- `thai-curriculum-seed-dataset.md`
  - DB-ready source inventory for the first Thai curriculum seed.

- `database-security-audit.md`
  - Security findings, severity, and recommended remediation for the current DB foundation.
  - Read before exposing the first server-backed learner route or auth flow.

- `auth-sync-strategy.md`
  - Future auth and account-linked progress rollout.
  - Read when starting authenticated sessions, merge flows, or account persistence.

## Consolidation Assessment

### Kept as distinct

- `foundation-plan.md`
  - Completion: high for planning, partial for end-to-end delivery.
  - Reason to keep: contains the durable architectural rationale, schema modeling decisions, and unresolved follow-on questions that should not be collapsed into a short status note.
  - Overlap: medium overlap with `auth-sync-strategy.md` on Supabase posture, but it is still the broader and earlier design document.

- `auth-sync-strategy.md`
  - Completion: partial.
  - Reason to keep: the authenticated rollout has not been implemented yet, and this document still contains distinct merge and account-attachment concerns that are not fully covered elsewhere.
  - Overlap: partial overlap with `foundation-plan.md` on `@supabase/ssr`, local-to-account merge direction, and server-side verification.

- `database-security-audit.md`
  - Completion: high for the audit pass, low for remediation.
  - Reason to keep: it is a distinct security review with severity-ranked findings and should remain separate from architecture planning and implementation status.
  - Overlap: medium overlap with `implementation-status.md` and `auth-sync-strategy.md` on future route/auth posture, but its security findings are materially different in purpose and detail.

### Consolidated into `implementation-status.md`

- `2026-04-25-supabase-sql-schema-foundation.md`
  - Completion: complete for the SQL foundation slice.
  - Redundancy: high overlap with session handoff and next-step notes.

- `2026-04-25-db-reference-doc.md`
  - Completion: complete.
  - Redundancy: medium to high overlap with the same current-state and follow-up notes captured elsewhere.

- `2026-04-25-instruction-files-db-guidance.md`
  - Completion: complete.
  - Redundancy: high overlap on current DB boundary guidance and follow-up maintenance.

- `2026-04-25-database-foundation-session-handoff.md`
  - Completion: complete.
  - Redundancy: very high overlap with the combined current-state and next-step sections of the other 2026-04-25 trackers.

## Durable References Outside `.ai`

- `docs/app-philosophy.md` is the product and pedagogy guardrail.
- `docs/concept/approach-thai.md` is the durable Thai sequencing and expansion concept source.
- `docs/database-dto-spec.md` is the exact schema and DTO contract.
- `docs/db.md` is the operational database reference and inspection guide.

## Current Resume Point

- DB hardening and input-bounds remediation are complete.
- The approved Thai curriculum rewrite has landed in `src/lib/data/thai.ts` and is now the seed source of truth.
- The first Thai curriculum seed is now in place in `curriculum.*` and `delivery.*`, and direct SQL verification confirms 1 course, 1 course version, 13 lessons, 39 vocabulary items, and 13 publication lesson rows.
- The learn index and lesson detail routes now read the active published lesson bundle through `src/lib/server/delivery-lessons.ts` and server-owned SvelteKit loads.
- The app now uses a server-capable SvelteKit adapter for DB-backed lesson delivery instead of assuming static-only hosting.
- Local `/learn` development now requires `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`; `.env.example` documents the local `supabase status -o env` mapping.
- `pnpm run db:smoke:delivery` now checks the active published lesson bundle against the canonical runtime Thai lesson contract.
- Next runtime/auth gate: implement the request-scoped `@supabase/ssr` boundary and verified server-owned Supabase access described in `auth-sync-strategy.md` before the first authenticated route or sync path lands.
- Add the first server-side SvelteKit boundary for learner attempt sync after the read boundary and auth gate exist.
- Decide whether Drizzle lands before or after that first DB-backed runtime path.
