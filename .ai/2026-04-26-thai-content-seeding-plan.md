# Task: Thai content seeding plan

- Start date: 2026-04-26
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Define and track the approved content/DB execution plan for rewriting the Thai runtime
curriculum, then seeding that rewritten course into `curriculum.*` and generating the
first `delivery.*` lesson bundles.

## Authority

- This is the authoritative planning and sequencing document for the Thai
  content-seeding lane.
- `tasks/supabase-db-foundation/implementation-status.md` remains the authoritative
  resume-point document for the broader DB workstream.
- The curriculum rewrite decision is resolved. The next gate is converting the
  rewritten runtime inventory into seed inputs without drifting from the approved
  lesson contract.

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
- The current runtime data still models a single `anchorWord` per lesson, so the
  first seed pass will materialize anchor words into both the anchor projection and
  the new vocabulary model while the supporting-word inventory is authored.

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

## Planned Work

1. Finalize the rewritten seed scope and release metadata.
2. Compile the rewritten DB-ready source inventory from `thai.ts`, `types.ts`, route
   metadata, and `approach-thai.md`.
3. Materialize the rewritten lesson set into normalized seed inputs for
   `curriculum.languages`, `curriculum.script_systems`, `curriculum.courses`,
   `curriculum.course_versions`, `curriculum.graphemes`,
   `curriculum.course_version_graphemes`, `curriculum.lessons`,
   `curriculum.vocabulary_items`, `curriculum.vocabulary_segments`,
   `curriculum.lesson_vocabulary`, `curriculum.anchor_targets`,
   `curriculum.anchor_segments`, `curriculum.orthography_rules`,
   `curriculum.orthography_rule_examples`, `curriculum.lesson_graphemes`,
   `curriculum.lesson_rules`, `curriculum.drills`, `curriculum.drill_options`,
   and `curriculum.lesson_drills`.

4. Generate the first `delivery.course_publication_lessons` payloads and validate
   parity against the rewritten SvelteKit lesson contract.
5. Use the remaining level 6 material in `approach-thai.md` to scope the next Thai
   content version after the first seed lands.

## Approved Decision

The approved path is:

1. Rewrite `src/lib/data/thai.ts` to align with `docs/concept/approach-thai.md`.
2. Treat the rewritten runtime course as the seed source of truth.
3. Keep the remaining level 6 expansion as follow-on curriculum work rather than
   blocking the first seed.

## Validation Plan

- Confirm the rewritten inventory counts before writing SQL:
  - 13 lessons
  - 24 unique new graphemes
  - 96 lesson-grapheme joins
  - 26 rules
  - 55 rule examples
  - 65 drills
  - 260 drill options
  - 27 anchor segments
- Confirm every `reviewLetters` entry references a grapheme introduced in an earlier
  lesson. Passed.
- Confirm the first publication payload can round-trip into the rewritten lesson UI
  contract while carrying a richer lesson vocabulary list that the current UI can
  ignore until the runtime model grows into it.
- Passed: `pnpm check` after rewriting `src/lib/data/thai.ts`, resetting the local
  progress snapshot version, and adding tone-mark support to the alphabet page.
