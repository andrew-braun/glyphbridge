# Wave B Curriculum Bootstrap Packets

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: validation passed

## Scope

Create review-ready bootstrap packets for exactly these courses:

- `armenian-reading-v1`
- `georgian-reading-v1`
- `coptic-reading-v1`
- `english-braille-v1`
- `morse-signaling-v1`

Do not edit runtime code, the master curriculum tracker, or the app-expansion
matrix.

## Decisions

- External sources are discovery or scoring inputs only unless explicitly marked
  as app-authored shipped content.
- Braille and Morse are modeled as notation or nonstandard interaction courses,
  not ordinary visual script courses.
- Coptic is modeled as a historical and liturgical reading course with specialist
  review requirements.

## Progress

- [x] Scaffold course workspaces and per-course curriculum trackers.
- [x] Draft manifests, sources, candidates, lesson sequences, course notes,
      questions, and DB ingestion strategy files.
- [x] Run curriculum validation and scoring.
- [x] Generate review packets.
- [x] Record validation results in per-course trackers.

## Validation

- `pnpm curriculum:validate` passed for all five manifests with 0 warnings.
- `pnpm curriculum:score` generated grapheme and anchor scored CSVs for all five
  courses.
- `pnpm curriculum:review --force` generated review packets for all five courses.
