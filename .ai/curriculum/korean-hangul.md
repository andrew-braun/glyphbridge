# Korean Hangul Curriculum

- Start date: 2026-05-20
- Owner: GitHub Copilot
- Status: bootstrap-complete

## Goal

Track the Korean Hangul pilot bootstrap, including the standards-based course
boundary, the first authoring steps, and the open questions that should be
resolved before lesson drafting begins.

## Authority

- This is the authoritative `.ai` tracker for Korean Hangul curriculum bootstrap
  work.
- Use this file as the central status location for Korean Hangul authoring
  progress and next steps.
- Keep active task tracking in `.ai/curriculum/`, but publish durable bootstrap
  outputs that should outlive the tracking cycle into `../../docs/curriculum/`.
- Keep reusable multi-script pedagogy and pipeline rules in
  `../../docs/curriculum/authoring-framework.md`.
- Keep CLI workflow, scaffold behavior, and candidate-scoring instructions in
  `../../docs/curriculum/authoring-tools.md`.
- Keep exact DB schema and delivery-contract truth in
  `../../docs/database-dto-spec.md`.

## Current Summary

- Korean Hangul is the next recommended post-Thai pilot because it has strong
  learner demand, good tooling availability, and a manageable script boundary.
- The pilot is explicitly Hangul-only for now: Hanja is out of scope.
- The standards-based identifiers are `ko-Hang` for the language tag and `Hang`
  for the ISO 15924 script code.
- The immediate objective is not lesson authoring yet; it is a validated
  manifest, starter source inventory, first grapheme inventory, scored anchor
  candidates, review packet, and DB handoff notes.
- The tracker for that work stays here in `.ai/curriculum/`; any durable course
  notes and bootstrap artifacts belong in
  `../../docs/curriculum/korean-hangul-v1/`.

## Standard Identifiers

| Field        | Value              | Why                                                                 |
| ------------ | ------------------ | ------------------------------------------------------------------- |
| Course ID    | `korean-hangul-v1` | Stable project slug for the Hangul-only pilot.                      |
| Display name | `Korean Hangul`    | Human-readable course name.                                         |
| Language tag | `ko-Hang`          | BCP 47 language plus ISO 15924 script for Korean written in Hangul. |
| Script code  | `Hang`             | ISO 15924 code for Hangul.                                          |
| Direction    | `ltr`              | Modern Hangul text is left-to-right for this course boundary.       |

Do not use `ko-KR` unless the course is intentionally scoped to South Korean
regional usage. Do not use `Kore` unless Hanja enters scope, because `Kore` is a
broader Korean-script boundary than this pilot.

## Bootstrap Command

Run the scaffold from the repo root:

```sh
pnpm curriculum:scaffold korean-hangul-v1 --name "Korean Hangul" --language-tag ko-Hang --script Hang
```

This creates the working files under `.ai/curriculum/korean-hangul-v1/`, a
course tracker at `.ai/curriculum/korean-hangul-v1.md`, and the durable
bootstrap workspace under `../../docs/curriculum/korean-hangul-v1/`.

## First Pass Scope

- Target learner: English-speaking beginner who wants fast recognition of modern
  Korean words in menus, signage, media, and product labels.
- Target domains: food and cafe menus, transit and place signs, everyday labels,
  and high-visibility media or culture terms.
- In scope: modern printed Hangul syllables, jamo concepts needed to explain
  syllable blocks, and only the sound-change rules that materially help decoding.
- Out of scope: Hanja, handwriting, calligraphy, full grammar, honorific systems,
  dialect comparison, historical spelling, North/South orthographic comparison,
  and production or conversation practice.

## Current Source Hierarchy

1. `../../docs/curriculum/authoring-framework.md` — canonical cross-script
   curriculum workflow, validation gates, and artifact definitions.
1. `../../docs/curriculum/authoring-tools.md` — canonical CLI and authoring
   workflow reference for scaffold, validate, score, and review commands.
1. `.ai/curriculum/korean-hangul.md` — current Korean Hangul bootstrap scope,
   identifiers, and next steps.
1. Durable bootstrap outputs under `../../docs/curriculum/korean-hangul-v1/` —
   manifest, sources, candidate CSVs, review packet, DB strategy, and course
   notes that will inform future seeding.
1. `../../docs/database-dto-spec.md` — canonical DB mapping target once
   curriculum data is ready for ingestion.

## Bootstrap Steps (completed 2026-05-20)

1. [x] Ran the scaffold command.
2. [x] Edited manifest with Korean-specific `target_domains`, NFC normalization,
       whitespace + algorithmic jamo decomposition segmentation, and 5 real sources.
3. [x] Filled `sources.csv` with sejong-corpus, subtlex-ko, wiktionary-ko,
       open-korean-text, and namuwiki — all `discovery_only` or `scoring_only`
       pending license review.
4. [x] Entered 40 pedagogical jamo rows in `grapheme-candidates.csv` with manual
       score estimates.
5. [x] Entered 30 anchor candidates in `anchor-candidates.csv` spanning all four
       target domains.
6. [x] Ran validate (0 errors), score, and review — `.scored.csv` files and
       `review-packet.md` are all generated.
7. Review of `db-ingestion-strategy.md` is pending (no seed work started yet).

## Ongoing Authoring Tracker

Active status, score summaries, and next steps live in the scaffolded tracker:
`.ai/curriculum/korean-hangul-v1.md`

The durable bootstrap product lives in `../../docs/curriculum/korean-hangul-v1/`.

## Hangul-Specific Authoring Notes

- Score pedagogical units, not every Unicode code point.
- Treat syllable-block structure as a reusable rule layer rather than thousands
  of separate taught units.
- Start with basic consonant and vowel jamo, then introduce final consonant and
  compound-vowel behavior only when the anchors require them.
- Keep actual learner-visible vocabulary in normal Unicode Korean text even if
  the pedagogy introduces jamo-level concepts.
- Avoid copying learner-facing examples from external sources until licensing is
  reviewed for shipped content.

## Open Questions

- Which open or reviewable sources are strong enough to drive first-pass Korean
  anchor scoring?
- Which jamo and syllable-block rules should appear in the first five lessons?
- Does the current DB modeling need an explicit pedagogical layer for jamo versus
  rendered syllable blocks, or is existing grapheme-plus-rule modeling enough?
- What expert Korean review is needed before learner-facing copy is written?

## Done Criteria For Bootstrap

- The scaffolded manifest validates.
- Source entries include license status and intended use.
- Grapheme and anchor candidate CSVs contain enough scored rows to inspect the
  first lesson arc.
- The review packet has explicit reviewer questions.
- The DB ingestion strategy records the Hangul-specific modeling decisions still
  needed.
- This tracker links to all generated artifacts and keeps the current blockers
  visible.
