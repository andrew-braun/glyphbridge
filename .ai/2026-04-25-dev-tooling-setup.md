# Task: Dev tooling setup and optimization

- Start date: 2026-04-25
- Owner: GitHub Copilot
- Status: in-progress

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

## Outputs

- Tooling config files
- Updated workspace scripts and editor recommendations
- Validation results for check, lint, stylelint, and build flows

## Progress

- [x] Discovery and research
- [ ] Implementation
- [ ] Validation
- [ ] Documentation updates

## Open Questions

- Whether any existing files need targeted rule exceptions after the first lint pass.

## Follow-Up

- None yet.