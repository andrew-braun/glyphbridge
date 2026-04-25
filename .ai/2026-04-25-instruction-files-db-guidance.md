# Task: Instruction files DB guidance

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Goal

Update the project instruction files so future database and Supabase work consistently points to the new durable schema references and preserves the current schema boundaries.

## Scope

- In scope:
  - Update repo-wide instruction files (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`)
  - Update relevant directory-level `AGENTS.md` files for docs, src, data, stores, routes, and future API routes
  - Update relevant `.github/instructions/*.instructions.md` files that guide database-adjacent work
  - Point all DB-sensitive work at `docs/db.md` and `docs/database-dto-spec.md`
- Out of scope:
  - Database schema changes
  - New Supabase migrations
  - App code changes

## Outputs

- Updated instruction files with DB reference guidance and schema-boundary reminders

## Validation

- Passed: `pnpm check`

## Current State

- Repo-wide and DB-adjacent instruction files now point to `docs/db.md` and `docs/database-dto-spec.md`.
- Future DB work should start from those docs and preserve the current `curriculum` / `internal_api` versus `delivery` / `learner` boundary.

## Next Steps

- Update the nearest instruction files again when auth/session wiring, server data access, Drizzle adoption, or runtime DB boundaries change.
- Keep repo-wide and path-level guidance synchronized in the same change.
