# Thai Reading Lesson Sequence

This backfill sequence mirrors the current runtime order in `src/lib/data/thai.ts`.
It is not a new proposal for the live app.

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

## Coverage Notes

- Target-domain samples: menus, storefronts, price tags, food-court signs,
  market labels, door signs, basic transit words, and public-facility labels.
- Known-grapheme goal: by Lesson 7, cover the first runtime consonants,
  right/above/left vowel placement, and two tone marks; by Lesson 13, cover the
  current runtime high-class food consonants, below vowels, silent carrier, and
  leading-H pattern.
- Known-word goal: by Lesson 3, learners read three real high-frequency words;
  by Lesson 13, learners can decode the current runtime menu and storefront core.
- Deferred high-load material: full tone class matrix, all 44 consonants, rare
  consonants, full vowel chart, Thai numerals, silent marks, advanced clusters,
  handwriting, and tokenizer-backed coverage measurement.
