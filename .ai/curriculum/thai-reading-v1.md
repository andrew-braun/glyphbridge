# Thai Reading Curriculum

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: wave-b draft

## Goal

Track curriculum authoring for Thai Reading (`th-Thai`, `Thai`). This is a
backfill packet for the existing runtime Thai course.

## Source Files

- Bootstrap workspace: `docs/curriculum/thai-reading-v1/`
- Manifest: `docs/curriculum/thai-reading-v1/manifest.json`
- DB strategy: `docs/curriculum/thai-reading-v1/db-ingestion-strategy.md`
- Durable course notes: `docs/curriculum/thai-reading-v1/thai-reading-v1.md`

## Current Status

- [x] Course prospectus drafted
- [x] Source manifest drafted
- [x] Script inventory drafted
- [x] Candidate anchors drafted
- [x] Lesson sequence drafted from runtime data
- [x] Source manifest validated
- [x] Candidate anchors scored
- [x] Review packet generated
- [ ] DB ingestion strategy reviewed
- [ ] Lessons authored beyond existing runtime data
- [ ] Publication path designed
- [ ] Practice vocabulary expanded to at least 1 anchor + 10 core practice
      targets per lesson
- [x] Lesson 1 spoiler audit completed so practice words are not revealed before
      read-before-reveal practice

## Open Questions

- See `docs/curriculum/thai-reading-v1/questions.md`.
- See `.ai/2026-06-13-practice-vocabulary-expansion.md` for the current
  practice-vocabulary expansion plan.

## Notes

- Align first with `src/lib/data/thai.ts`, then with the broader rationale in
  `docs/curriculum/thai.md`.
- Preserve the runtime order: มาก, ดี, กิน, ตลาด, บิน, แม่, ร้าน, ชุด, สิบ,
  ข้าว, หมู, อาหาร, ผัด.
- The old two-support-word pattern is now considered underpowered. Future Thai
  authoring should use one anchor, at least ten core practice targets, and later
  lessons will include an optional extension set. Nonsense words are allowed when
  clearly tagged as meaning-free decoding practice.
- Runtime implementation now supports core versus extension practice, phrase and
  nonsense tagging, and spoiler-safe read-before-reveal sequencing. Lesson 1 has
  been expanded to ten core practice targets; Lessons 2-13 still need their
  larger practice pass.
