# 2026-05-23 Animation Pass

## Scope

- Implement the shared motion foundation for a broad sitewide animation pass.
- Prioritize lesson flow, drill feedback, and adjacent learner routes before shell-wide polish.
- Treat `prefers-reduced-motion` support as mandatory for all touched motion.

## Decisions

- Keep motion expressive but polished, with lessons slightly more ceremonial than shell interactions.
- Avoid app-wide route-transition frameworks in the first pass; prefer component- and section-level motion.
- Reuse the existing shared motion layer (`Reveal.svelte`) instead of adding an external animation library.

## Progress

- [x] Research current motion patterns and lesson-flow anchors.
- [x] Approve implementation plan.
- [x] Add shared motion tokens and reduced-motion-safe mixins.
- [x] Normalize shared interactive primitives.
- [x] Animate lesson step transitions and intra-step reveals.
- [x] Extend motion to practice, learn index, alphabet, and home surfaces.
- [x] Validate with `pnpm check` and `pnpm build`.

## Current Slice

- Goal: land the first end-to-end animation implementation pass across the shared motion layer, lesson flow, and adjacent learner routes.
- Hypothesis: a shared motion vocabulary plus staged pedagogical reveals would materially smooth the learning flow without changing lesson logic or drill fairness.
- Validation: focused stylelint on touched slices during implementation, then `pnpm check` and `pnpm build` once the full pass was wired together.

## Notes

- Existing motion already centers on `Reveal.svelte`, a small lesson-step fade-in mixin, and a few one-off transitions in shared UI components.
- The first implementation slice should avoid changing lesson progression logic or introducing perceived latency in drills.
- If motion conventions become durable, update the relevant instruction files after the implementation pass lands.
- Landed: shared motion tokens and reduced-motion-safe helpers in the SCSS layer; normalized shared primitive motion in `Reveal`, `Progress`, `ThemeToggle`, `CollapsiblePanel`, and `HamburgerMenu`; lesson-step staging and drill feedback reveals; staggered or sequenced motion in lesson breakdown/letters/rules/complete; staged entrances in practice, learn index, alphabet, and home lesson-list surfaces.
- Validation passed: `pnpm check` and `pnpm build`.
- Validation caveat: `pnpm check:all` is currently blocked by unrelated repository formatting debt outside this slice, though the files touched in this pass were formatted locally.

## Follow-up

1. Apply the shared motion tokens to `Progress`, `CollapsiblePanel`, `ThemeToggle`, and `HamburgerMenu`.
2. Replace hard cuts between lesson steps with controlled enter/exit motion.
3. Add pedagogical staggered reveals in breakdown, letters, rules, and completion states.
4. Sweep adjacent routes for consistency and reduced-motion coverage.
