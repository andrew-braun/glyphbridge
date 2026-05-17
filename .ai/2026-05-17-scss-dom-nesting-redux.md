# 2026-05-17 SCSS DOM Nesting Redux

## Goal

- Reapply DOM-reflective SCSS nesting after the git reset.
- Favor nesting that visually mirrors the rendered DOM.
- Avoid unnecessary direct-child combinators.

## Scope

- Shared UI components and route styles that reverted to flat sibling selector blocks.
- Instruction/task notes only if wording or tracking needs refresh.

## Plan

- Validate the nesting pattern on a small representative component first.
- Roll the same structure through the remaining flat SCSS slices.
- Re-run focused style and Svelte checks.

## Progress

- Confirmed `src/lib/components/ui/SourceList.svelte` was back to flat sibling selectors after the reset.
- Re-nested shared UI primitives around their rendered DOM structure: `SourceList`, `Disclosure`, `SectionHeader`, `IconBox`, `ThemeToggle`.
- Re-nested route-owned style blocks in `about`, `auth`, `practice`, and `learn/[id]` to read like the page DOM.
- Re-nested remaining shared/component styles in `global.scss`, `StepIntro`, `GlyphRibbon`, `GlyphOrbit`, and `HamburgerMenu`.
- Removed the stale unused selector in `src/routes/about/+page.svelte` that was previously warning in `svelte-check`.

## Validation

- `pnpm stylelint` passed for each touched batch.
- `pnpm check` passed with 0 errors and 0 warnings after the final route fix.
- `pnpm check:all` pending.
