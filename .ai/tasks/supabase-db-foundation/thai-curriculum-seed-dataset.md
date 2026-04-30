# Task: Thai curriculum seed dataset

- Start date: 2026-04-26
- Owner: GitHub Copilot
- Status: in-progress

## Purpose

Compile the approved rewritten Thai curriculum into a DB-ready inventory for the
first content seed.

## Current State

- The curriculum rewrite approved in `../../2026-04-26-thai-content-seeding-plan.md`
  has landed in `src/lib/data/thai.ts`.
- This file now tracks the rewritten runtime course, not the superseded 4-lesson
  runtime-parity snapshot.
- Seed code has not started yet. This document is the handoff between the runtime
  rewrite and normalized `curriculum.*` seed authoring.
- `docs/database-dto-spec.md` now includes first-class reusable vocabulary tables.
  The first seed pass now needs to create vocabulary rows for every lesson's anchor
  word and the first authored supporting-vocabulary slice.

## Source Hierarchy

1. `src/lib/data/thai.ts`
   - Authoritative for the approved rewritten lesson set, anchor words, grapheme
     pedagogy, rules, drills, and review-letter order.
2. `src/lib/data/types.ts`
   - Authoritative runtime contract for `LanguagePack`, `Lesson`, `Word`, `Letter`,
     `Rule`, and `DrillQuestion`.
3. `docs/concept/approach-thai.md`
   - Authoritative Thai concept source for the frequency-first sequencing rationale,
     remaining expansion targets, and coverage goals beyond the current runtime set.
4. `docs/database-dto-spec.md`
   - Authoritative target schema and backend mapping.
5. `src/routes/+page.svelte`, `src/lib/components/content/home/HomeHero.svelte`, and
   `src/routes/learn/+page.svelte`
   - Source for course shell copy not present in `thai.ts`.

## Approved Rewritten Runtime Inventory

### Counts

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

Integrity checks:

- Passed: every `reviewLetters` entry references a grapheme introduced in an earlier
  lesson.
- Passed: `pnpm check` after the rewrite, progress snapshot reset, and tone-mark UI
  update.

### Course Shell Inventory

| Target field                                 | Value                                                                                                                                   | Status                   | Source                                          |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------- |
| `curriculum.courses.slug`                    | `thai`                                                                                                                                  | confirmed                | `thaiPack.id`                                   |
| `curriculum.courses.name`                    | `Thai`                                                                                                                                  | confirmed                | `thaiPack.name`                                 |
| `curriculum.courses.native_name`             | `ภาษาไทย`                                                                                                                               | confirmed                | `thaiPack.nativeName`                           |
| `curriculum.courses.hero_title`              | `Learn to read Thai`                                                                                                                    | confirmed                | `HomeHero.svelte`                               |
| `curriculum.courses.hero_subtitle`           | `Don't memorize an alphabet chart. Learn real words you'll see on streets, menus, and signs - and pick up the letters naturally.`       | confirmed                | `HomeHero.svelte`                               |
| `curriculum.courses.seo_title`               | `GlyphBridge — Learn Thai Through Real Words`                                                                                           | confirmed                | `src/routes/+page.svelte`                       |
| `curriculum.courses.seo_description`         | `Learn to read Thai through real words, guided lesson steps, and short drills built around signs, menus, roads, and everyday language.` | confirmed                | `src/routes/+page.svelte`                       |
| `curriculum.languages.code`                  | `th`                                                                                                                                    | proposed derived literal | Required by DB spec; not stored in runtime data |
| `curriculum.script_systems.slug`             | `thai`                                                                                                                                  | proposed derived literal | Required by DB spec                             |
| `curriculum.script_systems.name`             | `Thai script`                                                                                                                           | proposed derived literal | Required by DB spec                             |
| `curriculum.script_systems.native_name`      | unresolved                                                                                                                              | approval needed          | No durable source yet                           |
| `curriculum.course_versions.version_ordinal` | `1`                                                                                                                                     | proposed derived literal | First seed version                              |
| `curriculum.course_versions.display_version` | `1.0.0`                                                                                                                                 | proposed derived literal | First rewritten runtime release                 |
| `curriculum.course_versions.release_title`   | `Thai frequency-first foundation`                                                                                                       | proposed derived literal | First rewritten runtime release                 |
| `curriculum.course_versions.release_summary` | `First 13-lesson Thai curriculum rewrite aligned to the frequency-first sequence in approach-thai.md.`                                  | proposed derived literal | First rewritten runtime release                 |

### Lesson Inventory

| Lesson | Stage | Proposed lesson slug | Anchor target | Category    | New graphemes | Rules                                      | Drills |
| ------ | ----- | -------------------- | ------------- | ----------- | ------------- | ------------------------------------------ | ------ |
| 1      | 1     | `maak`               | `มาก`         | `daily`     | `ม`, `า`, `ก` | `long-aa-right`, `final-k-stop`            | 5      |
| 2      | 1     | `dii`                | `ดี`          | `daily`     | `ด`, `ี`      | `long-ii-above`, `initial-d-sound`         | 5      |
| 3      | 1     | `gin`                | `กิน`         | `food`      | `น`, `ิ`      | `short-i-above`, `final-n-stays-n`         | 5      |
| 4      | 2     | `talat`              | `ตลาด`        | `place`     | `ต`, `ล`      | `hidden-vowel-market`, `final-stop-market` | 5      |
| 5      | 2     | `bin`                | `บิน`         | `transport` | `บ`           | `initial-b-sound`, `in-frame-pattern`      | 5      |
| 6      | 3     | `maae`               | `แม่`         | `daily`     | `แ`, `่`      | `before-vowels-left`, `mai-ek-tone-mark`   | 5      |
| 7      | 3     | `raan`               | `ร้าน`        | `place`     | `ร`, `้`      | `initial-r-sound`, `mai-tho-above`         | 5      |
| 8      | 4     | `chut`               | `ชุด`         | `food`      | `ช`, `ุ`      | `short-u-below`, `dead-syllable-stop`      | 5      |
| 9      | 4     | `sip`                | `สิบ`         | `sign`      | `ส`           | `initial-s-sound`, `final-b-to-p`          | 5      |
| 10     | 5     | `khao`               | `ข้าว`        | `food`      | `ข`, `ว`      | `kh-vs-k`, `aaw-glide`                     | 5      |
| 11     | 5     | `moo`                | `หมู`         | `food`      | `ห`, `ู`      | `leading-h-pattern`, `long-uu-below`       | 5      |
| 12     | 5     | `ahan`               | `อาหาร`       | `food`      | `อ`           | `silent-carrier`, `final-r-to-n`           | 5      |
| 13     | 5     | `phat`               | `ผัด`         | `food`      | `ผ`, `ั`      | `ph-vs-b`, `short-a-above`                 | 5      |

Notes:

- `curriculum.lessons.slug` and `curriculum.anchor_targets.slug` can initially mirror
  the proposed lesson slug unless we decide to split lesson and anchor keys.
- The proposed slugs above are stable enough for seed authoring, but the exact
  transliteration style remains an explicit unresolved input below.
- Each current anchor word should also seed into `curriculum.vocabulary_items` and
  `curriculum.lesson_vocabulary` with `role_key = 'anchor'`.

### Supporting Vocabulary Slice

| Lesson | Anchor  | Supporting vocabulary |
| ------ | ------- | --------------------- |
| 1      | `มาก`   | `มา`, `กา`            |
| 2      | `ดี`    | `มี`, `ดีมาก`         |
| 3      | `กิน`   | `ดิน`, `มีด`          |
| 4      | `ตลาด`  | `ตา`, `ลาน`           |
| 5      | `บิน`   | `บาน`, `บีบ`          |
| 6      | `แม่`   | `แก่`, `แน่`          |
| 7      | `ร้าน`  | `ล้าน`, `ด้าน`        |
| 8      | `ชุด`   | `ชาม`, `ดุ`           |
| 9      | `สิบ`   | `สิน`, `สาม`          |
| 10     | `ข้าว`  | `ขาว`, `วาด`          |
| 11     | `หมู`   | `หมา`, `หู`           |
| 12     | `อาหาร` | `อ่าน`, `ออก`         |
| 13     | `ผัด`   | `ผัก`, `กัน`          |

### Vocabulary Modeling Notes

- The current runtime contract still exposes only one `anchorWord` per lesson.
- The DB spec now adds `curriculum.vocabulary_items`,
  `curriculum.vocabulary_segments`, and `curriculum.lesson_vocabulary` so lessons can
  later teach and drill multiple reusable words.
- For the first seed pass, each lesson's current anchor word should populate:
  - `curriculum.anchor_targets`
  - `curriculum.anchor_segments`
  - `curriculum.vocabulary_items`
  - `curriculum.vocabulary_segments`
  - `curriculum.lesson_vocabulary` with `role_key = 'anchor'`

- The first authored supporting-vocabulary slice should populate:
  - additional `curriculum.vocabulary_items` rows
  - additional `curriculum.vocabulary_segments` rows
  - `curriculum.lesson_vocabulary` rows with `role_key = 'support'` and
    `is_drill_target = true`

- The current runtime now carries this support vocabulary directly in
  `lesson.vocabulary`, so the inventory above is implementation-backed rather than a
  planning placeholder.

### Unique Grapheme Inventory

#### Consonants

| Grapheme | Class or role | Romanization     | Pronunciation hint                                                     | Seed note                             |
| -------- | ------------- | ---------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| `ม`      | low           | `m`              | `m as in "mother"`                                                     | early high-frequency consonant        |
| `ก`      | mid           | `g/k`            | `hard g/k sound; final ก closes like "k"`                              | early final-stop family anchor        |
| `ด`      | mid           | `d/t`            | `d as in "dog" at the start; clipped t at the end`                     | early final-stop family anchor        |
| `น`      | low           | `n`              | `n as in "no"`                                                         | early final sonorant                  |
| `ต`      | mid           | `t`              | `t as in "stop" (unaspirated)`                                         | hidden-vowel and market vocabulary    |
| `ล`      | low           | `l`              | `l as in "love"`                                                       | place and market vocabulary           |
| `บ`      | mid           | `b/p`            | `b as in "bat" at the start; clipped p at the end`                     | travel, prices, and final-stop family |
| `ร`      | low           | `r`              | `r as in "run" at the start; n at the end in some words`               | storefront vocabulary                 |
| `ช`      | low           | `ch`             | `ch as in "check"`                                                     | menu and set-word vocabulary          |
| `ส`      | high          | `s`              | `s as in "sun"`                                                        | price tags, greetings, labels         |
| `ข`      | high          | `kh`             | `kh with a puff of air`                                                | survival food vocabulary              |
| `ว`      | low           | `w`              | `w as in "water"; can help form vowel glides`                          | vowel-glide helper in food words      |
| `ห`      | high          | `h`              | `h as in "hello"; often used as a leading tone helper`                 | leading-ห pattern                     |
| `อ`      | mid           | `silent carrier` | `placeholder consonant used when a syllable begins with a vowel sound` | silent carrier                        |
| `ผ`      | high          | `ph`             | `ph with a puff of air`                                                | high-class food vocabulary            |

#### Vowels

| Grapheme | Position | Romanization | Pronunciation hint                    | Seed note                                |
| -------- | -------- | ------------ | ------------------------------------- | ---------------------------------------- |
| `า`      | `right`  | `aa`         | `long "aa" as in "father"`            | first long vowel                         |
| `ี`      | `above`  | `ii`         | `long "ee" as in "see"`               | early vertical vowel                     |
| `ิ`      | `above`  | `i`          | `short "i" as in "sit"`               | reusable short vowel frame               |
| `แ`      | `left`   | `ae`         | `long "ae" as in the vowel of "care"` | first before-vowel                       |
| `ุ`      | `below`  | `u`          | `short "u" as in "put"`               | menu and combo vocabulary                |
| `ู`      | `below`  | `uu`         | `long "oo" as in "food"`              | leading-ห food vocabulary                |
| `ั`      | `above`  | `a`          | `short "a" as in "cut"`               | stir-fry and short-vowel food vocabulary |

#### Tone marks

| Grapheme | Position | Romanization | Pronunciation hint                             | Seed note                                      |
| -------- | -------- | ------------ | ---------------------------------------------- | ---------------------------------------------- |
| `่`      | `above`  | `mai ek`     | `first tone mark written above the consonant`  | introduced through `แม่`                       |
| `้`      | `above`  | `mai tho`    | `second tone mark written above the consonant` | introduced through `ร้าน` and reused in `ข้าว` |

### Rule and Drill Mapping Notes

- `Rule.examples` should seed into `curriculum.orthography_rule_examples.text` as
  written in `thai.ts` for v1. The strings already mix Thai text and practical
  romanization, so `translation` can stay `NULL` unless we formalize examples later.
- All 65 current drills are choice-based. For v1, `curriculum.drills.payload` can
  remain empty and all answer content can live in `curriculum.drill_options`.
- Tone marks are now first-class lesson content via `Letter.type = tone_mark` and
  the alphabet route now exposes a dedicated tone-mark section.
- `src/lib/stores/progress.ts` intentionally moved to snapshot version `2` so stale
  completions from the pre-rewrite curriculum do not mark rewritten lessons complete.
- Drill keys are not present in runtime today. The seed should derive stable keys
  from lesson slug plus drill order unless we approve a different key strategy first.
- As supporting lesson vocabulary is authored, drills should target
  `curriculum.lesson_vocabulary` items rather than treating extra words as ad hoc
  strings buried only in drill JSON.

## Approach-Thai Coverage Status

| Concept level from `approach-thai.md`               | Runtime coverage | Status      | Notes                                                                                   |
| --------------------------------------------------- | ---------------- | ----------- | --------------------------------------------------------------------------------------- |
| Level 1: anchor set and first five letters          | Lessons 1-3      | implemented | `มาก`, `ดี`, and `กิน` establish the first high-payoff consonants and vowels            |
| Level 2: verticality and transit                    | Lessons 4-5      | implemented | `ตลาด` and `บิน` cover hidden vowels, market reading, and reusable `-ิน` frames         |
| Level 3: before vowels and tone markers             | Lessons 6-7      | implemented | `แม่` and `ร้าน` introduce left-side vowels and the first two tone marks                |
| Level 4: sibilants and short `u`                    | Lessons 8-9      | implemented | `ชุด` and `สิบ` cover `ช`, `ส`, `ุ`, and another final-stop family                      |
| Level 5: high-class consonants and survival utility | Lessons 10-13    | implemented | `ข้าว`, `หมู`, `อาหาร`, and `ผัด` cover food, leading-`ห`, and silent-carrier patterns  |
| Level 6: loanwords and complex clusters             | none yet         | pending     | loanwords such as `คอมพิวเตอร์`, `เซเว่น`, `แบงก์`, and `ไวไฟ` are still future content |

Additional authoritative signals from `approach-thai.md` that are not yet encoded as
runtime data fields:

- Validate lesson sequencing against environmental print such as signs, menus,
  transit labels, and packaging.
- Track broad decoding coverage targets of roughly 50 percent after lesson 5,
  75 percent after lesson 10, and 95 percent after lesson 20.

## Reconciliation Notes

- The runtime and concept documents no longer conflict on the approved direction.
- `src/lib/data/thai.ts` is now the canonical seed source for the first Thai course
  version.
- `docs/concept/approach-thai.md` remains authoritative for the next content wave,
  especially the level 6 loanword and complex-vowel track.

## Unresolved Inputs

- Final `curriculum.script_systems.native_name`
- Whether the proposed lesson slug transliterations above are the final stable lesson
  keys or just the initial seed slugs
- Stable drill key strategy
- Whether the first seed writes `pedagogical_group_key`,
  `pedagogical_group_label`, or `tags` derived from `approach-thai.md`, or leaves
  those fields empty for the first version

## Next Action

- Convert the rewritten inventory above into normalized seed inputs for
  `curriculum.*`, including anchor-backed and support-backed vocabulary rows.
- Confirm the remaining course-level seed literals and first publication naming.
- Keep the level 6 expansion work in planning mode unless the first seed needs it.
