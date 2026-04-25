# Task: Bits UI interactivity pass

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: planned

## Goal

Make Bits UI the default accessible primitive layer for site interactivity and schedule a focused pass to migrate existing ad hoc interactive components where the library provides a clear fit.

## Scope

- In scope:
  - Start using the already-restored `bits-ui` runtime dependency in shared component refactors
  - Audit existing interactive components in `src/lib/components`, `src/routes`, and shared UI wrappers
  - Migrate reusable composite interactions to Bits UI primitives wherever possible
  - Add thin app-level wrappers only when they provide stable styling or API value
  - Preserve existing semantics, keyboard behavior, and learner-facing UX during migration
- Out of scope:
  - Large visual redesigns unrelated to the Bits UI migration
  - Rewriting plain native buttons, links, or form controls that do not benefit from a headless primitive
  - Broader lesson-flow, curriculum, or Supabase work

## Decisions Applied

- Bits UI is the preferred library for reusable interactive primitives and composite controls wherever possible.
- Native HTML remains the right choice when a semantic element already covers the interaction without extra state or focus management.
- Route files should keep orchestrating; reusable interaction behavior belongs in shared components and UI primitives.
- Existing one-off interactive components should be evaluated for migration before new custom interaction patterns are introduced.

## Initial Targets

- Audit disclosure, dialog, popover, menu, tab-like, toggle-group, and other stateful UI patterns for ad hoc interaction logic.
- Identify shared wrappers that belong in `src/lib/components/ui` versus direct Bits UI usage in feature components.
- Capture any current components whose behavior depends on custom keyboard, focus, or open-state management.

## Progress

- [x] Document the Bits UI convention in repo instructions and durable docs
- [x] Keep `bits-ui` present as an intentional runtime dependency
- [ ] Audit existing interactive components for migration candidates
- [ ] Implement Bits UI wrappers or direct migrations where appropriate
- [ ] Validate migrated interactions with focused accessibility and product checks

## Open Questions

- Which current interactive components need thin shared wrappers versus direct Bits UI usage?
- Are there existing custom interaction patterns that should stay native because Bits UI would add unnecessary abstraction?

## Follow-Up

- Start with the highest-reuse interactive primitives before touching lesson-specific components.
- Batch migrations by interaction type so validation stays focused and regressions are easier to isolate.
