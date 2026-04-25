# Task: Supabase SQL schema foundation

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Goal

Turn the database and DTO design into the first real Supabase SQL migrations so the project has a concrete schema foundation for curriculum, delivery bundles, learner progress, and attempt sync.

## Scope

- In scope:
  - Bootstrap the local `supabase/` project structure
  - Configure exposed schemas for runtime data access
  - Add baseline SQL migrations for schemas, enums, tables, indexes, and triggers
  - Add SQL migrations for grants, RLS policies, user bootstrap, and batch attempt projection
  - Add a placeholder seed file so local resets have a valid target
- Out of scope:
  - Seeding the Thai curriculum
  - Drizzle schema generation
  - SvelteKit server boundary implementation
  - Supabase project linking or deployment

## Sources

- `docs/database-dto-spec.md`
- `docs/app-philosophy.md`
- `.ai/2026-04-22-supabase-database-foundation-plan.md`
- Current Supabase CLI docs for migration layout and custom schema handling

## Decisions Applied

- Use standard Supabase migrations under `supabase/migrations/`
- Expose `delivery` and `learner` through the local API config
- Keep `curriculum` and `internal_api` non-exposed
- Use one baseline schema migration and one security/sync migration for a reviewable first cut
- Fix composite foreign key footguns before validation, especially any `ON DELETE SET NULL` path that would force nulls into non-null identity columns
- Narrow learner grants so base privileges match the intended RLS access model instead of granting blanket write access to all learner tables

## Outputs

- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/migrations/20260425130000_schema_foundation.sql`
- `supabase/migrations/20260425131000_security_and_sync.sql`

## Validation

- Passed: `pnpm exec supabase start`
- Passed: `pnpm exec supabase db reset --yes`

## Current State

- The baseline SQL foundation is in place and validates locally.
- Schema, RLS, grants, and the initial sync function exist, but no curriculum content has been seeded and no app route reads or writes through this database surface yet.

## Next Steps

- Seed the Thai curriculum into `curriculum.*`.
- Generate the first `delivery.course_publication_lessons` payloads from that canonical content.
- Add SvelteKit server-side integration for published lesson reads and learner attempt sync.
- Add migration smoke tests or integration checks once app code starts depending on the DB surface.
