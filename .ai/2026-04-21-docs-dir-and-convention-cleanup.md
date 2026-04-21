# Task: Docs directory and convention cleanup

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Add a durable `docs/` area for long-lived project documentation, capture a security review checklist there, add requested backlog tracking in `.ai/`, and align the current codebase with the tightened repo conventions.

## Scope

- In scope:
  - Create durable docs structure
  - Add security review checklist doc
  - Add `.ai` backlog file
  - Audit and fix convention drift in the current codebase
- Out of scope:
  - New product features
  - Remote-function refactors not required to resolve current drift

## Constraints

- Technical:
  - Keep fixes consistent with current Svelte 5 and SvelteKit guidance.
  - Prefer boundary cleanup and metadata fixes over speculative rewrites.
- Product:
  - Preserve current learner experience and lesson flow.
- Security:
  - Durable security guidance must align with repo-wide sign-off requirements.

## Decisions

- Decision: Use `docs/` for durable repo docs and `.ai/` for task-scoped records.
  Reason: This keeps long-lived reference material separate from transient implementation tracking.

## Progress

- [x] Discovery and research
- [ ] Implementation
- [ ] Validation
- [ ] Documentation updates

## Open Questions

- Whether to migrate the existing progress layer fully to rune-powered shared state in a future dedicated refactor.

## Follow-Up

- None yet.
