# Task: Database reference doc

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Goal

Create a durable `docs/db.md` reference that explains how GlyphBridge's database is structured and gives future feature work a fast way to inspect schemas, policies, functions, and local Supabase state.

## Scope

- In scope:
  - Add a README-style overview of the database architecture
  - Explain the role of each schema in plain language
  - Document local Supabase commands for startup, reset, and inspection
  - Provide `psql` commands and SQL introspection queries for analyzing the live database
  - Index the new doc in `docs/README.md`
- Out of scope:
  - Schema changes
  - New migrations
  - Curriculum seeding
  - App code changes

## Source Material

- `docs/database-dto-spec.md`
- `docs/app-philosophy.md`
- `supabase/config.toml`
- `supabase/migrations/20260425130000_schema_foundation.sql`
- `supabase/migrations/20260425131000_security_and_sync.sql`
- `.ai/2026-04-25-supabase-sql-schema-foundation.md`

## Outputs

- `docs/db.md`
- `docs/README.md`

## Validation

- Passed: `pnpm check`

## Current State

- `docs/db.md` and `docs/README.md` are updated and now serve as the first-stop operational reference for database layout, inspection, and local Supabase workflow.
- This task is complete unless the live schema shape, local commands, or inspection guidance changes.

## Next Steps

- Update `docs/db.md` whenever new migrations, publication tooling, or server integration changes the database workflow.
- Keep the examples aligned with the actual `supabase/` layout and the exposed schema boundaries.
