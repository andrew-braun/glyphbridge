# Korean Hangul Curriculum Notes

This durable course note captures decisions and rationale that should outlive
the bootstrap authoring task. For active status and next-step tracking, see
`.ai/curriculum/korean-hangul-v1.md`.

The rest of the durable bootstrap product for this course also lives in this
folder: `manifest.json`, `sources.csv`, `grapheme-candidates.csv`,
`anchor-candidates.csv`, `review-packet.md`, and `db-ingestion-strategy.md`.

## Course Boundary

- Language/script: Korean written in Hangul (`ko-Hang`, ISO 15924 `Hang`)
- Target learner: English-speaking beginner who wants fast recognition of
  modern Korean words in menus, signage, media, and product labels
- Target domains: food and café menus, transit and place signs, everyday labels,
  high-visibility media and culture terms
- Out of scope for v1: Hanja, handwriting, calligraphy, full grammar, honorific
  systems, dialect comparison, historical spelling, North/South orthographic
  differences, production or conversation practice

## Script System

Modern Hangul uses syllable blocks composed of jamo (individual letters):
each block contains an initial consonant (choseong), a vowel (jungseong), and
an optional final consonant (jongseong / batchim). Syllable blocks are stored
as precomposed Unicode characters (U+AC00–U+D7A3) in NFC form; jamo-level
analysis requires algorithmic decomposition using the Unicode Hangul syllable
formula.

Pedagogical unit: individual jamo, not syllable blocks. Syllable-block
composition is taught as a rule layer, keeping the grapheme inventory to ~40
teachable units rather than thousands of block variants.

## Sequencing Rationale

First-session decoding target: a learner finishing Stage 1 can decode the most
common single-syllable menu and sign words using the 12 highest-scoring jamo
(ㅏ ㅇ ㅣ ㅗ ㄴ ㅜ ㅁ ㅓ ㅅ ㅡ ㅈ ㄱ) plus the batchim rule.

Stage coverage goals:

- Stage 1 (approx. 5 lessons): core vowels + most common consonants + one
  strong batchim anchor per lesson; target: menus and simple signs
- Stage 2 (approx. 5 lessons): aspirated consonants, compound vowels ㅕ ㅡ ㅐ,
  compound-vowel words; target: transit and everyday labels
- Stage 3+: remaining jamo, tense consonants, complex batchim rules, media
  vocabulary

Top-scoring anchor candidates from bootstrap pass (all scores are manual
estimates — pending corpus validation):

| Word | Gloss     | Score            | Domain          |
| ---- | --------- | ---------------- | --------------- |
| 물   | water     | 0.82 (strong)    | food_cafe_menus |
| 역   | station   | 0.73 (promising) | transit_signage |
| 밥   | rice/meal | 0.68 (promising) | food_cafe_menus |
| 카페 | café      | 0.66 (promising) | food_cafe_menus |
| 마트 | mart      | 0.66 (promising) | everyday_labels |

## Validation Notes

- Segmentation: whitespace word boundaries; jamo analysis via algorithmic
  decomposition. No Korean-specific tokenizer needed for this course scope.
- Pronunciation review: Korean native speaker required before any lesson copy is
  written. Key areas: ㄹ initial vs. batchim, ㅅ batchim as unreleased stop,
  ㄴ+ㄹ assimilation, ㅇ dual role.
- Cultural review: required for all learner-facing context notes and gloss
  strings, especially food and culture-domain words.
- License review: all sources currently discovery_only or scoring_only. No
  content may ship until source licenses are individually confirmed. See
  `sources.csv` for current status.
