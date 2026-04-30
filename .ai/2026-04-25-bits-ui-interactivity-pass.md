# Task: Bits UI interactivity pass

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: in progress

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

## Implementation Notes 2026-04-30

- Audited current interactive surfaces and found the cleanest first migration seam in the repeated bespoke progress bars rather than in plain native buttons.
- Added `src/lib/components/ui/Progress.svelte` as a Bits UI-backed shared primitive.
- Migrated the lesson flow header, alphabet page, practice session header, and home stats overview to the shared progress primitive.
- Removed the old global `.progress-bar` helper after the call sites moved to the new component.
- Audited the next candidate set and chose drill answer selection as the next Bits UI seam because `DrillExercise` owned bespoke selection state and keyboard semantics.
- Migrated `src/lib/components/exercises/DrillExercise.svelte` to a Bits UI `RadioGroup`, keeping the existing correctness feedback and next-step flow.
- Audited the locked lesson-card pattern and chose it as the next seam because both lesson list surfaces duplicated fake disabled-link behavior.
- Migrated `src/routes/learn/+page.svelte` and `src/lib/components/content/lesson/LessonList.svelte` to Bits UI `Button.Root`, removing the duplicated `preventDefault` card handlers while keeping the existing card layouts and locked-state visuals.

## Progress

- [x] Document the Bits UI convention in repo instructions and durable docs
- [x] Keep `bits-ui` present as an intentional runtime dependency
- [x] Audit the first reusable interaction pattern and choose progress as the initial migration slice
- [x] Implement a Bits UI-backed shared `Progress` primitive and migrate the current progress bar call sites
- [x] Validate the first migration slice with `pnpm check`
- [x] Audit the next interaction slice and choose drill answer selection for migration
- [x] Implement the next Bits UI migration in `DrillExercise.svelte` with `RadioGroup`
- [x] Validate the drill migration slice with `pnpm check`
- [x] Audit the locked lesson-card pattern as the next repeated interaction slice
- [x] Implement the lesson-card migration with Bits UI `Button.Root`
- [x] Validate the lesson-card migration slice with `pnpm check`
- [ ] Audit the next interactive component or repeated pattern for migration
- [ ] Implement the next Bits UI wrapper or direct migration
- [ ] Validate the next migration slice with focused accessibility and product checks

## Open Questions

- Which current interactive components need thin shared wrappers versus direct Bits UI usage?
- Are there existing custom interaction patterns that should stay native because Bits UI would add unnecessary abstraction?

## Follow-Up

- Start with the highest-reuse interactive primitives before touching lesson-specific components.
- Batch migrations by interaction type so validation stays focused and regressions are easier to isolate.
