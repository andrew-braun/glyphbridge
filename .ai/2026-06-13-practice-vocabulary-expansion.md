# Task: Practice Vocabulary Expansion

- Start date: 2026-06-13
- Owner: Codex
- Status: in progress

## Goal

Shift Glyphin lessons from one anchor plus a tiny support-word sample to a
practice-first model: each lesson should teach one anchor word and then give
learners at least ten fresh, decodable practice words or short phrases before
scored drills. Later lessons will also include an optional extension set.

## Scope

- In scope:
  - Define the curriculum contract for anchor, core practice, and extension
    practice vocabulary.
  - Plan changes to Thai lesson authoring artifacts, runtime TypeScript data,
    delivery DTO mapping, and database publication.
  - Plan a rework of Lesson 1 so practice targets are not revealed before the
    learner has tried to decode them.
  - Identify validation rules that prevent future courses from regressing to
    too little practice.
- Out of scope:
  - Shipping the full vocabulary expansion in this planning pass.
  - Changing authentication, learner sync, or production deployment behavior.
  - Treating low-confidence or sensitive Thai items as final without review.

## Current Findings

- `src/lib/data/types.ts` already has `Lesson.vocabulary`, but it only supports
  `role: "anchor" | "support"` and no explicit practice tier.
- `src/lib/data/thai.ts` currently gives every Thai lesson exactly two support
  words through `supportingVocabularyByLessonId`.
- `src/lib/components/lesson/StepSameLettersNewWords.svelte` already has the
  right reveal pattern for transfer practice: the learner sees the word first,
  then checks pronunciation and meaning.
- `src/routes/learn/[id]/+page.svelte` inserts the transfer step only when
  support vocabulary exists.
- `src/lib/server/delivery-payload.ts` maps published DB vocabulary, but it
  currently accepts only `anchor` and `support` role keys.
- The database is already ahead of runtime: `curriculum.vocabulary_items`,
  `curriculum.vocabulary_segments`, and `curriculum.lesson_vocabulary` exist,
  and `lesson_vocabulary.role_key` is text rather than an enum. The DB can carry
  richer roles without a schema change.
- `docs/database-dto-spec.md` already describes `lesson_vocabulary` as supporting
  anchor, taught, review, and extension vocabulary, but the runtime and Thai
  docs have not caught up.

## Implementation Update

- Updated `src/lib/data/types.ts` so lesson vocabulary now carries
  `tier: "core" | "extension"` and `sourceType: "real" | "phrase" | "nonsense"`.
- Reworked `src/routes/learn/[id]/+page.svelte` and
  `src/lib/components/lesson/StepSameLettersNewWords.svelte` so the lesson flow
  distinguishes core practice from optional extension practice and lets the
  learner skip extension before drills.
- Updated `src/lib/components/lesson/StepComplete.svelte` to summarize practice
  reads instead of the older support-word concept.
- Expanded Thai Lesson 1 in `src/lib/data/thai.ts` to `10` core practice
  targets, including tagged phrase and nonsense items.
- Added the implied-short-o rule to Lesson 1 and audited rule examples so
  current lessons no longer reveal their own practice targets before the
  transfer step.
- Updated `src/lib/stores/progress.ts` so nonsense targets do not enter
  `knownWords`, while anchors and lexical practice items do.
- Updated `src/lib/server/delivery-payload.ts`,
  `scripts/generate-thai-seed.mjs`, and `supabase/seed.sql` so publication and
  seed data now use `anchor`, `practice_core`, and `practice_extension` role
  keys plus `sourceType` metadata.
- Updated durable docs to describe the new practice-first lesson contract and
  the required later-lesson extension set.

## Target Curriculum Contract

- Every lesson keeps exactly one featured anchor.
- Every standard lesson should have at least ten core practice targets that are
  decodable from prior lessons plus the current lesson's new graphemes and
  rules.
- Later lessons will include an optional extension set after the core set.
  The extension set can scale with available vocabulary, but it is part of the
  intended lesson shape rather than a maybe-later bonus.
- Practice targets may be standalone words, high-frequency compounds, or short
  phrases.
- Nonsense words are explicitly allowed as a pressure-release valve when the real
  word and phrase pool is too small. A nonsense word is a pronounceable grapheme
  combination that maps to a possible sound in the target language but has no
  lexical meaning.
- Nonsense targets must be clearly tagged so they do not pollute learned-word
  lists as ordinary vocabulary.
- Practice targets should be hidden from pre-practice lesson copy, rule examples,
  drill prompts, and answer options unless the learner has already attempted
  them in the transfer step.
- Rule examples should use the anchor, non-target examples, or already completed
  vocabulary. They should not accidentally reveal upcoming core practice words.

## Thai Lesson 1 Draft Inventory

Lesson 1 anchor remains:

- `มาก` — very / a lot

Candidate core practice set from known graphemes `ม`, `า`, `ก`:

- `มา` — to come
- `กา` — crow; also kettle/teapot or to mark/check
- `กาม` — sensuality
- `กาก` — residue, dregs; casual "trash/useless" slang
- `กก` — reeds; also to cuddle/incubate
- `กากมาก` — very bad / really trashy, casual
- `มามาก` — comes a lot / heavy flow, gloss should stay neutral
- `กามา` — sensuality or sensual matters, formal/poetic register
- review-needed slot 9: real phrase preferred; nonsense target acceptable if
  tagged
- review-needed slot 10: real phrase preferred; nonsense target acceptable if
  tagged

Sensitive-language guidance:

- Prefer toned-down glosses such as "sensuality" over explicit sexual phrasing.
- Avoid unnecessary body-product context for `มามาก`; keep the learner-facing
  note neutral.
- Label `กากมาก` as casual and potentially rude so it is useful without being
  normalized as polite speech.

## Step-By-Step Strategy

### 1. Establish The Durable Authoring Rule

- Update `docs/curriculum/authoring-framework.md` so "support word" evolves into
  a practice vocabulary model:
  - anchor: one featured lesson word;
  - core practice: minimum ten read-before-reveal targets;
  - optional extension: required for later lessons, with size based on available
    decodable vocabulary;
  - nonsense target: pronounceable but meaning-free decoding practice, allowed
    only when marked and reviewed.
- Update `docs/curriculum/authoring-tools.md` to make lesson sequences and
  review packets report practice counts.
- Update `docs/curriculum/thai-reading-v1/lesson-sequence.md` so every row has a
  practice-vocabulary count target, not only "drill focus."
- Update `docs/curriculum/thai-reading-v1/db-ingestion-strategy.md` to state
  that Thai ingestion must populate all anchor, core practice, extension
  practice, nonsense/review metadata, and later-lesson extension sets before
  publication.

### 2. Update The Data Contract

- Extend `LessonVocabularyEntry` in `src/lib/data/types.ts` to distinguish
  practice role and tier. Recommended shape:
  - `role: "anchor" | "practice"`;
  - `tier: "core" | "extension"` for practice entries;
  - `sourceType: "real" | "phrase" | "nonsense"`;
  - `drillTarget: boolean`.
- Keep `anchorWord` for the current page contract, but ensure the anchor is also
  present in vocabulary when publication data is generated.
- Decide whether learned-word collection should include nonsense targets. The
  conservative default is no: nonsense targets should train decoding, not
  become saved vocabulary.

### 3. Align Delivery DTOs And Database Publication

- Update `docs/database-dto-spec.md` role-key examples to match the runtime
  contract: `anchor`, `practice_core`, `practice_extension`, and optionally
  `review`.
- Update `src/lib/server/delivery-payload.ts` so published payloads accept the
  new role keys and map them into runtime `LessonVocabularyEntry` values.
- Keep the DB schema unless implementation proves we need constraints; current
  `lesson_vocabulary.role_key text` and `metadata jsonb` are flexible enough.
- Store source/type metadata in `lesson_vocabulary.metadata` or
  `vocabulary_items.metadata` for nonsense/sensitive/register notes.
- Add publication smoke checks that fail when a lesson has fewer than ten core
  practice targets, except for explicitly approved early-lesson exceptions.

### 4. Rework Static Thai Runtime Content

- Replace `supportingVocabularyByLessonId` with a practice vocabulary structure
  that can hold core and extension targets.
- Expand Lesson 1 first using the reviewed candidate pool above.
- Expand Lessons 2-13 by allowing each lesson to reuse all previously taught
  graphemes plus current graphemes. This keeps new lessons feeling cumulative
  and makes later practice pools much easier to fill.
- For later lessons, target:
  - one anchor;
  - ten core practice targets;
  - a skippable extension set, ideally ten more targets when quality is high
    enough.
- Keep transliteration, tone marking, segmentation, and context notes consistent
  with existing Thai lesson voice.

### 5. Prevent Practice Spoilers In The Lesson Flow

- Audit Lesson 1 before editing:
  - `rulesIntroduced[].examples`;
  - `drills[].prompt`;
  - `drills[].options`;
  - intro/breakdown/letters copy.
- Remove unrevealed practice targets from rule examples and drill options before
  the transfer step. For Lesson 1, `กา` currently appears in rule examples and
  `กาม` appears in a spot drill option; those should move out of pre-practice
  exposure if they become core practice targets.
- Keep the anchor visible throughout the lesson; it is the taught object, not a
  spoiler.
- After the practice step, drills may refer to already attempted practice words,
  but they should still test a fair, deterministic skill.

### 6. Upgrade The Transfer Practice UI For Larger Sets

- Keep the existing read-before-reveal interaction.
- Add pacing for 10-20 targets:
  - core/extension progress labels;
  - "continue core practice" and "extension practice" transitions;
  - compact completion summary;
  - no long scrolling list that reveals answers prematurely.
- Let learners skip optional extension practice after the ten core targets.
- Preserve mobile ergonomics: one target at a time, stable button sizing, and no
  dense table of hidden answers.

### 7. Update Drills Around The New Vocabulary Model

- Keep scored drills short enough to finish, but source choices from practice
  targets that have already been attempted.
- Add drill authoring guidance:
  - match drills can use anchor and attempted practice targets;
  - spot drills should avoid using unseen core targets as distractors;
  - sound drills should prefer grapheme/rule transfer, not pure memorization.
- Add validation that any drill option matching a lesson's core practice target
  is not shown before that target is attempted in the flow.

### 8. Validate And Review

- Run static checks after implementation: `pnpm check`.
- Run `pnpm check:all` if SCSS, formatting, or lint-sensitive UI files change.
- Run `pnpm build` if delivery payloads, route data, or publication behavior
  changes.
- Manually walk Lesson 1 in `pnpm dev` to confirm:
  - practice words are not revealed early;
  - the transfer step shows at least ten core targets;
  - sensitive glosses are appropriately toned;
  - completion and known-word collection behave as intended.
- Have Thai content reviewed before treating low-frequency, slang, sensitive, or
  nonsense targets as final shipped content.

## Implementation Order

1. Documentation and authoring-contract updates.
2. Runtime type update and mapper update.
3. Lesson 1 static data expansion plus spoiler audit.
4. Transfer-step UI pacing for ten-plus targets.
5. Thai Lessons 2-13 expansion.
6. DB/DTO spec and publication smoke-check updates.
7. Validation and manual lesson review.

## Progress

- [x] Discovery and research
- [x] Planning artifact created
- [x] Documentation updates
- [x] Runtime data/model implementation
- [x] Database/DTO publication alignment
- [x] Thai Lesson 1 rework
- [ ] Full Thai practice vocabulary expansion
- [x] Validation

## Open Questions

- What should the two remaining Lesson 1 practice targets be after Thai review?
- Should nonsense targets ever be stored in `knownWords`, or should they only
  count as decoding practice?
- Should optional extension practice be skippable by default, or only after a
  learner has demonstrated high accuracy?
- Do we want a hard validator that blocks every published lesson below ten core
  practice targets, or a warning with explicit exceptions for early lessons?

## Validation Notes

- `git diff --check` passed for the touched files.
- Focused `eslint` and `stylelint` checks on touched source files passed.
- `node scripts/generate-thai-seed.mjs > supabase/seed.sql` succeeded.
- A direct lesson-data overlap audit confirmed that current rule examples no
  longer exactly match current lesson practice targets before the transfer step.
- `pnpm publication:generate` failed because the script needs a reachable
  delivery publication source and none is configured in this sandbox.
- `pnpm db:smoke:delivery` failed because `PUBLIC_SUPABASE_URL` and
  `PUBLIC_SUPABASE_ANON_KEY` are not configured here.
- `pnpm check` is still blocked by a pre-existing repo issue: missing Node type
  definitions referenced by `src/lib/server/published-lessons.ts` and
  `tsconfig.json`.
- Repo-wide `markdownlint` is still blocked by long-standing hard-tab violations
  in `docs/database-dto-spec.md` outside the lines changed for this task.

## Follow-Up

- Update `.ai/curriculum/thai-reading-v1.md` as the Thai-specific tracker for
  the expansion.
- Consider adding a reusable curriculum lint command once the first expanded
  lesson lands.
