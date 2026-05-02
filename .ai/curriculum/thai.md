# Thai Curriculum

- Start date: 2026-05-02
- Owner: GitHub Copilot
- Status: active

## Goal

Track the implemented Thai glyph-system curriculum, its current coverage, and the
next authoring work needed to expand it.

## Authority

- This is the authoritative `.ai` tracker for Thai curriculum progress and to-dos.
- Use this file as the central status location for Thai content work.
- Keep durable concept rationale in `../../docs/concept/approach-thai.md` and exact DB
  schema truth in `../../docs/database-dto-spec.md`.
- Keep Supabase runtime and auth sequencing in `../tasks/supabase-db-foundation/implementation-status.md`.

## Current Summary

- Thai is complete for the current v1 seeded content slice, not for the full long-term
  Thai curriculum.
- The DB content model is already capable of lessons with graphemes, multiple words,
  rule or tip-style explanations, examples, drills, and published lesson bundles.
- The first authored Thai seed is implemented and validated end to end.
- The approved runtime curriculum currently covers levels 1 through 5 from
  `docs/concept/approach-thai.md`.
- The level 6 loanword and complex-cluster expansion is still future work.

## What Exists Now

### Authored v1 Thai Course

- Lessons: 13
- Unique new graphemes: 24
- Lesson-grapheme joins: 96 total
  - 24 `new`
  - 72 `review`
- Rules: 26
- Rule examples: 55
- Drills: 65
- Drill options: 260
- Vocabulary items: 39
- Lesson-vocabulary joins: 39 total
  - 13 `anchor`
  - 26 `support`
- Vocabulary segments: 67
- Anchor segments: 27

### Implemented Thai Content Capabilities

- Grapheme-by-grapheme lesson pedagogy
- One featured anchor word per lesson
- Multiple reusable lesson vocabulary words via support vocabulary
- Rule and tip-style explanations with authored examples
- Choice-based drills and answer options
- Published `delivery.*` lesson bundles for runtime reads

### Current Coverage Status

| Concept level from `approach-thai.md`               | Runtime coverage | Status      | Notes                                                                                  |
| --------------------------------------------------- | ---------------- | ----------- | -------------------------------------------------------------------------------------- |
| Level 1: anchor set and first five letters          | Lessons 1-3      | implemented | `มาก`, `ดี`, and `กิน` establish the first high-payoff consonants and vowels           |
| Level 2: verticality and transit                    | Lessons 4-5      | implemented | `ตลาด` and `บิน` cover hidden vowels, market reading, and reusable `-ิน` frames        |
| Level 3: before vowels and tone markers             | Lessons 6-7      | implemented | `แม่` and `ร้าน` introduce left-side vowels and the first two tone marks               |
| Level 4: sibilants and short `u`                    | Lessons 8-9      | implemented | `ชุด` and `สิบ` cover `ช`, `ส`, `ุ`, and another final-stop family                     |
| Level 5: high-class consonants and survival utility | Lessons 10-13    | implemented | `ข้าว`, `หมู`, `อาหาร`, and `ผัด` cover food, leading-`ห`, and silent-carrier patterns |
| Level 6: loanwords and complex clusters             | none yet         | pending     | `คอมพิวเตอร์`, `เซเว่น`, `แบงก์`, and `ไวไฟ` remain future Thai content                |

## Current Source Hierarchy

1. `src/lib/data/thai.ts`
   - Canonical source for the current authored Thai lesson set, anchor words,
     grapheme pedagogy, rules, drills, and review ordering.
2. `src/lib/data/types.ts`
   - Canonical runtime lesson contract.
3. `docs/concept/approach-thai.md`
   - Durable Thai concept source for sequencing rationale, coverage goals, and
     future expansion candidates.
4. `docs/database-dto-spec.md`
   - Canonical schema and DTO contract for how Thai content maps into the DB.
5. `scripts/generate-thai-seed.mjs` and `supabase/seed.sql`
   - Current materialization path from authored Thai runtime content into DB seed
     and published delivery payloads.

## Current Authoring Status

- The first Thai curriculum seed is complete and validated.
- The public learn runtime now reads the published lesson bundle without drift from
  the authored Thai runtime contract.
- Thai is ready for more lessons, more graphemes, more vocabulary, and more rule
  content within the current DB model.
- Thai is not yet complete as a full script-learning program, because the next
  concept wave is still unencoded.

## Open To-Dos

- Scope the first level 6 Thai content wave from `docs/concept/approach-thai.md`.
- Decide the next Thai version boundary after the current 13-lesson release.
- Validate the next lesson candidates against real-world print targets such as
  signage, menus, transit labels, and packaging.
- Decide whether the next Thai seed should start filling
  `pedagogical_group_key`, `pedagogical_group_label`, or `tags` for grapheme and
  lesson metadata.
- Keep `src/lib/data/thai.ts`, `scripts/generate-thai-seed.mjs`, and
  `supabase/seed.sql` aligned whenever Thai content changes.

## Not In Scope Yet

- Translation tables or localized alternate course copy
- Audio or image assets tied to Thai lessons
- Spaced-repetition projections as part of Thai content authoring
- A fully encoded level 6 Thai expansion

## Practical Status Language

Use this wording when summarizing Thai status:

"We have a complete v1 Thai content schema plus a fully seeded first 13-lesson Thai
course, but we do not yet have the full long-term Thai curriculum encoded."
