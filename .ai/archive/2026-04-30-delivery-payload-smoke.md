# Task: Delivery Payload Smoke

- Start date: 2026-04-30
- Owner: GitHub Copilot
- Status: completed

## Goal

Add a small executable smoke test that checks the active published
`delivery.course_publication_lessons` bundle against the current runtime lesson
contract.

## Ordered Scope

1. Reuse the published-payload normalization logic instead of duplicating it in a
   separate smoke script.
2. Add a local script that loads the active published lesson bundle and compares it
   to the canonical runtime Thai lesson data.
3. Update the Supabase workstream trackers so the smoke/parity step is marked as
   complete and the authenticated `@supabase/ssr` boundary becomes the next
   implementation gate.

## Constraints

- Keep the smoke test scoped to published lesson delivery only.
- Do not start authenticated route or learner-sync work in this slice.
- Keep the script runnable against local Supabase without introducing a full new
  test framework.

## Validation Plan

- Validate the delivery payload refactor with `pnpm check`.
- Run the new delivery smoke script against the local Supabase instance.

## Implemented

- Extracted the published lesson payload normalization into
  `src/lib/server/delivery-payload.ts` so both the learn routes and the smoke
  script use the same contract mapping.
- Added `scripts/smoke-delivery-payload.mjs` to query the active published lesson
  bundle from `delivery.course_publication_lessons` and compare it against the
  canonical runtime Thai lesson data.
- Added `pnpm run db:smoke:delivery` as the focused executable check for the
  published lesson bundle.
- Updated the Supabase workstream trackers so the smoke/parity step is now
  recorded as complete and the authenticated `@supabase/ssr` boundary remains the
  next implementation gate.

## Validation

- Passed: `pnpm check`
- Passed: `pnpm run db:smoke:delivery`
