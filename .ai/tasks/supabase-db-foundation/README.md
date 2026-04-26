# Supabase DB Foundation Task Bundle

## Purpose

This directory groups the active and recently completed `.ai` task documents for the Supabase and database foundation work so they are easier to scan as one workstream instead of a flat list of session slices.

## Recommended Reading Order

1. `foundation-plan.md`
   - Strategic architecture and schema direction.
   - Keep this as the broad planning and rationale document.
2. `implementation-status.md`
   - Current implementation state, completed foundation outputs, validation status, and concrete next steps.
   - Start here when resuming hands-on work.
3. `database-security-audit.md`

- Security findings, severity, and recommended remediation for the current DB foundation.
- Read before exposing the first server-backed learner route or auth flow.

1. `auth-sync-strategy.md`
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
- `docs/database-dto-spec.md` is the exact schema and DTO contract.
- `docs/db.md` is the operational database reference and inspection guide.

## Current Resume Point

- DB hardening and input-bounds remediation are complete.
- Immediate next step: implement the request-scoped `@supabase/ssr` boundary and verified server-owned Supabase access described in `auth-sync-strategy.md`.
- After the app boundary lands, seed the Thai curriculum into `curriculum.*`.
- Publish the first learner-facing bundles into `delivery.*`.
- Add the first server-side SvelteKit boundary for published lesson reads and learner attempt sync.
- Decide whether Drizzle lands before or after that first DB-backed runtime path.
