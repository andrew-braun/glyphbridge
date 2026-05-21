# Greek Reading Questions

Use this file for unresolved decisions that research cannot safely settle during
the `greek-reading-v1` bootstrap.

## Architecture

- How should the runtime lesson model represent a pedagogical unit that may be a
  single code point, a precomposed accented character, or a multi-character
  digraph such as `ει` or `ου`?
- Should final sigma be modeled as its own grapheme row, as variant metadata on
  sigma, or as an orthographic rule with display examples?
- Where should case-pair information live so uppercase environmental print can
  be taught without duplicating every lowercase grapheme?

## Product And Pedagogy

- Should Greek v1 choose an explicit romanization standard such as ISO 843, or
  avoid formal romanization and use plain English pronunciation hints?
- Should beta and other Latin/Cyrillic confusables get a dedicated contrast
  drill type, or can the existing multiple-choice drill pattern carry that work?
- How much Ancient Greek awareness should be mentioned, if any, for learners who
  arrive with classical pronunciation expectations?

## Sources, Licensing, And Attribution

- Confirm the license and attribution obligations for CLDR metadata before
  ingesting exemplar character data into durable curriculum records.
- Keep Greek Wiktionary discovery-only until CC BY-SA attribution and
  share-alike implications are reviewed for compiled app content.
- Keep OpenStreetMap name samples scoring-only until ODbL derived-data
  obligations are reviewed.
- Prefer app-authored menu, sign, and label examples for shipped content.

## Reviewers And Validation

- Assign a Modern Greek speaker to validate anchor naturalness, stress marks,
  glosses, and pronunciation notes.
- Spot-check real signage or menu samples from Greece to confirm the first 12
  anchors match visible environmental print.
- Verify fonts used by GlyphBridge render tonos, final sigma, and common Greek
  lowercase forms clearly at drill sizes.

## App Expansion Recommendations

- Add script-aware text fields before implementation so runtime data does not
  rely on Thai-specific names such as `thai`.
- Add per-course script styling or script class metadata instead of hardcoded
  Thai detection.
- Add metadata conventions for positional variants, case pairs, digraph units,
  and stress marks.
- Add course-aware progress storage before Greek and Thai can coexist in learner
  state.
