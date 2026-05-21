# Task: Bulk Writing-System Bootstraps

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: in progress

## Goal

Bootstrap every writing system in the data-readiness ranking with bootstrap
difficulty of `High` or easier into a review-ready curriculum outline.

The output should follow the authoring framework, reuse the existing Korean
Hangul bootstrap as the reference packet, and record app or schema gaps before
runtime implementation begins.

## Scope

- In scope:
  - Use the `Ranking By Available Data` table in
    `docs/curriculum/writing-systems-catalog.md` as the candidate source of
    truth.
  - Cover ranks 1-61, from `Very low` through `High`.
  - Skip Hangul as already bootstrapped, while using
    `docs/curriculum/korean-hangul-v1/` as the quality reference.
  - Backfill Thai into the same authoring-artifact shape because the runtime
    course exists but no full `docs/curriculum/<course-id>/` packet exists yet.
  - Create one representative implementable v1 course for bundled rows unless a
    row explicitly needs an umbrella/question-only pass.
  - Create per-course `questions.md` files for architecture, product, source,
    reviewer, or licensing decisions that research cannot resolve safely.
- Out of scope:
  - Publishing runtime lessons.
  - Writing Supabase migrations or seed data.
  - Calling external services, downloading corpora, OCR, or model APIs.
  - Final legal, cultural, pronunciation, or native-speaker signoff.

## Ready-To-Implement Definition

Each completed course packet should include:

- `manifest.json`
- `sources.csv`
- `grapheme-candidates.csv` and `grapheme-candidates.scored.csv`
- `anchor-candidates.csv` and `anchor-candidates.scored.csv`
- `lesson-sequence.md`
- `review-packet.md`
- `db-ingestion-strategy.md`
- `<course-id>.md`
- `questions.md` when unresolved decisions remain

This is a review-ready curriculum outline, not finished learner-facing lesson
copy.

## Implementation Waves

### Pilot Calibration

- [ ] `thai-reading-v1`
- [x] `greek-reading-v1` draft packet
- [ ] `arabic-reading-v1`
- [ ] `han-chinese-v1`
- [ ] `braille-v1` or `morse-signaling-v1`

### Wave A: Lowest Data Risk

- [ ] Latin extensions and diacritics
- [ ] International Phonetic Alphabet
- [x] Hangul: already bootstrapped at `docs/curriculum/korean-hangul-v1/`
- [ ] Greek
- [ ] Cyrillic
- [ ] Japanese writing system
- [ ] Han characters for Chinese

### Wave B: Medium Risk

- [ ] Arabic script
- [ ] Devanagari
- [ ] Hebrew
- [ ] Thai
- [ ] Bopomofo
- [ ] Bengali-Assamese
- [ ] Tamil
- [ ] Gurmukhi
- [ ] Telugu
- [ ] Kannada
- [ ] Malayalam
- [ ] Gujarati
- [ ] Odia
- [ ] Ethiopic
- [ ] Braille
- [ ] Morse code and signaling systems
- [ ] Armenian
- [ ] Georgian
- [ ] Coptic

### Wave C: Medium-High Risk

- [ ] Tibetan
- [ ] Khmer
- [ ] Lao
- [ ] Myanmar
- [ ] Sinhala
- [ ] Egyptian hieroglyphs
- [ ] Runic scripts
- [ ] Phoenician
- [ ] Ogham
- [ ] Linear B

### Wave D: High Risk

- [ ] Cuneiform
- [ ] Maya hieroglyphs
- [ ] Old Persian cuneiform
- [ ] Ugaritic
- [ ] Old Italic family
- [ ] Glagolitic
- [ ] Gothic
- [ ] Brahmi
- [ ] Syriac
- [ ] Mongolian
- [ ] Tifinagh
- [ ] Javanese
- [ ] Balinese
- [ ] Baybayin or Tagalog script
- [ ] Cherokee
- [ ] Canadian Aboriginal syllabics
- [ ] Adlam
- [ ] N'Ko
- [ ] Shavian
- [ ] Deseret alphabet
- [ ] Sitelen Pona
- [ ] Vai
- [ ] Bamum
- [ ] Thaana
- [ ] Meitei Mayek

## Plan

- [x] Confirm candidate scope and autonomous defaults.
- [ ] Harden authoring tools for repeatable bulk bootstrapping.
- [ ] Document the expanded artifact contract.
- [x] Create a central app-expansion matrix.
- [ ] Run the pilot calibration packet set.
- [ ] Revise templates and scoring conventions after pilot review.
- [ ] Run Waves A-D.
- [ ] Final validation and consolidation.

## Subagent Pattern

For each pilot or wave course, launch read-only research subagents with separate
responsibilities:

- source and license scouting;
- script inventory, Unicode, normalization, rendering, and segmentation;
- pedagogy, anchors, candidate sequence, and target-domain fit;
- app, DB, and runtime implementation gaps.

The main agent owns artifact writing, validation, and tracker updates.

## Validation

- Tooling changes: run `pnpm check`.
- Formatting, lint, alias, or style changes: run `pnpm check:all`.
- Per course: run
  `pnpm curriculum:validate docs/curriculum/<course-id>/manifest.json`.
- Per course: run `pnpm curriculum:score` for both candidate CSVs.
- Per course: run
  `pnpm curriculum:review docs/curriculum/<course-id> --force`.
- Per wave: spot-check at least one packet from each structural family.

## Decisions

- Decision: Use the data-readiness ranking, not the popularity ranking.
  Reason: The user referenced difficulty `High` or below and rank 61, which maps
  to Meitei Mayek in the data-readiness table.
- Decision: Skip Hangul as already bootstrapped.
  Reason: `docs/curriculum/korean-hangul-v1/` already contains the reference
  packet.
- Decision: Backfill Thai into the authoring-tool packet format.
  Reason: Thai has runtime lessons and docs, but not a full bootstrap folder
  matching the new course-authoring contract.
- Decision: Default to one representative v1 per bundled row.
  Reason: Splitting every row into all possible language variants would expand
  this task far beyond the ranked 61 candidates.

## Progress

- [x] Planning discovery completed.
- [x] Master tracker created.
- [x] Authoring tool hardening completed for the pilot slice.
- [x] Greek pilot packet drafted.
- [x] Central app-expansion matrix created.
- [x] Greek pilot manifest validated, candidates scored, and review packet
      generated.

## Open Questions

- None blocking the infrastructure slice. Course-specific questions should live
  in each course folder as `questions.md`.

## Follow-Up

- Runtime implementation should be split into separate tasks after the app-gap
  matrix exposes repeated needs across multiple courses.
