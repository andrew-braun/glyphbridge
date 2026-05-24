# Task: Same Letters, New Words Lesson Step

- Start date: 2026-05-24
- Owner: GitHub Copilot
- Status: done

## Goal

Add a built-in lesson section that helps learners transfer newly taught letters
and patterns from the anchor word into different real words before drills begin.

## Scope

- In scope:
  - Reuse existing support vocabulary as the content source for the new section.
  - Add a low-stakes transfer step between rules and drills when support words exist.
  - Keep completion as the only lesson-completion checkpoint after drills finish.
  - Update the canonical lesson-flow docs and instructions from six to seven steps.
- Out of scope:
  - New DB schema fields or vocabulary roles.
  - New scored interactions or spaced-repetition logic.
  - New Thai level 6 lessons or broad vocabulary expansion.

## Constraints

- Technical:
  - Keep route orchestration in `src/routes/learn/[id]/+page.svelte`.
  - Keep rendering in `src/lib/components/lesson`.
  - Keep curriculum data serializable and presentation-free.
- Product:
  - Preserve one anchor word per lesson.
  - Make the new section feel like transfer practice, not a second anchor lesson.
  - Do not mark a lesson complete before drills are resolved.
- Security:
  - No auth, env, database, or secret handling changes are planned.

## Decisions

- Decision: Insert the new section between rules and drills.
  Reason: Learners have just learned the relevant letters and rules, so fresh words
  give them a safe transfer moment before scored practice.
- Decision: Reuse `Lesson.vocabulary` entries with `role: "support"`.
  Reason: The current data model, seed path, and delivery payloads already carry
  support words without a schema change.
- Decision: Include the step dynamically only when support words exist.
  Reason: Future lessons can stay valid even if support vocabulary is not authored yet.
- Decision: Hide support-word answers until the learner chooses to check the read.
  Reason: The section should test transfer before explaining, matching the app-wide
  principle of giving tools first and revealing answers after an attempt.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation Results

- `pnpm check`: passed.
- `pnpm stylelint`: passed.
- `pnpm lint`: passed.
- `git diff --check`: passed.
- Scoped markdown lint for touched markdown files: passed.
- Scoped Prettier check for touched files: passed.
- Self-check reveal update: revalidated with `pnpm check`, `pnpm stylelint`,
  `pnpm lint`, scoped markdown lint, scoped Prettier check, and `git diff --check`.
- `pnpm build`: blocked before Vite by `publication:generate` because no generated
  publication artifact is available and the delivery fetch fails in this environment.

## Open Questions

- Should a follow-up content pass raise every lesson from two support words to three
  or four once the UI step lands?
- Should support-word quality eventually be enforced by curriculum validation rules?

## Follow-Up

- Add curriculum validation for support-word quality once more courses use this pattern.
