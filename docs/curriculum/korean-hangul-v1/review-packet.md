# Korean Hangul Review Packet

Generated from `korean-hangul-v1` authoring artifacts.

## Review Gates

- [ ] Segmentation and grapheme mapping
- [ ] Pronunciation or romanization
- [ ] Cultural context and learner-facing wording
- [ ] License and attribution
- [ ] Database ingestion readiness

## Course Summary

- Course ID: `korean-hangul-v1`
- Language tag: `ko-Hang`
- Script: `Hang`
- Direction: `ltr`
- Target domains: food_cafe_menus, transit_signage, everyday_labels, media_culture

## Sources To Review

| Source           | Kind      | Use            | License         | Notes                                                                                                                                                                                                                                         |
| ---------------- | --------- | -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sejong-corpus    | frequency | discovery_only | nikl-research   | National Institute of Korean Language (NIKL) balanced corpus. Large, authoritative, genre-balanced. License requires institutional review before use beyond personal research — keep discovery_only until confirmed.                          |
| subtlex-ko       | frequency | scoring_only   | CC BY 4.0       | SUBTLEX-KO subtitle-based word frequency list. CC BY 4.0 confirmed for the frequency list itself. Good proxy for everyday spoken and informal Korean. Cleared for scoring; review before any shipped content cites it.                        |
| wiktionary-ko    | lexicon   | scoring_only   | CC BY-SA 3.0    | Korean Wiktionary entries provide glosses, part of speech, and basic usage. CC BY-SA 3.0 confirmed. Share-alike applies to derivative works — keep scoring_only until legal review confirms shipped gloss strings are acceptable derivatives. |
| open-korean-text | tokenizer | discovery_only | Apache 2.0      | Korean tokenizer and NLP tool library, not a text corpus. Apache 2.0. Used as an analysis tool for segmentation experiments, not as a content source. domain_weight 0 because it contributes no scored content directly.                      |
| namuwiki         | corpus    | scoring_only   | CC BY-SA 2.0 KR | Namu Wiki — large Korean community encyclopedia. CC BY-SA 2.0 KR confirmed. Good for culture and media domain coverage. Share-alike applies; keep scoring_only until legal review confirms shipped excerpts are acceptable.                   |

## Candidate Highlights

| Type   | Candidate | Gloss                       | Score  | Notes                                                                                                                                                                                                         |
| ------ | --------- | --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anchor | 물        | water                       | 0.8184 | domain: food_cafe_menus. Jamo: ㅁ+ㅜ+ㄹ batchim. 3 jamo. Teaches ㅁ ㅜ and first batchim consonant ㄹ. Found on every menu and restaurant table. Lesson 1-2 candidate.                                        |
| anchor | 역        | station                     | 0.7280 | domain: transit_signage. Jamo: ㅇ+ㅕ+ㄱ batchim. 1 syllable. rule_payoff: demonstrates ㅇ silent-initial rule — syllable starts with ㅕ sound despite ㅇ written. Every subway station sign.                  |
| anchor | 밥        | rice/meal                   | 0.6760 | domain: food_cafe_menus. Jamo: ㅂ+ㅏ+ㅂ batchim. Same consonant initial and final. Ambiguity: also means specifically cooked rice — context note needed.                                                      |
| anchor | 카페      | café (loanword)             | 0.6620 | domain: food_cafe_menus. Jamo: ㅋ+ㅏ+ㅍ+ㅔ. 2 syllables. Reinforces ㅋ and ㅍ after 커피. Shop-front signage.                                                                                                 |
| anchor | 마트      | mart/supermarket (loanword) | 0.6580 | domain: everyday_labels. Jamo: ㅁ+ㅏ+ㅌ+ㅡ. 2 syllables. Introduces ㅡ neutral vowel — the vowel with no English equivalent. rule_payoff: teaches ㅡ.                                                         |
| anchor | 주차      | parking                     | 0.6440 | domain: transit_signage. Jamo: ㅈ+ㅜ+ㅊ+ㅏ. 2 syllables, no batchim. Reinforces ㅈ and ㅊ. Good for a no-batchim lesson slot.                                                                                 |
| anchor | 버스      | bus (loanword)              | 0.6380 | domain: transit_signage. Jamo: ㅂ+ㅓ+ㅅ batchim. 1 syllable. Loanword. Irregularity: ㅅ batchim is unreleased t-like stop — important rule payoff.                                                            |
| anchor | 국        | soup/broth                  | 0.6360 | domain: food_cafe_menus. Jamo: ㄱ+ㅜ+ㄱ batchim. Teaches ㄱ in both initial and batchim positions. Ambiguity: 국 also appears in 한국 — a later review opportunity.                                           |
| anchor | 커피      | coffee (loanword)           | 0.6310 | domain: food_cafe_menus. Jamo: ㅋ+ㅓ+ㅍ+ㅣ. 2 syllables. Introduces aspirated ㅋ and ㅍ. Loanword — pronunciation close to English source, learner can verify decoding.                                       |
| anchor | 입구      | entrance                    | 0.6280 | domain: transit_signage. Jamo: ㅇ+ㅣ+ㅂ batchim + ㄱ+ㅜ. ㅇ silent initial review, ㅂ batchim. Pairs with 출구.                                                                                               |
| anchor | 노래      | song                        | 0.6256 | domain: media_culture. Jamo: ㄴ+ㅗ+ㄹ+ㅐ. 2 syllables, no batchim. Irregularity: ㄹ as initial after ㄴ batchim triggers consonant cluster assimilation — important phonological rule.                        |
| anchor | 김치      | kimchi                      | 0.6196 | domain: food_cafe_menus. Jamo: ㄱ+ㅣ+ㅁ batchim + ㅊ+ㅣ. 2 syllables. Introduces batchim ㅁ in medial position and aspirated ㅊ. Globally iconic — maximal memorability. Best late Stage 1 or Stage 2 anchor. |
| anchor | 면        | noodle                      | 0.6120 | domain: food_cafe_menus. Jamo: ㅁ+ㅕ+ㄴ batchim. Introduces ㅕ diphthong. Forms compounds: 냉면 라면 비빔면.                                                                                                  |
| anchor | 택시      | taxi (loanword)             | 0.6120 | domain: transit_signage. Jamo: ㅌ+ㅐ+ㄱ batchim + ㅅ+ㅣ. 2 syllables. Introduces ㅌ. Good ㅐ reinforcement.                                                                                                   |
| anchor | 한국      | Korea                       | 0.6070 | domain: media_culture. Jamo: ㅎ+ㅏ+ㄴ batchim + ㄱ+ㅜ+ㄱ batchim. Meta-word — the Korean word for Korea. Ambiguity: 국 also means soup — good contrast opportunity.                                           |
| anchor | 은행      | bank                        | 0.5934 | domain: everyday_labels. Jamo: ㅇ+ㅡ+ㄴ batchim + ㅎ+ㅐ+ㅇ final ng. ㅡ vowel, ㄴ batchim, ㅇ ng-final. rule_payoff: best single word to teach both roles of ㅇ — silent initial AND ng-final.                |
| anchor | 출구      | exit                        | 0.5910 | domain: transit_signage. Jamo: ㅊ+ㅜ+ㄹ batchim + ㄱ+ㅜ. 2 syllables. ㄹ batchim. Pairs with 입구.                                                                                                            |
| anchor | 서울      | Seoul                       | 0.5860 | domain: media_culture. Jamo: ㅅ+ㅓ+ㅜ+ㄹ batchim. 2 syllables. ㄹ batchim. Irregularity: eo+u somewhat merged in pronunciation.                                                                               |
| anchor | 영화      | movie/film                  | 0.5780 | domain: media_culture. Jamo: ㅇ+ㅕ+ㅇ ng batchim + ㅎ+ㅘ. ㅇ ng-batchim review, ㅘ compound vowel. Common in K-drama context.                                                                                 |
| anchor | 메뉴      | menu (loanword)             | 0.5760 | domain: food_cafe_menus. Jamo: ㅁ+ㅔ+ㄴ+ㅠ. 2 syllables. Introduces ㅔ vowel and ㅠ vowel. Appears on every restaurant menu. Good for ㅔ vs ㅐ distinction.                                                   |

## Reviewer Notes

### Segmentation

-

### Pronunciation

-

### Cultural Context

-

### License And Attribution

-

### DB Ingestion

-
