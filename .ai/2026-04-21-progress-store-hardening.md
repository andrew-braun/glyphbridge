# Task: Progress store hardening

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: done

## Goal

Harden the local progress persistence layer so browser restores are normalized, versioned, and idempotent without changing the public store API that current routes and components depend on.

## Scope

- In scope:
  - Versioned local progress snapshot format
  - Normalized localStorage restore path for legacy and current payloads
  - Idempotent initialization and persistence subscription behavior
  - Minimal route-layout init adjustment for the store
- Out of scope:
  - New persistence backends
  - Progress UI redesigns
  - Wider route or lesson-flow refactors

## Constraints

- Technical:
  - Keep the existing exported store API stable for current callers.
  - Preserve browser guards and keep localStorage access client-only.
- Product:
  - Preserve current lesson unlocking and completion behavior.
- Security:
  - Treat persisted JSON as untrusted input and normalize before use.

## Decisions

- Decision: Wrap persisted progress in a small versioned snapshot while still accepting legacy raw `AppProgress` payloads on read.
  Reason: This adds schema evolution room without breaking existing local data.
- Decision: Keep `initProgress()` as the public entry point but make it subscribe only once and restore on mount.
  Reason: Existing callers stay unchanged while duplicate persistence side effects are blocked.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Open Questions

- Whether a future pass should move progress persistence behind a dedicated repository/helper module if account sync is introduced.

## Validation

- `pnpm check`
- `pnpm build`

## Follow-Up

- None yet.
