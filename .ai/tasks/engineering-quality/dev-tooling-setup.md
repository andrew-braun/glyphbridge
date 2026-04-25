# Task: Dev tooling setup and optimization

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: completed

## Related Docs

- `README.md` for the bundle index and redundancy assessment
- `scaling-plan.md` for the broader engineering audit and priority order

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

## Open Questions

- None.

## Follow-Up

- Consider adding `knip` for unused-file and unused-dependency detection once the new lint baseline has had a little time in daily use.

## Validation

- Passed: `pnpm lint:fix && pnpm lint`
- Passed: `pnpm install && pnpm stylelint`
- Passed: `pnpm markdownlint docs/concept/approach-thai.md`
- Passed: `pnpm check:all`
- Passed: `pnpm build`

## Addendum 2026-04-25

- Added `markdownlint-cli2` and repo-level Markdown scripts.
- Configured `MD060/table-column-style` as `style: "any"` so valid Markdown tables are accepted even when Prettier does not vertically align pipes.
- Kept Prettier as the Markdown formatter because `markdownlint` does not auto-fix `MD060`.
