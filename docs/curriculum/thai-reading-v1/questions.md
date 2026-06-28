# Thai Reading Questions

Use this file for unresolved decisions that research cannot safely settle during
the `thai-reading-v1` bootstrap.

## Architecture

- How should the DB model represent Thai pedagogical units that are not simple
  Unicode grapheme clusters, such as final-consonant roles, leading-H chunks,
  tone-marked syllables, and silent carrier behavior?
- Should the already shipped runtime course map to a new `thai-reading-v1` course
  ID, or should publication preserve the current runtime `thai` pack identity as
  a compatibility alias?
- How should current Thai-specific fields such as `thai` in runtime lesson data
  be generalized before this packet becomes multi-course DB seed data?
- Should authored Thai word segmentation remain manual for v1, or should a
  reviewed PyThaiNLP pass become part of publication QA?

## Resolved

- Full-alphabet coverage is now in scope (decision 2026-06-27). The remaining
  Thai inventory has been scored frequency-first in
  `grapheme-candidates.scored.csv`, and a proposed Stage 6+ sequence is drafted
  in `lesson-sequence.md`. Tracking: `.ai/archive/2026-06-27-thai-full-alphabet-research.md`.
- Redundant phonemes (multiple glyphs -> one sound) and obsolete glyphs are
  grouped into late "same sound, rarer glyph" recognition lessons rather than
  given individual high-effort lessons.

## Product And Pedagogy

- The first-pass expansion scores are LLM frequency intuition only and need a
  Thai-speaker / corpus review before they are treated as a final sequence.
- Should the full-alphabet expansion ship as a continuation of `thai-reading-v1`
  or as a new `thai-reading-v2` course boundary?
- Should obsolete glyphs (`ฃ ฅ ฦ ฦๅ`) and archaic marks ship as an optional
  recognition-only appendix lesson, or be dropped from the taught path entirely?
- Anchors for Stages 6+ are provisional and still need the anchor-candidate
  scoring pass before lesson authoring.
- How much of the formal tone-class matrix belongs in v1 versus later review?
- Should tone marks be assessed as pronunciation, visual recognition, or both?
- Should clusters such as `ตล` in `ตลาด` and leading `ห` be taught with one
  shared cluster mechanic or separate script-specific rule cards?
- Should `ร้านอาหาร`, `ออก`, and `ผัก` become first-class anchors when Thai is
  reauthored for DB delivery, or remain lesson practice targets around current
  anchors?

## Sources, Licensing, And Attribution

- Keep external Thai frequency and lexicon sources out of shipped content until
  license and attribution obligations are reviewed.
- Confirm exact Unicode and CLDR license notices required if metadata is copied
  into durable course records.
- Verify whether any current runtime context note was influenced by third-party
  material before treating it as app-authored shipped content.

## Reviewers And Validation

- Assign a Thai speaker to validate tone marks, romanization, glosses, food
  vocabulary, and register.
- Spot-check menus, storefronts, market price signs, transit labels, and public
  facility signs against the current 13-lesson coverage.
- Verify fonts render Thai above and below marks clearly at lesson and drill
  sizes on mobile and desktop.

## App Expansion Recommendations

- Add language-agnostic runtime text fields before publishing non-Thai courses.
- Add course-aware progress storage so the existing Thai course can coexist with
  future script courses.
- Add metadata for vowel position, tone marks, final consonant sound roles,
  leading clusters, and silent carriers.
- Add Thai syllable or word segmentation boundaries to the DB seed pipeline
  rather than relying on UI-only syllable arrays.
