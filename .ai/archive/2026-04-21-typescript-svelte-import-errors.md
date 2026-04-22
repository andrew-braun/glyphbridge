# Task: Fix TypeScript Svelte import diagnostics

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: done

## Goal

Remove editor diagnostics that report TS6263 for valid `.svelte` component imports across the app.

## Scope

- In scope:
  - Investigate the root cause of `.svelte` import errors in the Problems panel
  - Apply the smallest TypeScript config change needed to restore correct editor resolution
  - Validate with repo diagnostics
- Out of scope:
  - Refactoring component imports
  - Unrelated markdown lint cleanup

## Constraints

- Technical:
  - Keep SvelteKit-generated config as the base source of truth.
  - Avoid changing valid component import paths just to satisfy editor noise.
- Product:
  - No user-facing behavior changes.
- Security:
  - No security-sensitive changes involved.

## Decisions

- Decision: Enable `allowArbitraryExtensions` in the root TypeScript config.
  Reason: TypeScript 5.9 emits TS6263 when `.svelte` imports resolve through generated `.d.svelte.ts` declarations unless arbitrary extensions are explicitly allowed.
- Decision: Add the same option through `kit.typescript.config` in `svelte.config.js` and run `svelte-kit sync`.
  Reason: Editor diagnostics were reading the generated `.svelte-kit/tsconfig.json`, so the generated config needed the same compiler option.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Open Questions

- None for the `.svelte` import issue.

## Follow-Up

- Remaining workspace errors are unrelated to TS6263. The largest group comes from a separately broken `src/lib/stores/progress.ts` file, plus existing markdown lint issues.
