# Greek Reading Review Packet

Generated from `greek-reading-v1` authoring artifacts.

## Review Gates

- [ ] Segmentation and grapheme mapping
- [ ] Pronunciation or romanization
- [ ] Cultural context and learner-facing wording
- [ ] License and attribution
- [ ] Database ingestion readiness

## Course Summary

- Course ID: `greek-reading-v1`
- Language tag: `el-Grek`
- Script: `Grek`
- Direction: `ltr`
- Target domains: food_cafe_menus, transit_signage, public_facilities, museum_cultural_sites, everyday_labels

## Sources To Review

| Source                             | Kind                | Use             | License                                                      | Notes                                                                                                                                          |
| ---------------------------------- | ------------------- | --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| unicode-greek-block                | unicode_metadata    | scoring         | Unicode License reviewed for metadata use                    | Greek and Coptic block metadata for code points, combining marks, and final sigma. Use as infrastructure metadata only.                        |
| cldr-el-exemplars                  | locale_metadata     | scoring         | Unicode License reviewed for metadata use                    | Locale exemplar characters and casing behavior for Modern Greek. Confirm exact CLDR release before ingestion.                                  |
| wordfreq-el                        | frequency           | scoring_only    | MIT package license; upstream corpus licenses require review | Useful for broad Modern Greek frequency intuition. Do not ship derived example text from upstream corpora.                                     |
| greek-wiktionary                   | lexicon             | discovery_only  | CC BY-SA; attribution and share-alike review required        | Useful for glosses, inflection checks, and spelling variants. Keep discovery-only until attribution and share-alike implications are approved. |
| openstreetmap-greece-names         | environmental_print | scoring_only    | ODbL; derived-data obligations require review                | Useful for street, transit, place-name, and public-signage validation. Do not ship raw OSM extracts without license review.                    |
| europarl-el                        | corpus              | discovery_only  | Europarl terms require review before derived use             | Large formal corpus that can cross-check spelling and frequency, but register is poorly matched to traveler-first lessons.                     |
| app-authored-greek-domain-examples | authored_examples   | shipped_content | app_owned                                                    | Short menu, sign, and label examples authored from reviewed vocabulary rather than copied from third-party corpora.                            |

## Candidate Highlights

| Type   | Candidate | Gloss               | Score  | Notes                                                                  |
| ------ | --------- | ------------------- | ------ | ---------------------------------------------------------------------- |
| anchor | νερό      | water               | 0.6684 | High survival utility and early consonant-vowel payoff                 |
| anchor | ένα       | one / a             | 0.6554 | Very frequent and compact but less domain-specific than survival nouns |
| anchor | μετρό     | metro               | 0.6318 | Transit payoff with high positive transfer                             |
| anchor | καφέ      | coffee / cafe       | 0.6286 | Very common menu/cafe anchor and recognizable loanword                 |
| anchor | τιμή      | price               | 0.5886 | Menu and shopping utility; eta-as-i spelling                           |
| anchor | σαλάτα    | salad               | 0.5838 | Menu anchor with simple repeated alpha pattern                         |
| anchor | οδός      | street / road       | 0.5690 | Street-sign payoff and final sigma practice                            |
| anchor | στάση     | stop / station      | 0.5666 | Transit signage anchor and final eta-as-i spelling                     |
| anchor | ταξί      | taxi                | 0.5286 | High traveler utility; introduces xi cluster and final accented i      |
| anchor | όχι       | no                  | 0.5266 | High utility and chi practice; pronunciation needs review              |
| anchor | έξοδος    | exit                | 0.5258 | Essential public-sign word but adds xi and final-sigma load            |
| anchor | είσοδος   | entrance            | 0.5182 | Pairs naturally with έξοδος and teaches ει plus final sigma            |
| anchor | γάλα      | milk                | 0.4994 | Useful food anchor and gamma pronunciation checkpoint                  |
| anchor | κοτόπουλο | chicken             | 0.4870 | High menu utility; long but excellent review of omicron/ou             |
| anchor | μουσείο   | museum              | 0.4678 | Cultural-site anchor with ου and ει                                    |
| anchor | φαρμακείο | pharmacy            | 0.4478 | Essential public-facility word but long and digraph-heavy              |
| anchor | ψωμί      | bread               | 0.4298 | Very useful food anchor but psi and omega make it later-stage          |
| anchor | προσοχή   | caution / attention | 0.4210 | Important warning-sign anchor; defer until enough consonants are known |
| anchor | ανοιχτό   | open                | 0.4154 | Common shop sign word but diphthong and chi load make it later         |
| anchor | κλειστό   | closed              | 0.4126 | Pairs with ανοιχτό and teaches ει plus consonant cluster               |

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
