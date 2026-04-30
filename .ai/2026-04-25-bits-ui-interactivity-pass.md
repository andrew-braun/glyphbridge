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
- Bits UI should be treated as the foundation layer for repeated interactive patterns, with app-owned wrappers in `src/lib/components/ui` becoming the preferred product-facing API once a pattern has clear reuse or styling needs.
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
- Audited the alphabet page interaction and chose the letter-tile selection model as the next seam because the page still owned bespoke multi-grid selection state.
- Migrated `src/routes/alphabet/+page.svelte` to Bits UI `ToggleGroup` for letter-tile selection while preserving the existing inline detail panel and deselect-on-second-click behavior.
- Revisited the recent direct Bits UI migrations after the wrapper-first architecture decision and backtracked them behind app-owned `ui/` primitives.
- Added `src/lib/components/ui/RadioButtons.svelte`, `src/lib/components/ui/ToggleTiles.svelte`, and `src/lib/components/ui/CardLink.svelte`, and updated `src/lib/components/ui/Button.svelte` to compose Bits UI internally.
- Rewired `DrillExercise.svelte`, the learn index lesson cards, the shared `LessonList.svelte`, and the alphabet letter grid to consume the new wrappers instead of importing Bits UI directly.
- Re-audited `src/**` after the wrapper extraction and confirmed that raw `bits-ui` imports now live only inside `src/lib/components/ui` wrappers.

## Comprehensive Inventory 2026-04-30

### Already Backed By Bits UI

| Surface                        | Files                                                                                                                                                                                                             | Bits UI Foundation    | App Wrapper    | Status | Notes                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| Buttons and CTA links          | `src/lib/components/ui/Button.svelte`                                                                                                                                                                             | `Button.Root`         | `Button`       | done   | Shared button API already covers primary, secondary, ghost, success, `href`, `disabled`, and click handlers. |
| Lesson and home card links     | `src/lib/components/ui/CardLink.svelte`, `src/routes/learn/+page.svelte`, `src/lib/components/content/lesson/LessonList.svelte`                                                                                   | `Button.Root` as link | `CardLink`     | done   | Replaced the old fake disabled-link pattern for lesson cards.                                                |
| Drill answer choice groups     | `src/lib/components/ui/RadioButtons.svelte`, `src/lib/components/exercises/DrillExercise.svelte`                                                                                                                  | `RadioGroup`          | `RadioButtons` | done   | Covers selectable answers, disabled state after answering, and correct or wrong visual tone.                 |
| Alphabet letter tile selection | `src/lib/components/ui/ToggleTiles.svelte`, `src/routes/alphabet/+page.svelte`                                                                                                                                    | `ToggleGroup`         | `ToggleTiles`  | done   | Covers single-select tile grids, disabled locked letters, Thai labels, and known-state styling.              |
| Progress indicators            | `src/lib/components/ui/Progress.svelte`, `src/routes/learn/[id]/+page.svelte`, `src/routes/alphabet/+page.svelte`, `src/routes/practice/+page.svelte`, `src/lib/components/content/home/HomeStatsOverview.svelte` | `Progress`            | `Progress`     | done   | Consolidated the repeated bespoke progress bars into a single wrapper.                                       |

### Current App Surfaces That Could Still Become Bits UI Components

| Surface                              | Files                                                       | Current Behavior                                                                                                  | Best Bits UI Fit                                                            | Suggested Wrapper                               | Priority | Trigger For Extraction                                                                                                                                     |
| ------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Letter detail panel                  | `src/routes/alphabet/+page.svelte`                          | Inline conditional detail panel opens when a tile is selected and closes with a button.                           | `Collapsible` now, `Dialog` later if mobile or overlay behavior is needed.  | `LetterDetailPanel`                             | later    | Extract when the same detail-panel pattern appears for words, rules, or lesson references, or when the alphabet panel needs richer open or close behavior. |
| Shared disclosure content blocks     | none yet, but likely future lesson or word reference panels | Not present yet as a reusable component, but the product is likely to grow into expandable explanations or hints. | `Collapsible` or `Accordion` depending on single vs multiple open sections. | `Disclosure` or `AccordionSection`              | later    | Add only once a second disclosure surface exists.                                                                                                          |
| Floating reference panels            | none yet                                                    | Not present today, but any future notes, hints, or learner-help popovers would fit here.                          | `Popover` or `Tooltip`                                                      | `HelpPopover`, `Tooltip`, or `ReferencePopover` | later    | Only if the product adds dense inline help that should not live in page copy.                                                                              |
| Overlay confirmations or modal flows | none yet                                                    | Not present today. Current navigation and completion flows are route-driven and inline.                           | `Dialog` or `AlertDialog`                                                   | `Modal` or `ConfirmDialog`                      | later    | Only if the app gains destructive actions, blocking confirmations, or richer modal lesson content.                                                         |

### Current Surfaces That Should Stay Native

| Surface                                      | Files                                                                                                                                                                                                                                                                             | Why It Should Stay Native                                                                                                                                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main navigation links                        | `src/lib/components/navigation/MainNav.svelte`                                                                                                                                                                                                                                    | Plain semantic links with active-state styling do not need Bits UI until the nav gains menus, disclosure, or mobile open-state behavior.                                                                               |
| Step progression buttons                     | `src/lib/components/lesson/StepIntro.svelte`, `src/lib/components/lesson/StepBreakdown.svelte`, `src/lib/components/lesson/StepLetters.svelte`, `src/lib/components/lesson/StepRules.svelte`, `src/lib/components/lesson/StepComplete.svelte`, `src/routes/practice/+page.svelte` | These are currently simple linear next or restart actions already covered by the shared `Button` wrapper. There is no tabset, wizard header, or multi-path navigation that would justify another Bits abstraction yet. |
| Home hero actions and empty-state CTAs       | `src/lib/components/content/home/HomeHero.svelte`, `src/routes/words/+page.svelte`, `src/routes/practice/+page.svelte`                                                                                                                                                            | These are plain links or buttons already covered by the existing `Button` wrapper and do not have extra interaction state.                                                                                             |
| Presentational layout and display components | `src/lib/components/ui/Heading.svelte`, `src/lib/components/ui/StatCard.svelte`, `src/lib/components/ui/IconBox.svelte`, `src/lib/components/layout/Row.svelte`, `src/lib/components/layout/page/PageHero.svelte`                                                                 | These components are display-only and should not be pushed onto Bits UI just for consistency.                                                                                                                          |

### Explicitly Out Of Scope For The Current Product

- `Tabs`, `NavigationMenu`, `DropdownMenu`, `Menubar`, `ContextMenu`, and `Combobox` do not have real product surfaces yet.
- `Checkbox`, `Switch`, `Select`, `DatePicker`, `DateField`, `TimeField`, and other form-heavy primitives do not fit the current read-only lesson and local-progress experience.
- `Pagination` is not a current need because lesson flow is sequential state, not paged list navigation.

### Planning Conclusion

- The migration now has a clear inventory: five wrapper-backed Bits UI components are already in production, one real later candidate exists in the alphabet detail panel family, and the rest of the current UI should stay native for now.
- The next implementation slice should not begin until a second disclosure-style surface appears or the alphabet detail panel needs richer behavior that native conditional rendering no longer covers well.

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
- [x] Audit the alphabet letter-tile selection pattern as the next interaction slice
- [x] Implement the alphabet selection migration with Bits UI `ToggleGroup`
- [x] Validate the alphabet selection migration slice with `pnpm check`
- [x] Backtrack the recent direct Bits UI migrations behind app-owned `ui/` wrappers
- [x] Validate the wrapper-first refactor with `pnpm check`
- [x] Audit the remaining `src/**` interactive surfaces after wrapper extraction
- [x] Complete a full inventory of current and likely next Bits UI-backed component candidates
- [x] Decide whether a current non-native composite interaction is ready for migration
- [ ] Implement the next Bits UI wrapper-backed migration slice
- [ ] Validate the next migration slice with focused accessibility and product checks

## Open Questions

- When the product grows its next disclosure-style surface, should we standardize on a single `Collapsible` wrapper first or jump straight to an `Accordion` family?
- If the alphabet detail experience grows more complex on mobile, should it stay inline with `Collapsible` semantics or move to a `Dialog`-style overlay?

## Next Extraction Candidates

- `LetterDetailPanel` backed by `Collapsible` if the alphabet detail pattern is reused or needs richer keyboard and motion behavior.
- A shared disclosure wrapper for future expandable rule, word, or reference sections.
- Revisit future dialog, popover, tooltip, menu, or tabs work with a wrapper-first Bits UI approach from the start rather than as a retrofit.

## Follow-Up

- Start with the highest-reuse interactive primitives before touching lesson-specific components.
- Batch migrations by interaction type so validation stays focused and regressions are easier to isolate.
