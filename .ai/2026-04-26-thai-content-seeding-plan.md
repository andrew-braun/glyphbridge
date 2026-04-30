# Task: Thai content seeding plan

- Start date: 2026-04-26
- Owner: GitHub Copilot
- Status: completed

## Goal

Define, execute, and record the approved content/DB plan for rewriting the Thai
runtime curriculum, seeding that rewritten course into `curriculum.*`, and generating
the first `delivery.*` lesson bundles.

## Authority

- This is the authoritative planning and sequencing document for the Thai
  content-seeding lane that produced the first Thai DB seed.
- `tasks/supabase-db-foundation/implementation-status.md` remains the authoritative
  resume-point and next-steps document for the broader DB workstream.
- The curriculum rewrite and first seed are now complete. The next gate is consuming
  the seeded `delivery.*` publication bundle through a server-owned runtime boundary
  without drifting from the approved lesson contract.

## Source Hierarchy

1. `src/lib/data/thai.ts`
   - Authoritative for the approved rewritten Thai lesson set, ordering, anchor
     words, grapheme pedagogy, rules, drills, and review-letter sets.
2. `src/lib/data/types.ts`
   - Authoritative for the current runtime curriculum contract.
3. `docs/concept/approach-thai.md`
   - Authoritative Thai concept source for the frequency-first sequencing rationale
     used by the rewrite, remaining lesson-expansion candidates, and coverage
     targets not yet encoded in runtime.
4. `docs/database-dto-spec.md`
   - Authoritative target schema, naming, and DTO mapping.
5. `src/routes/+page.svelte`, `src/lib/components/content/home/HomeHero.svelte`, and
   `src/routes/learn/+page.svelte`
   - Current source for course hero and SEO copy that is not stored in `thai.ts`.

## Current Source Reconciliation

- The approved rewrite path has landed in `src/lib/data/thai.ts`.
- The runtime course now contains 13 lessons and 24 unique new graphemes organized
  around the frequency-first sequence from `docs/concept/approach-thai.md`.
- The runtime rewrite now covers the document's levels 1 through 5 in explicit
  lesson data and leaves the level 6 loanword-heavy expansion as follow-on content.
- `src/lib/stores/progress.ts` now uses snapshot version `2` so older lesson
  completions do not map onto the rewritten lesson IDs.
- `docs/database-dto-spec.md` now introduces `curriculum.vocabulary_items`,
  `curriculum.vocabulary_segments`, and `curriculum.lesson_vocabulary` so lessons can
  eventually teach and drill multiple reusable words instead of only one anchor word.
- The current runtime data still models a single `anchorWord` for the featured lesson
  concept, but now also carries the first authored supporting-vocabulary slice via
  `lesson.vocabulary`.
- `scripts/generate-thai-seed.mjs` now derives deterministic SQL seed output from the
  rewritten runtime source of truth.
- `supabase/seed.sql` now seeds the rewritten Thai course into `curriculum.*` and the
  first published lesson bundles into `delivery.*`.
- The first seeded local database has been verified directly with 1 course, 1 course
  version, 13 lessons, 39 vocabulary items, and 13 publication lesson payloads.

## Approved Direction

- Seed the rewritten runtime curriculum from `src/lib/data/thai.ts` as the first
  Thai course version.
- Treat `docs/concept/approach-thai.md` as the durable expansion and validation
  source for the remaining level 6 content and future version increments.
- Treat the new vocabulary tables as part of the first-class content model now so the
  app can grow into vocabulary drilling without another schema reshape.
- Use the companion dataset file
  `tasks/supabase-db-foundation/thai-curriculum-seed-dataset.md` as the DB-ready
  inventory for the rewritten course.

## Plan Outcome

- [x] Finalize the rewritten seed scope and release metadata.
- [x] Compile the rewritten DB-ready source inventory from `thai.ts`, `types.ts`,
      route metadata, and `approach-thai.md`.
- [x] Materialize the rewritten lesson set into normalized seed inputs for
      `curriculum.languages`, `curriculum.script_systems`, `curriculum.courses`,
      `curriculum.course_versions`, `curriculum.graphemes`,
      `curriculum.course_version_graphemes`, `curriculum.lessons`,
      `curriculum.vocabulary_items`, `curriculum.vocabulary_segments`,
      `curriculum.lesson_vocabulary`, `curriculum.anchor_targets`,
      `curriculum.anchor_segments`, `curriculum.orthography_rules`,
      `curriculum.orthography_rule_examples`, `curriculum.lesson_graphemes`,
      `curriculum.lesson_rules`, `curriculum.drills`, `curriculum.drill_options`,
      and `curriculum.lesson_drills`.
- [x] Generate the first `delivery.course_publication_lessons` payloads.
- [x] Validate the first seed against the local Supabase schema.
- [ ] Use the remaining level 6 material in `approach-thai.md` to scope the next Thai
      content version after the first seed.

## Approved Decision

The approved path is:

1. Rewrite `src/lib/data/thai.ts` to align with `docs/concept/approach-thai.md`.
2. Treat the rewritten runtime course as the seed source of truth.
3. Keep the remaining level 6 expansion as follow-on curriculum work rather than
   blocking the first seed.

## Validation Outcome

- Confirm the rewritten inventory counts before writing SQL:
  - 13 lessons
  - 24 unique new graphemes
  - 96 lesson-grapheme joins
  - 26 rules
  - 55 rule examples
  - 65 drills
  - 260 drill options
  - 27 anchor segments
- Passed: every `reviewLetters` entry references a grapheme introduced in an earlier
  lesson.
- Passed: `pnpm check` after rewriting `src/lib/data/thai.ts`, resetting the local
  progress snapshot version, and adding tone-mark support to the alphabet page.
- Passed: `pnpm exec supabase db reset --yes` after generating the first real Thai
  curriculum seed.
- Passed: direct SQL verification against the local database confirming 1 course, 1
  course version, 13 lessons, 39 vocabulary items, and 13 publication lesson rows.

## Handoff

- The Thai content-seeding lane is complete for v1.
- The next implementation step is to add the first server-owned SvelteKit read path
  over `delivery.course_publication_lessons` so runtime lesson reads can move off the
  static TypeScript pack and onto the seeded publication bundle.
- Keep `scripts/generate-thai-seed.mjs` and `supabase/seed.sql` aligned with
  `src/lib/data/thai.ts` whenever the Thai runtime curriculum changes.
