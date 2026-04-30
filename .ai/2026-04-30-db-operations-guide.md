# Task: Database Operations Guide Refresh

- Start date: 2026-04-30
- Owner: GitHub Copilot
- Status: done

## Goal

Refresh the durable database guide in `docs/` so it accurately explains how to
interact with the current GlyphBridge database locally and remotely.

## Scope

- In scope:
  - Expand `docs/db.md` into the authoritative operational guide for the current DB
    state.
  - Document schema roles, common queries, local CLI workflows, and remote Supabase
    deployment workflow.
  - Update related docs index text if the durable doc's role changes.
- Out of scope:
  - Changing the database schema or runtime DB integration.
  - Implementing the first server-owned delivery read path.

## Constraints

- Technical:
  - Keep `docs/db.md` as the README-style database entry point.
  - Keep `docs/database-dto-spec.md` as the exact schema contract rather than
    duplicating it.
- Product:
  - Document the current seeded Thai curriculum state, but do not imply the runtime
    app already reads from the DB.
- Security:
  - Reinforce the private `curriculum` and `internal_api` boundary.
  - Include explicit cautions for remote deployment and linked-project commands.

## Decisions

- Decision: Expand `docs/db.md` instead of adding a second DB operations doc.
  Reason: Repo guidance already defines `db.md` as the durable README-style entry
  point for DB layout and inspection.
- Decision: Use current Supabase CLI documentation for remote workflow commands.
  Reason: CLI syntax and recommended deployment flow can drift over time.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Open Questions

- None.

## Follow-Up

- The next implementation task remains the first server-owned SvelteKit read path
  over `delivery.course_publication_lessons`.
