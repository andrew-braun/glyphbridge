# Thai Bopomofo Amharic Bootstrap Packets

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: complete

## Scope

Create review-ready bootstrap packets for exactly these Wave B courses:

- `thai-reading-v1`
- `mandarin-bopomofo-v1`
- `amharic-ethiopic-v1`

This task is documentation and authoring-artifact work only. Do not edit runtime
code, the master curriculum tracker, or the app-expansion matrix.

## Progress

- [x] Read repo and docs authoring guidance
- [x] Read Greek packet reference and neighboring Wave A examples
- [x] Scaffold packet directories and course trackers
- [x] Fill manifests, sources, candidates, lesson sequences, notes, questions,
      and DB strategies
- [x] Run manifest validation
- [x] Run candidate scoring for grapheme and anchor CSVs
- [x] Generate review packets
- [x] Summarize unresolved issues

## Notes

- Thai is a backfill packet for the existing runtime data in
  `src/lib/data/thai.ts`; align to that sequence without changing runtime code.
- External sources stay discovery or scoring only. Learner-visible shipped
  content should come from app-authored examples or existing app-owned runtime
  content.

## Validation

- `pnpm curriculum:validate` passed for all three manifests with zero warnings.
- `pnpm curriculum:score` generated grapheme and anchor scored CSVs for all
  three courses.
- `pnpm curriculum:review --force` generated review packets for all three
  courses.
- Focused `pnpm exec markdownlint-cli2` passed for the new tracker and packet
  markdown files.
- `pnpm check` passed with 0 errors and 0 warnings.
