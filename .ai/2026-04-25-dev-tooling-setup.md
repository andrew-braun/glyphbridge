# Task: Dev tooling setup and optimization

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Goal

Set up a modern linting and formatting toolchain for the SvelteKit + TypeScript + SCSS stack, tighten alias ergonomics, and document additional tooling that will help keep the workspace consistent and maintainable.

## Scope

- In scope:
  - Add ESLint for SvelteKit, Svelte, and TypeScript using the current flat-config approach
  - Add Stylelint for SCSS and Svelte `<style>` blocks
  - Review and refine TypeScript compiler and alias configuration
  - Tighten Prettier and editor integration where useful
  - Add scripts for validation and autofix workflows
  - Document additional recommended tooling for consistency and maintenance
- Out of scope:
  - Adding test frameworks or changing application runtime behavior
  - Large-scale code refactors to satisfy new lint rules

## Sources

- `package.json`
- `tsconfig.json`
- `svelte.config.js`
- `vite.config.ts`
- `.vscode/settings.json`
- Current `typescript-eslint` quickstart guidance for ESLint 9 flat config
- Current `eslint-plugin-svelte` user guide
- Current Stylelint configuration guidance for modern config files and overrides

## Decisions Applied

- Use ESLint 9 flat config instead of deprecated legacy config formats
- Keep SvelteKit as the source of truth for path aliases and let generated TS config inherit them
- Use Stylelint overrides so `.svelte` and `.scss` files get the correct syntax handling without special-case scripts
- Keep Prettier responsible for formatting and avoid overlapping stylistic lint rules where possible
- Favor a low-churn lint baseline that catches real consistency issues without forcing a repo-wide Svelte or SCSS refactor
- Add workspace-level alias entry points for the stable `src/lib` boundaries instead of introducing route-level aliases

## Outputs

- `eslint.config.js`
- `stylelint.config.mjs`
- `.stylelintignore`
- `.markdownlint.jsonc`
- Updated `package.json` scripts and dev dependencies
- Updated `svelte.config.js`, `tsconfig.json`, and `vite.config.ts` for aliases and TS ergonomics
- Updated `.vscode` recommendations and settings
- Updated `AGENTS.md`, `.github/copilot-instructions.md`, and `README.md`

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Addendum 2026-04-25 Follow-Up

- Added `husky` with `pre-commit` and `pre-push` hooks so staged-file fixes stay local and the full validation suite runs before pushes.
- Added `lint-staged` so staged TypeScript, Svelte, styles, Markdown, and JSON files are fixed with the matching toolchain instead of running broad repo-wide autofix on every commit.
- Added `knip` with explicit SvelteKit route/config entry points in `knip.json` so the analyzer follows the real app graph instead of reporting most `.svelte` files as unreachable.
- Added `supabase` CLI package scripts (`db:start`, `db:stop`, `db:reset`, `db:lint`) so the local DB workflow is first-class and no longer looks unused to dependency analysis.
- Restored `bits-ui` as an intentional runtime dependency even though the current app does not import it yet, because Bits UI is the explicit default primitive layer for the upcoming interactivity refactor. `knip` ignores it until that refactor lands.
- Kept `src/lib/supabase.ts` out of `knip` for now because it is an intentional placeholder until the authenticated `@supabase/ssr` boundary lands.
- CSS property sorting is enabled on the fix path: `pnpm stylelint:fix` and the staged-file hook alphabetize properties through `stylelint.sort.config.mjs`, while plain `pnpm stylelint` stays low-churn and does not fail unsorted legacy blocks.

## Open Questions

- Remove the temporary `src/lib/supabase.ts` `knip` ignore when the authenticated Supabase work replaces the placeholder module with a real request-scoped boundary.

## Follow-Up

- Tighten the temporary `knip` ignore list once the Supabase runtime integration lands and the placeholder client module is either wired up or removed.
- Remove the temporary `bits-ui` `knip` ignore as part of the planned interactivity refactor that starts using Bits UI primitives in shared components.

## Validation

- Passed: `pnpm lint:fix && pnpm lint`
- Passed: `pnpm install && pnpm stylelint`
- Passed: `pnpm check:all`
- Passed: `pnpm build`
- Passed: `pnpm knip`
- Pending follow-up validation: `pnpm check:all` after restoring the intentional `bits-ui` dependency and updating the temporary `knip` ignore list.

## Addendum 2026-04-25

- Added `markdownlint-cli2` and repo-level Markdown scripts.
- Kept Markdown lint as an explicit script instead of adding it to `check:all`, because the existing docs set still has broader Markdown-rule debt that should be staged separately.
- Disabled `MD060/table-column-style` at the repo level because it conflicts with the current Prettier-driven Markdown formatting and `markdownlint` does not auto-fix it.
- Kept Prettier as the Markdown formatter and `markdownlint` as the opt-in structural checker.
