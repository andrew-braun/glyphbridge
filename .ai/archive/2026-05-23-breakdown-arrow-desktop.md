# Breakdown Arrow Desktop

## Scope

- Fix the stage-2 lesson breakdown layout on desktop so the connective arrow points at the syllable group instead of empty space.
- Refine the stage-2 presentation into clearer before/after panels so the explanation feels contained instead of floating on the page background.

## Hypothesis

- The desktop grid auto-placement leaves the syllable cards on the next row because only the pronunciation block has an explicit column, so the right arrow renders in the top-right corner.

## Progress

- [x] Inspect the lesson breakdown component and reproduce the broken desktop render.
- [x] Assign explicit desktop grid areas for the word, connective arrow, syllables, and pronunciation.
- [x] Run focused validation.
- [x] Rework the breakdown into whole-word and syllable panels with a connector badge.
- [x] Validate the revised panel layout in-browser and with focused checks.

## Notes

- `Reveal` renders its own DOM node, so parent-scoped selectors for `breakdown__word`, `breakdown__arrow`, and `breakdown__full` needed `:global(...)` to affect the actual grid items.
- The selected direction is the “before / after cards” layout: distinct section panels, a connector treatment between them, and gloss chips anchored inside the syllable panel.
- Final validation passed with `pnpm stylelint src/lib/components/lesson/StepBreakdown.svelte` and `pnpm check`.
