# Task: SvelteKit VS Code debug launch

- Start date: 2026-04-26
- Owner: GitHub Copilot
- Status: completed

## Goal

Add a workspace `launch.json` that makes it easy to start and debug the SvelteKit app from VS Code.

## Scope

- In scope:
  - Add `.vscode/launch.json`
  - Use the repo's existing `pnpm dev` entry point
  - Support a one-step browser-backed debug session for local SvelteKit work
- Out of scope:
  - Changing runtime scripts or Vite configuration
  - Adding custom tasks unless the launch config needs them

## Decisions

- Use the existing `pnpm dev` script instead of introducing a parallel debug script.
- Launch the Vite dev server from VS Code and wait for Vite's local URL before opening a browser debugger.

## Progress

- [x] Inspect current scripts and workspace settings
- [x] Add launch configuration
- [x] Validate the new config

## Validation

- Passed: VS Code Problems check for `.vscode/launch.json` and the task tracker
- Passed: `pnpm dev` startup output matched the `serverReadyAction` pattern, including dynamic port fallback
- Passed: `pnpm check`
