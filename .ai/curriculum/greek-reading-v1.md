# Greek Reading Curriculum

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: pilot draft

## Goal

Track curriculum authoring for Greek Reading (el-Grek, Grek).

## Source Files

- Bootstrap workspace: `docs/curriculum/greek-reading-v1/`
- Manifest: `docs/curriculum/greek-reading-v1/manifest.json`
- DB strategy: `docs/curriculum/greek-reading-v1/db-ingestion-strategy.md`
- Durable course notes: `docs/curriculum/greek-reading-v1/greek-reading-v1.md`

## Current Status

- [x] Course prospectus drafted
- [x] Source manifest validated
- [x] Script inventory drafted
- [x] Candidate anchors scored
- [x] Lesson sequence drafted
- [x] Review packet generated
- [ ] DB ingestion strategy reviewed
- [ ] Lessons authored
- [ ] Publication path designed

## Open Questions

- See `docs/curriculum/greek-reading-v1/questions.md`.

## Notes

- Course boundary: Modern Greek monotonic reading for traveler-facing menus,
  transit signs, public facilities, cultural sites, and everyday labels.
- Shipped examples should be app-authored until Wiktionary, OpenStreetMap,
  Europarl, and upstream corpus licensing is reviewed.
- Greek surfaced repeatable app gaps for case pairs, final-sigma positional
  variants, tonos/stress metadata, digraph pedagogical units, and course-aware
  progress.

## Validation

- `pnpm curriculum:validate docs/curriculum/greek-reading-v1/manifest.json`
  passed with 0 warnings.
- `pnpm curriculum:score docs/curriculum/greek-reading-v1/grapheme-candidates.csv`
  generated `grapheme-candidates.scored.csv`.
- `pnpm curriculum:score docs/curriculum/greek-reading-v1/anchor-candidates.csv`
  generated `anchor-candidates.scored.csv`.
- `pnpm curriculum:review docs/curriculum/greek-reading-v1 --force` generated
  `review-packet.md`.
