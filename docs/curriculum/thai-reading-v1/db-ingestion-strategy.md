# Thai Reading DB Ingestion Strategy

This file plans how reviewed authoring artifacts for `thai-reading-v1` should
move into the database. It is a starter strategy, not an executable migration or
seed script.

## Source Artifacts

- Manifest: `manifest.json`
- Sources: `sources.csv`
- Grapheme candidates: `grapheme-candidates.csv`
- Anchor candidates: `anchor-candidates.csv`
- Lesson sequence: `lesson-sequence.md`
- Review packet: `review-packet.md`
- Open questions: `questions.md`
- Current runtime lesson data: `src/lib/data/thai.ts`

## Target Database Boundary

- `curriculum` stores normalized authoring data and is not queried directly by
  learner routes.
- `delivery` stores immutable published lesson bundles for runtime reads and
  offline caching.
- `learner` is out of scope for curriculum ingestion except for future progress
  compatibility checks.
- `internal_api` may eventually own publication helper functions, but this
  starter strategy should not add privileged functions without separate review.

## Backfill Approach

1. Treat the existing runtime lesson order as fixed for the first Thai DB
   publication pass.
2. Convert runtime anchors, practice vocabulary, rules, drills, and syllable
   breakdowns into reviewed normalized records.
3. Carry lesson-vocabulary metadata for practice tier and source type so the
   publication can distinguish core practice, optional extension practice,
   phrases, and nonsense decoding targets.
4. Add explicit Thai-specific metadata that is currently implicit in lesson
   prose: vowel position, tone marks, consonant class, final-sound role,
   leading-H behavior, and silent carrier behavior.
5. Generate a delivery publication from normalized records and compare the
   published payload against the existing runtime course before activation.

## Mapping Plan

| Authoring artifact             | Database target                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Manifest language metadata     | `curriculum.languages`                                                                            |
| Manifest script metadata       | `curriculum.script_systems`                                                                       |
| Course prospectus              | `curriculum.courses`                                                                              |
| Runtime stage and lesson order | `curriculum.course_versions`, `curriculum.lessons`                                                |
| Reviewed grapheme inventory    | `curriculum.graphemes`, `curriculum.course_version_graphemes`                                     |
| Anchor and practice targets    | `curriculum.vocabulary_items`, `curriculum.vocabulary_segments`, `curriculum.lesson_vocabulary`   |
| Featured runtime anchors       | `curriculum.anchor_targets`, `curriculum.anchor_segments`                                         |
| Runtime rules                  | `curriculum.orthography_rules`, `curriculum.orthography_rule_examples`, `curriculum.lesson_rules` |
| Runtime drills and options     | `curriculum.drills`, `curriculum.drill_options`, `curriculum.lesson_drills`                       |
| Published lesson payloads      | `delivery.course_publications`, `delivery.course_publication_lessons`                             |

## Publication Strategy

- Generate stable IDs from course ID, lesson number, anchor text, and unit text.
- Preserve the visible runtime lesson order and anchor sequence.
- Keep external analysis sources out of learner-visible payloads.
- Insert one inactive `delivery.course_publications` manifest and all matching
  `delivery.course_publication_lessons` rows.
- Activate only after smoke checks confirm payload shape and manual review
  confirms no regression from the current runtime course.

## Validation Checklist

- [ ] Manifest validates with `pnpm curriculum:validate`.
- [ ] Source licenses are marked as discovery-only, scoring-only, scoring, or
      shipped-content approved.
- [ ] Every runtime new letter maps to a reviewed grapheme or unit row.
- [ ] Every anchor word also exists as vocabulary with `role_key = 'anchor'`.
- [ ] Every lesson has exactly one featured anchor target.
- [ ] Every lesson has at least ten core practice targets or an explicit early-lesson exception.
- [ ] Later lessons carry an optional extension set in publication data.
- [ ] Every drill has exactly one correct option.
- [ ] Thai syllable segmentation is reviewed before publication.
- [ ] Delivery payloads can be regenerated deterministically.
- [ ] Smoke tests compare the published payload against the runtime lesson
      contract before activation.

## Open Decisions

- Should the DB course ID be `thai-reading-v1`, with `thai` as a runtime alias,
  or should the existing runtime ID remain canonical?
- Which Thai-specific runtime fields should be renamed before generalized DB
  delivery work starts?
- Should Thai seed data come from a TypeScript transformation of the existing
  runtime module or from reviewed JSON artifacts generated from this packet?
- Should tone marks and final consonant behavior be represented as grapheme
  metadata, orthography rules, or both?
