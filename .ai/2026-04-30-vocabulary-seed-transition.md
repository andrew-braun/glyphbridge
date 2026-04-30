# Task: Vocabulary Seed Transition

- Start date: 2026-04-30
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Implement the first practical transition from anchor-only lesson content to a
lesson-plus-vocabulary model without breaking the current runtime lesson flow.

## Ordered Scope

1. Add the SQL migration for `vocabulary_items`, `vocabulary_segments`, and
   `lesson_vocabulary`.
2. Update the Thai seed inventory so current anchor words seed into both the anchor
   projection and the new vocabulary tables.
3. Decide the first supporting-vocabulary slice per lesson and extend the runtime
   curriculum model to carry it.

## Constraints

- Preserve the current lesson flow and anchor-word-first teaching experience.
- Keep client lesson types curriculum-shaped, not raw SQL-shaped.
- Treat the current anchor word as the featured lesson word even after vocabulary
  support lands.
- Do not start the actual Supabase curriculum seed until the updated inventory and
  runtime content model are in place.

## Validation Plan

- Validate the new migration with `pnpm exec supabase db reset --yes`.
- Validate runtime type and Svelte changes with `pnpm check`.
- Validate touched markdown trackers with `markdownlint-cli2`.
