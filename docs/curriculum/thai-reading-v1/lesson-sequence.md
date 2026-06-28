# Thai Reading Lesson Sequence

Stages 1-5 (Lessons 1-13) mirror the current runtime order in
`src/lib/data/thai.ts` and are shipped today.

Stages 6+ (Lessons 14+) are the **full-alphabet expansion proposal** produced by
the 2026-06-27 research pass (`.ai/archive/2026-06-27-thai-full-alphabet-research.md`).
They are ordered frequency-first from `grapheme-candidates.scored.csv`: the most
common consonants, vowels, and marks come next, and redundant Sanskrit/Pali
letters plus obsolete glyphs are grouped near the end. Anchors in the new stages
are **provisional** and still need the anchor-candidate scoring follow-up; every
proposed anchor is decodable from already-taught units plus that lesson's new
units.

## Practice Contract

- Every lesson keeps one anchor word.
- Lesson 1 now targets `10` core practice reads because its decodable pool is
  smallest and may need low-frequency or nonsense items.
- Lessons 2-13 should be expanded to `10` core practice reads plus an optional
  extension set during the next Thai content pass.

## Course Shape

- First-session reading win: read `มาก`, `ดี`, and `กิน` as useful real words.
- Approximate lesson count: 13 current runtime lessons.
- Structural family: Thai abugida with consonant classes, non-linear vowel
  placement, tone marks, final consonant roles, silent carriers, and leading-H
  clusters.
- Required app support beyond the current runtime: language-agnostic text fields,
  course-aware progress, explicit syllable segmentation, tone metadata,
  vowel-position metadata, and cluster or carrier modeling for DB ingestion.

## Stage 1: Runtime First Decoding Wins

| Lesson | Anchor | New units | Rule or pattern                              | Review units  | Drill focus                                                       |
| ------ | ------ | --------- | -------------------------------------------- | ------------- | ----------------------------------------------------------------- |
| 1      | `มาก`  | ม, า, ก   | Right-side long `า`; final `ก` closes as k.  | none          | Recognize the first consonants and decode a high-payoff modifier. |
| 2      | `ดี`   | ด, ี      | Above vowel `ี`; initial `ด` starts as d.    | ม, า, ก       | Scan above the consonant and read a core positive word.           |
| 3      | `กิน`  | น, ิ      | Short `ิ` sits above; final `น` stays nasal. | ก, ด, ี, ม, า | Reuse a compact food verb and the `-ิน` frame.                    |

## Stage 2: Markets And Reusable Frames

| Lesson | Anchor | New units | Rule or pattern                                                          | Review units        | Drill focus                                          |
| ------ | ------ | --------- | ------------------------------------------------------------------------ | ------------------- | ---------------------------------------------------- |
| 4      | `ตลาด` | ต, ล      | Hidden short a between non-blending consonants; final stops are clipped. | ก, ม, า, ด, น, ิ, ี | Read a real market sign and notice cluster behavior. |
| 5      | `บิน`  | บ         | Initial `บ` is b; the `-ิน` frame repeats across words.                  | ก, น, ิ, ด, ต, ล, า | Swap initial consonants inside a known frame.        |

## Stage 3: Before Vowels And Tone Marks

| Lesson | Anchor | New units | Rule or pattern                                                    | Review units           | Drill focus                                                           |
| ------ | ------ | --------- | ------------------------------------------------------------------ | ---------------------- | --------------------------------------------------------------------- |
| 6      | `แม่`  | แ, ่      | Before vowel `แ` is written left of the consonant; `่` marks tone. | ม, า, ด, ี, ก, น, ิ    | Scan left before pronouncing and treat tone marks as word-level cues. |
| 7      | `ร้าน` | ร, ้      | Initial `ร` gives r; tone marks sit above the consonant.           | น, า, ม, ด, ต, ล, แ, ่ | Read storefront words and compare tone-mark placement.                |

## Stage 4: Menu Combos And Prices

| Lesson | Anchor | New units | Rule or pattern                                       | Review units        | Drill focus                                     |
| ------ | ------ | --------- | ----------------------------------------------------- | ------------------- | ----------------------------------------------- |
| 8      | `ชุด`  | ช, ุ      | Below vowel `ุ`; short closed syllables feel clipped. | ด, ต, น, ิ, า, ร, ้ | Decode menu set words and final-stop rhythm.    |
| 9      | `สิบ`  | ส         | Initial `ส` gives s; final `บ` closes as p.           | บ, ิ, น, ด, ช, ุ    | Read prices and final consonant sound families. |

## Stage 5: Survival Food Words And Carriers

| Lesson | Anchor  | New units | Rule or pattern                                                    | Review units        | Drill focus                                           |
| ------ | ------- | --------- | ------------------------------------------------------------------ | ------------------- | ----------------------------------------------------- |
| 10     | `ข้าว`  | ข, ว      | Aspirated `ข`; `ว` helps form the `-าว` glide.                     | า, ก, ม, ร, ้, น    | Read an essential menu word and compare ก/ข.          |
| 11     | `หมู`   | ห, ู      | Leading `ห` changes the tone pattern; long `ู` sits below.         | ม, ข, า, ว          | Treat leading-H clusters as a reusable chunk.         |
| 12     | `อาหาร` | อ         | `อ` can silently carry an opening vowel; final `ร` often sounds n. | ห, ร, า, ด, น       | Read food and restaurant signs with carrier behavior. |
| 13     | `ผัด`   | ผ, ั      | Aspirated `ผ`; short `ั` sits above.                               | ด, ต, ข, ห, อ, ม, า | Unlock stir-fry words and short-a menu chunks.        |

## Full-Alphabet Expansion (Proposed, Stages 6+)

The stages below extend the shipped 13 lessons to complete-script coverage.
Ordering follows `grapheme-candidates.scored.csv` descending, so the highest
frequency/utility units are taught first. Frequencies were recalibrated on
2026-06-27 against a corpus review (the 2023 modern-written-Thai character
corpus for grapheme percentages, and Munthuli et al. for phoneme/final-coda
frequency), so the ranking now tracks what readers actually see on the page.
Two consequences of that review are baked in here: the silent marker `์` moved
up (it is more frequent in running text than several easier-to-pronounce
consonants) and is now introduced in Stage 9; and the final-coda roles are
ordered `final ง` and `final ย ว` ahead of `final ก` by coda frequency, even
though `final ก` is still taught first as the gateway that introduces the whole
final-stop concept. Bands are a guide, not a gate: a few "weak"-band units (Thai
numerals, `ๆ`) are still taught because they appear in real signage, exactly as
Stage 2 already teaches the weak-band `ตล` hidden-vowel frame. Truly redundant
and obsolete glyphs are grouped into late recognition lessons.

## Stage 6: High-Frequency Consonants And The Leading-Vowel System

Stage 6 anchors are scored in `anchor-candidates.scored.csv` (2026-06-28) and
all land in the promising band, interleaving among the shipped anchors. `ของ`
scores lowest (0.5316, just above the weak line) because Lesson 14 stacks three
new ideas (`ง`, final `ง`, and the `อ`-as-aw vowel) — see the cadence note below.

| Lesson | Anchor (scored) | New units      | Rule or pattern                                                | Drill focus                                           |
| ------ | --------------- | -------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| 14     | `ของ`           | ง, final ง, -อ | `ง` gives the ng sound; `อ` doubles as the aw vowel.           | Read the very common ng final and the aw vowel.       |
| 15     | `ทาง`           | ท              | Low-class `ท` is a plain th; pairs with `ง` for transit words. | Decode direction and wayfinding words.                |
| 16     | `จะ`            | จ, ะ           | `จ` gives j; `ะ` is a short-a with a glottal stop after.       | Read short open syllables and a core grammar word.    |
| 17     | `เกม`           | เ              | `เ` is written before the consonant and gives long e.          | Scan left for a leading vowel, then read across.      |
| 18     | `ไก่`           | ไ, ใ           | `ไ`/`ใ` are leading ai vowels; `ใ` covers ~20 must-know words. | Distinguish the two ai vowels in menu and sign words. |
| 19     | `โต`            | โ              | `โ` is a leading long-o vowel.                                 | Read leading long-o words.                            |
| 20     | `ปิด`           | ป              | `ป` is a plain mid p; contrast with `บ`.                       | Read the open/closed sign pair `เปิด` / `ปิด`.        |
| 21     | `ยา`            | ย, final ย ว   | `ย` gives y and also closes glide finals.                      | Read pharmacy and label words plus glide finals.      |

Cadence note: Lesson 14 is the densest lesson in the course so far (three new
ideas at once), which the anchor score surfaces. Options for authoring: keep it
as one lesson, or split the `อ`-as-aw vowel into its own beat (e.g. anchor `รอ`
"to wait") and let Lesson 14 focus on `ง` + final `ng`. The shipped cadence
averages one–two new units per lesson, so a split would match precedent; left as
a single lesson it is the one spot to watch in playtesting. Decide before
authoring.

## Stage 7: Remaining Core Consonants And Wrap-Around Vowels

| Lesson | Anchor (provisional) | New units | Rule or pattern                                      | Drill focus                                       |
| ------ | -------------------- | --------- | ---------------------------------------------------- | ------------------------------------------------- |
| 22     | `คน`                 | ค         | Low-class `ค` is a plain kh; contrast with `ข`.      | Read people and place words.                      |
| 23     | `แพง`                | พ         | Low-class `พ` is a plain ph; contrast with `ผ`, `ฟ`. | Read price-tag adjectives.                        |
| 24     | `น้ำ`                | ำ         | `ำ` is the am vowel with a built-in final m.         | Read the essential water/drink word and `am` set. |
| 25     | `เขา`                | เ-า       | `เ` + `า` wrap the consonant to make ao.             | Read the wrap-around ao diphthong.                |

## Stage 8: Sibilant/Fricative Completion And Above-Line Vowels

| Lesson | Anchor (provisional) | New units | Rule or pattern                                             | Drill focus                                 |
| ------ | -------------------- | --------- | ----------------------------------------------------------- | ------------------------------------------- |
| 26     | `ซอย`                | ซ         | Low-class `ซ` is s; contrast with `ช`.                      | Read soi/lane street signs.                 |
| 27     | `ไฟ`                 | ฟ         | Low-class `ฟ` is f; contrast with `พ`.                      | Read fire/electric/Wi-Fi labels.            |
| 28     | `ถนน`                | ถ         | High-class `ถ` is th; contrast with `ท`.                    | Read road and transit words.                |
| 29     | `มือ`                | ื, ึ      | `ื`/`ึ` are above-line ue vowels, often on the `อ` carrier. | Scan the long/short ue pair above the line. |

## Stage 9: Diphthongs, Glide Finals, And True Clusters

| Lesson | Anchor (provisional) | New units             | Rule or pattern                                                      | Drill focus                                  |
| ------ | -------------------- | --------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| 30     | `เบียร์`             | เ-ีย, ์               | `เ-ีย` is the ia diphthong; `์` silences the final `ร` in loanwords. | Read menu/bar diphthong and loanword words.  |
| 31     | `วัว`                | ัว                    | `ัว` is the ua diphthong.                                            | Read ua words.                               |
| 32     | `เจอ`                | เ-อ                   | `เ-อ` is the oe diphthong.                                           | Read oe words.                               |
| 33     | `ปลา`                | true initial clusters | `กร กล กว ปร ปล พร` etc. blend, unlike the `ตล` hidden-vowel frame.  | Distinguish true clusters from hidden-vowel. |

## Stage 10: The Full Tone System And Spelling Marks

| Lesson | Anchor (provisional) | New units         | Rule or pattern                                                       | Drill focus                                    |
| ------ | -------------------- | ----------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| 34     | `โต๊ะ`               | ๊, ๋              | `๊`/`๋` complete the four tone marks.                                 | Read all four tone marks in context.           |
| 35     | (review)             | tone-class matrix | Formal mid/high/low class x mark x live/dead system, taught as rules. | Systematize tone from class + mark + syllable. |
| 36     | `เด็ก`               | ็ (mai taikhu)    | `็` shortens the vowel and carries no sound of its own.               | Read short-vowel closed syllables.             |
| 37     | `ช้าๆ`               | ๆ (maiyamok)      | `ๆ` repeats the previous word.                                        | Read repetition/plural/emphasis forms.         |
| 38     | (review)             | short diphthongs  | `เ-าะ เ-ะ แ-ะ โ-ะ` short pairs and unwritten short-o.                 | Read short diphthong pairs.                    |

## Stage 11: Numerals And Abbreviations

| Lesson | Anchor (provisional) | New units           | Rule or pattern                                      | Drill focus                          |
| ------ | -------------------- | ------------------- | ---------------------------------------------------- | ------------------------------------ |
| 39     | `๑๐ บาท`             | ๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ | Thai numerals on prices, addresses, and transit.     | Read Thai numerals on price/signage. |
| 40     | `กรุงเทพฯ`           | ฯ                   | `ฯ` (paiyannoi) abbreviates long names like Bangkok. | Read common abbreviations.           |

## Stage 12: Remaining Live Consonants

| Lesson | Anchor (provisional) | New units  | Rule or pattern                                                     | Drill focus                                   |
| ------ | -------------------- | ---------- | ------------------------------------------------------------------- | --------------------------------------------- |
| 41     | `ฉัน`                | ฉ, ฝ       | `ฉ` high-class ch and `ฝ` high-class f complete the aspirate pairs. | Read remaining aspirated-pair words.          |
| 42     | `ใหญ่`               | ญ, ธ, ภ, ฮ | `ญ`=y, `ธ`=th, `ภ`=ph (duplicates), `ฮ`=low h.                      | Read common words using the duplicate glyphs. |

## Stage 13: Redundant Sanskrit/Pali Glyphs (Recognition: Same Sound, Rarer Glyph)

The corpus review confirmed `ศ`, `ณ`, and `ษ` are not bottom-of-the-barrel rare
(~0.29-0.37% of characters, appearing in common words like `ประเทศ`, `คุณ`,
`ศาล`), so they get their own earlier recognition lesson (L43) ahead of the
genuinely rare `ฐ ฑ ฒ ฎ ฏ ฆ ฬ ฌ` group (L44).

| Lesson | Anchor (provisional) | New units                 | Rule or pattern                                                        | Drill focus                                  |
| ------ | -------------------- | ------------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| 43     | `ประเทศ`             | ศ, ษ, ณ                   | `ศ ษ`=s, `ณ`=n: same sounds as taught letters, in formal vocabulary.   | Recognize duplicate s/n glyphs.              |
| 44     | `กีฬา`               | ฐ, ฑ, ฒ, ฎ, ฏ, ฆ, ฬ, ฌ    | Rare Sanskrit/Pali duplicates of th/d/t/kh/l/ch.                       | Recognize rare duplicate glyphs by sound.    |
| 45     | `อังกฤษ`             | ฤ, leading อ, silent r/ทร | `ฤ`=ru/ri/rue; silent-`อ` in อย่า/อยาก/อย่าง/อยู่; `ร` silent, `ทร`=s. | Read the high-frequency spelling exceptions. |

## Stage 14: Historical Glyphs (Optional Recognition Only)

| Lesson | Anchor | New units          | Rule or pattern                                        | Drill focus                          |
| ------ | ------ | ------------------ | ------------------------------------------------------ | ------------------------------------ |
| 46     | none   | ฃ, ฅ, ฦ, ฦๅ, ฤๅ, ๅ | Obsolete/archaic glyphs no longer used in modern Thai. | Recognition only; no decoding drill. |

## Coverage Notes

- Target-domain samples: menus, storefronts, price tags, food-court signs,
  market labels, door signs, basic transit words, and public-facility labels.
- Known-grapheme goal (shipped): by Lesson 7, cover the first runtime consonants,
  right/above/left vowel placement, and two tone marks; by Lesson 13, cover the
  current runtime high-class food consonants, below vowels, silent carrier, and
  leading-H pattern.
- Known-grapheme goal (proposed): by Lesson 25, cover all high-frequency live
  consonants, the leading-vowel system, and wrap-around vowels; by Lesson 38,
  cover the full vowel chart, all four tone marks, the formal tone-class system,
  and the silent/repetition marks; by Lesson 46, cover the complete consonant
  inventory including redundant and obsolete glyphs.
- Known-word goal: by Lesson 3, learners read three real high-frequency words;
  by Lesson 13, learners decode the current runtime menu and storefront core; by
  Lesson 25, learners decode the bulk of everyday signage; by Lesson 40, learners
  decode prices, abbreviations, and most loanword spellings.
- Now in scope (Stages 6+): all 44 consonants, the full vowel chart, all four
  tone marks, the formal tone-class matrix, Thai numerals, silent and repetition
  marks, true clusters, and the main spelling exceptions.
- Still deferred beyond this packet: handwriting/production, tokenizer-backed
  coverage measurement, and audio assets.
