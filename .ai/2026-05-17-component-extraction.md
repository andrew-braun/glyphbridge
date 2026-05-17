# Component Extraction Implementation

Date: 2026-05-17

## Goal

Move GlyphBridge toward a component-centered design system by extracting repeated UI and presentation patterns into reusable primitives and feature components, while preserving current route behavior and learner flow.

## Scope

- Start with a low-risk foundation slice: shared primitives, repeated route presentation, and any baseline blockers discovered during validation.
- Keep `src/lib/components/ui` domain-agnostic.
- Put Thai-, lesson-, word-, and navigation-specific presentation in the matching feature component folders.
- Preserve existing user/worktree changes.

## Current Baseline

- `git status --short` showed existing changes before this implementation slice:
  - `.kilo/plans/1779007991841-swift-sailor.md` added
  - `src/lib/components/content/home/GuestHomeShell.svelte` renamed to `src/lib/components/content/home/HomeHero.svelte`
  - `src/lib/components/navigation/MainNav.svelte` modified
  - `src/routes/+page.svelte` modified
- `get_errors` for `src` reported no current errors at the start of implementation.

## Implementation Plan

1. Inspect current changed files before editing.
2. Add core primitives with small typed APIs.
3. Migrate repeated route/component markup to those primitives.
4. Run focused validation after each coherent slice.
5. Update this tracker with decisions, progress, blockers, and follow-ups.

## Candidate First-Slice Primitives

- `Badge`
- `PageShell`
- `ActionGroup`
- `EmptyState`
- `MetricPill` / `MetricDisplay`
- `DetailRow`
- `NoticeBox`
- `FeedbackBanner`
- `StepLayout` / `StepCounter`

## Progress

- Created tracker.
- Added shared primitives:
  - `src/lib/components/ui/Badge.svelte`
  - `src/lib/components/ui/EmptyState.svelte`
  - `src/lib/components/ui/MetricPill.svelte`
  - `src/lib/components/ui/MetricDisplay.svelte`
  - `src/lib/components/ui/DetailRow.svelte`
  - `src/lib/components/ui/NoticeBox.svelte`
  - `src/lib/components/ui/FeedbackBanner.svelte`
  - `src/lib/components/layout/PageShell.svelte`
  - `src/lib/components/layout/ActionGroup.svelte`
  - `src/lib/components/lesson/StepLayout.svelte`
  - `src/lib/components/lesson/StepCounter.svelte`
- Added the missing `badge--muted` global badge tone.
- Migrated first usages across route pages, auth, practice, words, lesson steps, drill feedback, and alphabet detail rows.
- Left existing pre-slice worktree changes in `HomeHero.svelte`, `MainNav.svelte`, and `src/routes/+page.svelte` intact.

## Decisions

- Existing global classes may remain as implementation details behind components when useful.
- Route files continue to own data/state; components receive serializable/presentational props and snippets.

## Validation

- `pnpm check` passed with 0 errors and 0 warnings.
- `pnpm lint` passed after sorting imports.
- `pnpm stylelint` passed.
- `get_errors` for `src` reported no current errors.

## Follow-Ups

- Document final primitive APIs once the first implementation slice lands.
- Continue extraction with `HomeHero`/language-card presentation, `WordCard`, `LessonCard`, `InfoCard`, `FormField`, and navigation subcomponents.
- Consider whether `Badge`, `PageShell`, `ActionGroup`, and metric primitives should be documented in a durable design-system doc before the next broad migration.
