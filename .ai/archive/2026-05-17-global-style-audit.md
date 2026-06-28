# Global Style Audit And Refactor

Date: 2026-05-17

## Goal

Audit every `:global` selector in Svelte style blocks, keep only the cases that are structurally required, and refactor the rest toward local SCSS that mirrors the rendered HTML structure.

## Scope

- Review all `:global` usage under `src/`.
- Prefer local wrapper elements, component-owned styling, or small API adjustments over cross-component selectors.
- Preserve current visuals and interaction behavior.
- Keep shared UI primitives domain-agnostic.

## Working Hypothesis

Most current `:global` selectors are compensating for scoped-style boundaries created by styling classes attached to child components (`Reveal`, `Heading`, `CardLink`, `Button`, `NoticeBox`, Bits UI primitives). In most cases, local wrapper markup or child snippets should remove the need for globals.

## Plan

1. Audit each `:global` use by pattern and owner.
2. Refactor the route-owned lesson card/list slice first.
3. Refactor component-level snippet/child-component globals.
4. Re-check the hamburger menu and other Bits UI primitives for any unavoidable globals.
5. Run focused validation, then `pnpm check`.

## Progress

- Located all current `:global` selectors under `src/`.
- Grouped the usages into route-owned child-component styling, snippet-content styling, and Bits UI root styling.
- Replaced all `:global` selectors under `src/` with local structure, inherited CSS-variable hooks, or Bits UI child snippets.
- Reworked SCSS nesting so the selectors follow the rendered HTML structure instead of reaching across component boundaries.

## Decisions

- Use local wrapper elements around `Reveal`, `Button`, and `NoticeBox` instead of styling child-component classes from the parent.
- Let `Heading.svelte` consume inherited CSS custom properties for size, line-height, and margin so page-level heading variants stay component-safe.
- Use native/local roots for lesson cards and list items instead of styling `CardLink` roots from outside the component.
- Use Bits UI `child` snippets for `Dialog` and `Progress` so the styled DOM elements live in the owning component.
- Use inherited CSS variables in `MainNav` for mobile drawer-specific link sizing instead of styling parent-owned snippet classes from `HamburgerMenu`.

## Validation

- `grep_search` for `:global` under `src/` returned no matches after the refactor.
- `get_errors` on touched files returned no compile errors.
- `pnpm lint && pnpm stylelint && pnpm check` passed.
- `pnpm quality:check` did not complete because `format:check` reports unrelated pre-existing formatting drift elsewhere in the worktree; touched refactor files were formatted with `pnpm exec prettier --write`.

## Follow-Ups

- If the repository wants `pnpm check:all`, add or document the canonical aggregate script so the instruction files match the actual package scripts.
