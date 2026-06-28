# Task: Thai Full-Alphabet Curriculum Research Pass

- Start date: 2026-06-27
- Owner: Claude
- Status: in progress

## Goal

Move the full Thai script from "deferred" to "in scope" for the Thai reading
curriculum. This task covers the **research pass only**: score the complete
remaining Thai grapheme inventory frequency-first, and draft an extended,
frequency-ordered lesson sequence that puts the most common/useful units next
and groups rare, redundant, and obsolete units near the end.

Full lesson authoring in `src/lib/data/thai.ts`, anchor scoring for new lessons,
and DB publication are explicit follow-ups, not part of this pass.

This task is **separate** from the in-flight per-lesson practice-vocabulary
expansion tracked in `.ai/2026-06-13-practice-vocabulary-expansion.md`.

## Scope

- In scope:
  - Extend `docs/curriculum/thai-reading-v1/grapheme-candidates.csv` with every
    remaining Thai consonant, vowel form, tone mark, special mark, numeral set,
    and the key compound-vowel and cluster reading patterns.
  - Regenerate `grapheme-candidates.scored.csv` with `pnpm curriculum:score`.
  - Draft Stage 6+ of `lesson-sequence.md` in frequency-first order.
  - Update durable scope notes (`thai-reading-v1.md`, `questions.md`) and the
    `.ai` trackers to reflect full-alphabet scope.
- Out of scope (follow-ups):
  - Authoring the new lessons in `src/lib/data/thai.ts`.
  - Anchor candidate scoring for the new lessons.
  - DB ingestion / publication of the expanded course.
  - Per-lesson practice vocabulary expansion (separate task).

## Method

- Scoring uses the existing rubric in `scripts/curriculum-authoring-tools.mjs`:
  - grapheme weights: corpus_frequency 0.30, distinct_word_coverage 0.20,
    domain_coverage_gain 0.15, anchor_availability 0.10,
    pronunciation_clarity 0.10, rule_gateway_value 0.10,
    visual_distinctiveness 0.05; minus confusability/load/irregularity/font/
    license penalties.
  - bands: >= 0.75 strong, >= 0.50 promising, < 0.50 weak.
- Frequency-first: the already-shipped 24 units captured the highest-payoff
  graphemes, so every new unit scores at or below them. New common consonants
  and core vowels land "promising"; redundant Sanskrit/Pali letters and
  obsolete letters land "weak". The score band is therefore a direct
  sequencing signal: strong/high-promising first, weak last.

## Scope Decisions (defaults taken, flagged for review)

- Obsolete consonants `ฃ` and `ฅ` are included as **recognition-only** units at
  the very end, not as taught lessons. They no longer occur in modern text but
  learners may meet them in historical material.
- Obsolete vocalics `ฦ` / `ฦๅ` and the archaic length mark `ๅ` are inventoried
  as recognition-only / weak; likely never taught as lessons.
- Thai numerals `๐-๙` are grouped into one unit (price/sign reading payoff).
- Redundant phonemes (multiple graphemes -> one sound: e.g. `ศ ษ` -> s,
  `ฐ ฑ ฒ ถ ท ธ` -> th, `ณ` -> n, `ญ` -> y, `ฆ` -> kh) are grouped into
  "same sound, rarer glyph" recognition lessons late in the sequence, as the
  user approved.
- Compound vowels (`เ-า`, `เ-ีย`, `เ-ือ`, `ัว`, `เ-อ`, short pairs) are
  inventoried as distinct reading patterns because each is a new scanning rule,
  even though they reuse already-taught signs.

## Progress

- [x] Discovery: confirmed scoring tool, current 24-unit inventory, docs layout
- [x] Full remaining grapheme inventory added to raw candidates CSV (92 units)
- [x] Scored CSV regenerated and band-sanity checked
- [x] Extended frequency-first lesson sequence drafted (Stages 6-14, Lessons 14-46)
- [x] Scope notes + trackers updated
- [x] Corpus review applied (2026-06-27): frequencies recalibrated and re-scored
- [x] Stage 6 anchors scored (2026-06-28) into `anchor-candidates.scored.csv`
- [ ] Native-speaker review of glosses/anchors and final-coda calls (follow-up)
- [ ] Decide Lesson 14 cadence: keep dense or split the aw-vowel beat (follow-up)
- [ ] Score Stage 7+ anchors (follow-up)

## Result Summary

- Raw inventory grew from 28 to 92 grapheme/unit rows; rescored with
  `pnpm curriculum:score`. Ranking is cleanly frequency-first: shipped
  high-frequency units on top, new common consonants/vowels in the promising
  band, redundant Sanskrit/Pali and obsolete glyphs in the weak tail.
- Proposed sequence: Stages 6-14 (Lessons 14-46) in `lesson-sequence.md`, with
  redundant phonemes grouped as "same sound, rarer glyph" recognition lessons
  and obsolete glyphs in an optional recognition-only Stage 14.
- All anchors in Stages 6+ are provisional pending the anchor-scoring follow-up.

## Corpus Review (2026-06-27)

A frequency review was run against the 2023 modern-written-Thai character corpus
(grapheme %) and Munthuli et al. (phoneme frequency). Sources logged in
`sources.csv` as scoring-only pending license review. The first-pass scores were
LLM intuition; the review found the ordering pedagogically plausible but not
frequency-faithful in the top third. Applied corrections (via
`corpus_frequency` / `distinct_word_coverage` inputs, not by hand-sorting):

- Moved up to match grapheme-corpus rank: `ร`, `อ`, `เ`, `่`, `้`, `ย`, `ว`;
  also reduced over-large load/irregularity penalties on `อ`, `่`, `้`, `เ` that
  were suppressing genuinely frequent units.
- Moved down toward corpus rank: `ม`, `ด`, `ะ`, `ิ`, `ต`, `โ`, `ู`, `ุ`.
- Final-coda roles reordered per phoneme data: `final ง` and `final ย ว` now
  outrank `final ก` (final ŋ/j/t are more frequent than final k); `final ก` is
  still taught first as the final-stop gateway.
- Recognition tier: `ศ`, `ณ`, `ษ` raised above the genuinely rare
  `ฐ ฑ ฒ ฎ ฏ ฆ ฬ ฌ` group; `์` raised into the promising band (it is more
  frequent in running text than several easier consonants) and moved to Stage 9.

Resulting top tier is now close to the corpus-first order
(า, น, ก, ม, ร, ง, ั, เ, ล, ่, ้, ี, อ, ด, ะ, ...). Remaining divergences are
intentional and penalty-driven (e.g. `ม` stays top-4 on anchor/pronunciation
value; `ย` sits just below its raw rank due to glide dual-role load).

Recalibration applied with `scratchpad/recalibrate.mjs` then re-scored with
`pnpm curriculum:score`. Numerals and `ๆ` remain in the weak band, consistent
with the review noting their low raw character count.

## Stage 6 Anchor Scoring (2026-06-28)

Ran the 8 provisional Stage 6 anchors through `pnpm curriculum:score` against the
anchor rubric (weighted_word_frequency .22, real_world_utility .18, coverage_gain
.16, decodability .14, rule_payoff .10, pronunciation_clarity .08, review_value
.06, memorability .04, source_confidence .02; minus load/irregularity/ambiguity/
sensitivity/license penalties). All eight land in the promising band and
interleave naturally with the shipped anchors:

- `ทาง` 0.678, `โต` 0.670, `ปิด` 0.670, `ยา` 0.656, `จะ` 0.654, `เกม` 0.650,
  `ไก่` 0.602, `ของ` 0.532.
- New anchors carry `source_confidence` 0.70–0.72 (vs 0.90 shipped) to reflect
  that they are proposed, not yet native-reviewed.
- `ของ` is the lowest and sits just above the weak line because Lesson 14 stacks
  three new ideas (`ง` + final `ง` + `อ`-as-aw vowel). The score working as a
  cadence signal, not a reason to drop the anchor — `ของ` is one of the highest
  frequency words in Thai. Captured as a follow-up decision (keep dense vs split).

No anchor scored below the shipped floor in a way that flags a bad choice, so the
Stage 6 anchors are validated for authoring pending the native-speaker pass.

## Follow-Ups

- Author the new lessons in `src/lib/data/thai.ts` in scored order.
- Score anchors for each new lesson into `anchor-candidates.csv`.
- Have a Thai speaker review first-pass frequency intuition before any scores
  are treated as final shipped sequencing.
- Decide final lesson-count boundary and whether to ship as `thai-reading-v2`.
