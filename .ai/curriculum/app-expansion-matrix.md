# App Expansion Matrix For Multi-Script Courses

- Start date: 2026-05-21
- Status: active

## Purpose

Track cross-course runtime and data-model gaps discovered while bootstrapping
writing systems beyond Thai. Course-specific questions stay in each course
folder; repeated needs are consolidated here for future implementation planning.

## Current Runtime Constraints

- The runtime data model still contains Thai-specific field names and assumptions
  in `src/lib/data/types.ts` and `src/lib/data/thai.ts`.
- The progress store is not yet course-aware, so multiple curricula would collide
  without a course/version boundary.
- Script styling and detection are Thai-specific instead of course/script-driven.
- Lesson breakdown components assume a syllable or Thai-like decomposition rather
  than a generic pedagogical-unit model.
- Direction metadata exists at the data level but is not yet propagated through
  app layout or lesson surfaces.

## Gap Matrix

| Capability                    | First surfaced by             | Affected course families                                                     | Recommendation                                                                                                        |
| ----------------------------- | ----------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Language-agnostic text fields | Korean Hangul, Greek          | All non-Thai courses                                                         | Rename runtime fields such as `thai` to neutral names such as `text` before adding new course data.                   |
| Course-aware progress         | Korean Hangul, Greek          | All multi-course runtime work                                                | Include course/version IDs in learner progress keys and DB learner-state records.                                     |
| Script-aware styling          | Korean Hangul, Greek          | All courses                                                                  | Replace hardcoded Thai text detection with course/script metadata and reusable script display classes.                |
| Pedagogical unit model        | Korean Hangul, Greek          | Hangul, Greek, abugidas, logographic systems                                 | Represent teachable units separately from Unicode code points and grapheme clusters.                                  |
| Positional variants           | Korean Hangul, Greek          | Hangul, Greek, Arabic, Indic scripts                                         | Add metadata for position-sensitive units such as final sigma, Hangul initial/final jamo roles, and contextual forms. |
| Digraph or chunk units        | Greek                         | Greek, Cyrillic variants, Latin digraph courses, Indic transliteration paths | Allow multi-character units to be taught as a single pedagogical unit when useful.                                    |
| Case-pair metadata            | Greek                         | Greek, Cyrillic, Armenian, Georgian variants, Latin extensions               | Store uppercase/lowercase pairs and sign-heavy display recommendations without duplicating lesson content.            |
| Stress and diacritic metadata | Greek                         | Greek, Latin diacritics, IPA, Indic scripts, Arabic/Hebrew vowel marks       | Distinguish pronunciation aids, required orthographic marks, tone marks, and optional diacritics.                     |
| RTL and bidi propagation      | Planned for Arabic and Hebrew | Arabic, Hebrew, Syriac, N'Ko, Adlam                                          | Thread `dir` and language metadata through route/layout/component surfaces before RTL lessons ship.                   |
| Vertical layout support       | Planned for Mongolian         | Mongolian, some CJK/historical modes                                         | Verify CSS, drill layout, and text rendering for vertical or mixed-direction scripts before implementation.           |
| Media and audio hooks         | Greek, future IPA             | IPA, Greek, Arabic, Indic, historical pronunciation courses                  | Reserve optional pronunciation/audio fields without blocking text-first v1 courses.                                   |
| Nonstandard interaction modes | Braille, Morse/signaling      | Braille, Morse, semaphore, tactile/signaling systems                         | Design separate drill primitives for tactile or time-based signals rather than forcing letter-card drills.            |

## Open Implementation Threads

- Define a language-agnostic runtime lesson DTO before any second course ships.
- Decide whether `curriculum.graphemes` should store pedagogical digraphs and
  positional variants directly or whether these belong in course-version details.
- Add a fixture matrix for LTR alphabet, RTL abjad, abugida, logographic, Hangul,
  and nonstandard signaling/tactile courses.
- Keep source-license and reviewer status out of runtime payloads unless they are
  intentionally displayed for attribution.
