# Lesson Flow Visual Sweep

- Start date: 2026-05-24
- Owner: GitHub Copilot
- Status: done

## Goal

Carry the finished lesson-complete visual direction into the real lesson flow so
intro, breakdown, letters, rules, same-letters transfer, drills, and completion
feel like one coherent learning experience.

## Scope

- In scope:
  - Confirm the redesigned completion screen is used by the real lesson route.
  - Apply the completion-page design language to earlier lesson steps: generous
    spacing, section accent stripes, a few solid callouts, and consistent dark
    surfaces.
  - Keep the same-letters transfer step integrated before drills.
  - Validate Svelte, TypeScript, SCSS, lint, build, markdown, and whitespace.
- Out of scope:
  - Changing lesson progression rules or completion timing.
  - Changing curriculum content, scoring behavior, auth, database, or persistence.
  - A full site-wide design-system extraction beyond the lesson flow.

## Constraints

- Preserve the linear lesson sequence and route-owned state machine.
- Keep step components presentational-first.
- Use lesson model data for letters, rules, support words, and drills.
- Maintain dark and light theme contrast for solid accent surfaces.

## Progress

- [x] Audit real lesson flow integration
- [x] Apply shared visual language to earlier steps
- [x] Update documentation and tracker notes
- [x] Validate

## Notes

- `StepComplete` is already rendered by `src/routes/learn/[id]/+page.svelte`, so
  the completion redesign is not preview-only.
- The real lesson route already includes `StepSameLettersNewWords` between rules
  and drills when support vocabulary exists.
- Added a shared `.lesson-accent-panel` utility for the accent-stripe treatment
  used across intro, breakdown, letters, rules, same-letters transfer, and drills.
- Made intro and breakdown anchor words solid teal callouts, the current-letter
  teaching card a solid sky callout, and the same-letters anchor card a solid
  mango callout.
- Updated primary and success button foregrounds to use the same contrast-safe
  solid accent foreground tokens as the callout cards.
- Solid accent contrast ratios after the sweep: primary/on-primary `7.13:1` AAA,
  sky/on-sky `6.58:1` AA, mango/on-mango `9.56:1` AAA, accent/on-accent
  `6.17:1` AA, and success/on-success `5.37:1` AA.

## Desktop Tightening Follow-Up

- Reduced desktop lesson chrome, step gaps, panel padding, drill option height,
  transfer-word row height, and learn-index card density.
- Kept lesson advance actions in normal document flow after follow-up review, so
  longer steps can scroll naturally instead of pinning controls over content.
- Confirmed the removed fixed-action selectors no longer appear in lesson or
  drill components.
- Browser spot-check on `/learn/1` confirmed the breakdown and drill next
  buttons compute to `position: static` and remain in content flow.

## Validation

- `pnpm check` — passed with 0 errors and 0 warnings.
- `pnpm stylelint` — passed.
- `pnpm lint` — passed.
- `pnpm exec vite build` — passed.
- `pnpm exec markdownlint-cli2 --config .markdownlint.jsonc .ai/2026-05-24-lesson-flow-visual-sweep.md` — passed.
- `git diff --check` — passed.
- `curl -I http://127.0.0.1:5173/learn/1` — returned 200 OK.
- `curl -I http://127.0.0.1:5173/test/lesson-complete` — returned 200 OK.
- `pnpm check:all` — blocked at repo-wide `format:check` by unrelated existing
  Prettier drift in 10 files outside this sweep.
- Desktop follow-up validation: `pnpm check`, `pnpm stylelint`, `pnpm lint`, and
  `git diff --check` passed after the spacing update. `pnpm check:all` remained
  blocked at repo-wide `format:check` by unrelated existing Prettier drift in 10
  files outside this sweep.
