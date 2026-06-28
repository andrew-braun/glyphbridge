# Wave B RTL Curriculum Bootstrap

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: complete

## Scope

- Create Wave B bootstrap packets for `arabic-reading-v1` and
  `hebrew-reading-v1` only.
- Do not edit runtime code, the master tracker, or the app-expansion matrix.
- Keep external sources as discovery or scoring inputs unless explicitly
  app-authored.

## Progress

- [x] Read authoring framework, authoring tools, and Greek reference packet.
- [x] Scaffold Arabic Script Reading packet.
- [x] Scaffold Hebrew Reading packet.
- [x] Fill Arabic Script Reading artifacts.
- [x] Fill Hebrew Reading artifacts.
- [x] Run manifest validation.
- [x] Score grapheme and anchor candidates.
- [x] Generate review packets.

## Notes

- Both courses are RTL and need app-level bidi isolation and script-aware text
  rendering before runtime lesson implementation.
- Shared trackers are intentionally left untouched for the main agent.

## Validation

- `pnpm curriculum:validate docs/curriculum/arabic-reading-v1/manifest.json`
  passed with 0 warnings.
- `pnpm curriculum:validate docs/curriculum/hebrew-reading-v1/manifest.json`
  passed with 0 warnings.
- `pnpm curriculum:score docs/curriculum/arabic-reading-v1/grapheme-candidates.csv`
  generated `grapheme-candidates.scored.csv`.
- `pnpm curriculum:score docs/curriculum/arabic-reading-v1/anchor-candidates.csv`
  generated `anchor-candidates.scored.csv`.
- `pnpm curriculum:score docs/curriculum/hebrew-reading-v1/grapheme-candidates.csv`
  generated `grapheme-candidates.scored.csv`.
- `pnpm curriculum:score docs/curriculum/hebrew-reading-v1/anchor-candidates.csv`
  generated `anchor-candidates.scored.csv`.
- `pnpm curriculum:review docs/curriculum/arabic-reading-v1 --force` generated
  `review-packet.md`.
- `pnpm curriculum:review docs/curriculum/hebrew-reading-v1 --force` generated
  `review-packet.md`.
