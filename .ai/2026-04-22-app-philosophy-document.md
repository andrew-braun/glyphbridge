# Task: App philosophy document

- Start date: 2026-04-22
- Owner: GitHub Copilot
- Status: completed

## Goal

Create a concise, durable product philosophy document in `docs/` that turns the detailed Thai-specific concept material into a script-agnostic guide for product and engineering decisions.

## Scope

- In scope:
  - Distill the teaching model into product language that applies across scripts
  - Define the core domain terms, lesson contract, and progress model
  - Capture architectural guardrails relevant to schemas, routes, components, and persistence
  - Index the new durable document in `docs/README.md`
- Out of scope:
  - Curriculum implementation changes
  - Route or component refactors
  - Database design changes beyond durable guidance

## Source Material

- `docs/concept/approach-thai.md`
- `README.md`
- `AGENTS.md`
- `docs/AGENTS.md`
- `.github/instructions/lesson-flow.instructions.md`
- `.github/instructions/data-and-state.instructions.md`
- `src/lib/data/types.ts`
- `src/lib/stores/progress.ts`
- `.ai/2026-04-22-multi-course-script-architecture.md`

## Decisions Captured

- The app teaches scripts through real words and recurring patterns, not chart memorization.
- The learner-facing unit is a course, while script-system metadata remains supporting infrastructure.
- The lesson flow stays `intro -> breakdown -> letters -> rules -> drills -> complete` unless product requirements explicitly change.
- Progress is linear by default and should be modeled from completion facts rather than duplicated derived state.
- Shared docs should use script-agnostic terminology such as `text`, `graphemes`, and `course`.

## Outputs

- Added `docs/app-philosophy.md`
- Updated `docs/README.md`

## Validation

- Passed: `pnpm check`
