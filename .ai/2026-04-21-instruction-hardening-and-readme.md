# Task: Instruction hardening and README rewrite

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: done

## Goal

Strengthen the repository instruction system with stricter security governance, mandatory task tracking, modern Svelte 5 and SvelteKit guidance, and a human-readable project README.

## Scope

- In scope:
  - Repo-wide instruction hardening
  - Copilot path-specific instruction updates
  - `.ai` task-tracking workflow setup
  - README rewrite
- Out of scope:
  - Application feature changes
  - Security implementation changes in runtime code

## Constraints

- Technical:
  - Keep instruction hierarchy aligned across `AGENTS.md`, `CLAUDE.md`, and Copilot files.
  - Base Svelte guidance on current Svelte 5 and SvelteKit docs.
- Product:
  - Preserve the component-centric architecture direction.
- Security:
  - Add explicit sign-off requirements for high-risk changes.

## Decisions

- Decision: Keep `AGENTS.md` as the canonical project instruction source.
  Reason: It is the most portable cross-agent source of truth.
- Decision: Prefer SvelteKit remote functions over internal API routes for first-party app communication where they fit.
  Reason: They provide a more modern typed client-server path while preserving `+server.ts` for true HTTP surfaces.
- Decision: Prefer rune-powered `.svelte.ts` modules over classic stores for new shared reactive logic unless the store contract is specifically needed.
  Reason: This matches modern Svelte 5 guidance and reduces legacy reactive patterns.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Open Questions

- Whether to add CI checks later that verify README and instruction files were touched when architecture or environment files change.

## Follow-Up

- Consider adding automated validation for instruction-file freshness.
- Consider adding a security review checklist for future auth and database work.
