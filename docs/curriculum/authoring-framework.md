# Curriculum Authoring Framework

This guide defines how Glyphin should design curricula for unfamiliar writing
systems. It generalizes the Thai course strategy into a repeatable workflow for
real and fictional scripts while preserving the app's core promise: learners
decode useful text quickly through real words, high-yield graphemes, concise
rules, and short deterministic drills.

Use this document when starting a new course, evaluating candidate words, or
designing offline tooling for curriculum authors. The durable pedagogy still
lives in [learning-philosophy.md](../concept/learning-philosophy.md), the product
contract still lives in [app-philosophy.md](../app-philosophy.md), and the Thai
reference course still lives in [thai.md](./thai.md).

## Core Commitments

- Teach for decoding payoff, not native chart order.
- Anchor every lesson to one real word or tightly related real-world reading
  target.
- Introduce only the smallest new set needed to decode the anchor.
- Treat Unicode text, script behavior, pronunciation, and teachable graphemes as
  related but separate layers.
- Validate each stage against environmental print or an equivalent target text
  domain.
- Keep curriculum facts in serializable data and keep tooling outputs reviewable
  by humans.
- Require license and attribution review before any third-party source affects
  shipped content.

## Working Vocabulary

- **Course**: one language context, one script system, and one ordered
  curriculum. A course may target a standard language-script pair, a historic
  script, or a fictional glyph system.
- **Target domain**: the text the learner should be able to read first, such as
  restaurant menus, transit signs, packaging, public warnings, subtitles, or an
  in-world fictional corpus.
- **Corpus slice**: a documented set of text sources used to estimate frequency
  and coverage for a target domain.
- **Grapheme cluster**: a user-perceived Unicode character boundary, usually
  identified with Unicode UAX #29, ICU BreakIterator, `Intl.Segmenter`, or
  Python `regex` `\X`.
- **Pedagogical grapheme**: the smallest teachable unit surfaced in Glyphin.
  It may be a code point, grapheme cluster, diacritic, vowel sign, akshara part,
  Hangul jamo group, Han component, logogram, syllabogram, or fictional glyph.
- **Anchor word**: the one real-world word or reading target that drives a
  lesson.
- **Support word**: a secondary word used for examples or drills, preferably made
  from already taught graphemes plus the lesson's new material.
- **Rule**: a concise recurring orthographic or phonetic pattern that explains
  why the anchor is readable and pays off later.
- **Coverage**: the share of a target corpus that a learner can decode after a
  known set of graphemes, rules, and words.

## Authoring Outputs

Every new course should produce these artifacts before implementation:

1. **Course prospectus**: language, script, audience, target domains, course
   boundaries, directionality, normalization, segmentation profile, review plan,
   and risk notes.
2. **Source manifest**: corpora, dictionaries, frequency lists, transliteration
   tools, audio or pronunciation references, license status, attribution
   requirements, and source-quality notes.
3. **Script inventory**: Unicode ranges, CLDR exemplar characters when
   available, pedagogical graphemes, confusables, positional forms, combining
   marks, directionality, shaping behavior, font requirements, and rendering
   risks.
4. **Frequency report**: word, lemma, grapheme, grapheme-pair, syllable, rule,
   and target-domain coverage summaries.
5. **Lesson sequence**: ordered anchors, new graphemes, rules, core practice
   targets, extension practice targets, review items, drills, and coverage
   deltas.
6. **Validation packet**: coverage thresholds, native or expert review notes,
   license sign-off, sample target texts, pronunciation checks, and known gaps.

Task-scoped planning belongs in `.ai/`. Durable decisions and reusable authoring
guidance belong in `docs/`.

## Pipeline

### 1. Define the Course Boundary

Start with the learner's first practical reading win, not with the writing
system's full inventory.

- Identify the language and script with BCP 47 language tags and ISO 15924 script
  codes when applicable.
- Name the target learner and first-use setting: traveler, heritage learner,
  fandom reader, liturgical reader, researcher, or general beginner.
- Pick two to four target domains for early validation.
- Decide what is out of scope for v1: handwriting, calligraphy, rare historic
  forms, full grammar, production, audio, advanced spelling, or dialectal forms.

Examples:

- Thai v1 targets menus, signs, prices, transit labels, and food words.
- A Japanese kana v1 might target station names, menu categories, convenience
  store labels, and common particles.
- A fictional-script v1 might target official signage, faction names, map labels,
  spell names, or a licensed public-domain sample corpus.

### 2. Establish Script Metadata

Record facts that will affect segmentation, rendering, and lesson design.

- Direction: left-to-right, right-to-left, top-to-bottom, boustrophedon, or mixed.
- Unicode status: encoded, partly encoded, private-use, image-only, font-only, or
  custom glyph system.
- Normalization: NFC, NFD, NFKC, NFKD, compatibility folding, accent stripping, or
  no folding.
- Case and width behavior: uppercase, lowercase, titlecase, full-width,
  half-width, presentation forms.
- Joining and shaping: Arabic-style contextual forms, Indic conjuncts, ligatures,
  virama behavior, or font-specific substitutions.
- Word boundaries: whitespace-delimited, dictionary-segmented, syllable-based,
  phrase-based, or unsegmented.
- Pronunciation layer: phonemic, morphophonemic, opaque, optional, or unavailable.

This metadata prevents tooling from assuming that code points, visible glyphs,
native letters, and teachable units are the same thing.

### 3. Build the Script Inventory

Start broad, then narrow to a teachable v1 inventory.

Use Unicode Script and Block data, CLDR exemplar characters, native educational
materials, dictionaries, grammars, and corpus observations to identify:

- Core graphemes.
- Combining marks and diacritics.
- Vowels, matres lectionis, tone marks, vowel signs, or syllable modifiers.
- Logograms, radicals, components, determinatives, or semantic-phonetic pieces.
- Digraphs, ligatures, conjuncts, and multi-code-point graphemes.
- Numerals, punctuation, currency symbols, and common signage marks.
- Near look-alikes and confusable forms.
- Rare, obsolete, sacred, historic, stylistic, or allographic forms.

Then map this inventory into pedagogical graphemes. The pedagogical inventory is
the one the learner sees; it should be smaller and more purposeful than the raw
Unicode inventory.

### 4. Collect Sources and Licenses

Prefer sources that match the course's target domain and can be audited. Keep a
source manifest with license status before using any dataset in scoring or
content generation.

Use at least three source layers when possible:

- A broad corpus for baseline word and grapheme frequency.
- A domain corpus for environmental-print relevance.
- A lexicon, dictionary, or expert list for glosses, pronunciations, lemmas, and
  morphology.

Never assume that a dataset is safe to ship just because it is downloadable. Some
sources are useful for analysis only; app content should be authored, attributed,
or licensed explicitly.

### 5. Normalize and Segment Text

Run every corpus through a documented normalization profile before counting.

Recommended baseline:

1. Decode as UTF-8 and repair obvious mojibake with tools such as `ftfy` when
   appropriate.
2. Normalize to NFC unless a script-specific reason requires another form.
3. Preserve original text and normalized text side by side for auditability.
4. Segment into sentences, words, grapheme clusters, and pedagogical graphemes.
5. Filter boilerplate, duplicates, non-target scripts, spam, and machine-garbage
   text.
6. Store counts with corpus and domain provenance.

Use Unicode UAX #29, ICU BreakIterator, and `Intl.Segmenter` as a first pass.
Use language-specific segmenters when dictionary or morphology support matters,
especially for Chinese, Japanese, Thai, Lao, Khmer, Burmese, Korean, Arabic,
Indic languages, and scripts without whitespace word boundaries.

### 6. Count Frequency and Coverage

Count more than characters.

- Word token frequency: how often a surface word appears.
- Lemma or normalized-form frequency: how common the underlying lexical item is.
- Type frequency: how many distinct words use a grapheme, component, rule, or
  pattern.
- Grapheme frequency: raw occurrence of pedagogical graphemes.
- Pair and sequence frequency: common digraphs, aksharas, syllables, jamo blocks,
  radicals, final consonants, vowel frames, and tone patterns.
- Rule frequency: how often an orthographic or phonetic rule explains observed
  words.
- Domain frequency: how often an item appears in the selected target domains.
- Coverage gain: the additional share of target-domain text unlocked by teaching
  this item now.

Use log-scaled frequency so the top few words do not dominate every decision.
For a count `c`, a simple normalized frequency feature is:

```text
freq_norm(item) = log(1 + c(item)) / log(1 + max_count_in_source)
```

When combining sources, weight them by target relevance and quality:

```text
weighted_freq(item) = sum(source_weight(s) * freq_norm(item, s))
```

Domain corpora should usually outweigh general web corpora for early lesson
selection.

### 7. Score Graphemes

Raw grapheme frequency is only one feature. Score each candidate pedagogical
grapheme with a weighted model that can be tuned per course.

```text
grapheme_score =
  0.30 * corpus_frequency +
  0.20 * distinct_word_coverage +
  0.15 * domain_coverage_gain +
  0.10 * anchor_availability +
  0.10 * pronunciation_clarity +
  0.10 * rule_gateway_value +
  0.05 * visual_distinctiveness -
  penalties
```

Suggested penalties:

- `confusability_penalty`: strong visual similarity to taught or untaught forms.
- `load_penalty`: positional variants, combining complexity, or multiple sounds.
- `irregularity_penalty`: opaque mapping that cannot yet be explained.
- `font_penalty`: rendering or font availability risk.
- `license_penalty`: uncertain source provenance for examples.

For early lessons, favor graphemes with high domain coverage, many simple anchor
words, clear pronunciation, and low visual confusion. Save high-frequency but
opaque forms until learners have enough scaffolding.

### 8. Score Anchor Words

An anchor word is strong when it is common, useful, decodable soon, and teaches a
reusable pattern. It is weak when it adds too much new material or only matters
because it is frequent in a mismatched corpus.

```text
anchor_score =
  0.22 * weighted_word_frequency +
  0.18 * real_world_utility +
  0.16 * coverage_gain +
  0.14 * decodability +
  0.10 * rule_payoff +
  0.08 * pronunciation_clarity +
  0.06 * review_value +
  0.04 * memorability +
  0.02 * source_confidence -
  penalties
```

Define the features consistently:

- `weighted_word_frequency`: log-scaled word, lemma, and domain frequency.
- `real_world_utility`: likelihood the learner will see the word in the target
  domain.
- `coverage_gain`: additional target-domain text unlocked after this lesson.
- `decodability`: share of the anchor already covered by taught graphemes and
  explainable new material.
- `rule_payoff`: how often the lesson's rule recurs in later candidate words.
- `pronunciation_clarity`: availability and reliability of pronunciation or G2P.
- `review_value`: how well the word reuses prior graphemes without feeling stale.
- `memorability`: semantic concreteness, visual context, cultural salience, or
  immediate learner payoff.
- `source_confidence`: corpus quality, dictionary agreement, and reviewer trust.

Suggested penalties:

- `new_load_penalty`: too many new graphemes, rules, or chunks.
- `irregularity_penalty`: spelling or pronunciation requires exceptions that are
  not yet teachable.
- `ambiguity_penalty`: unclear segmentation, homograph overload, or misleading
  gloss.
- `sensitivity_penalty`: offensive, sacred, politically risky, adult, or
  culturally inappropriate material for a beginner lesson.
- `license_penalty`: unclear right to reproduce examples or source text.

Frequency can nominate anchors; the weighted score decides whether they belong
early.

### 9. Sequence Lessons

Build the course as a constrained optimization problem, then let authors make the
final call.

For each lesson candidate, calculate:

- New grapheme count.
- New rule count.
- New visual-confusion families.
- Review graphemes reused.
- Support words available.
- Anchor score.
- Coverage gain on each target domain.

Recommended v1 constraints:

- Lessons 1-5: two to five new pedagogical graphemes, zero to one new rule, and
  one strong anchor.
- Early core practice should reuse already taught material plus the lesson's new
  material.
- Every lesson should target at least ten core practice reads. Later lessons
  should also carry an optional extension set when the decodable pool is large
  enough.
- Nonsense targets are allowed only as clearly tagged sound-only decoding
  practice when the real word and phrase pool is too small.
- Avoid introducing two visually confusable forms in the same lesson unless the
  lesson's explicit purpose is discrimination.
- Put blocked practice inside the lesson and interleaved review across later
  lessons.
- Introduce irregular or culturally loaded forms only when the learner has enough
  known material to notice what is irregular.
- Prefer one high-payoff rule over a complete theoretical matrix.

The sequencer should suggest orders, not own pedagogy. Human authors should be
able to override a score when the override is documented.

### 10. Validate the Course

Validate each stage against the target domains, not against completion of a
script chart.

Minimum checks:

- Coverage increases meaningfully after each stage.
- Every new grapheme is introduced exactly once.
- Every anchor has a real-world context note.
- Every rule has examples and later payoff.
- Every drill targets a specific competence: recognition, mapping, sound, or
  visual discrimination.
- Distractors are plausible and not random filler.
- Native or expert review confirms segmentation, glosses, pronunciation, and
  cultural tone.
- License review confirms what can be stored, attributed, displayed, or used only
  internally for scoring.

Useful coverage targets vary by script, but each course should define thresholds
like this:

| Stage         | Target outcome                                                        |
| ------------- | --------------------------------------------------------------------- |
| First session | Learner decodes several real words from a target domain.              |
| Early stage   | Learner recognizes the highest-payoff graphemes and rules.            |
| Middle stage  | Learner reads common signs, labels, or short lines with support.      |
| Late stage    | Learner handles common irregularities, variants, and mixed text.      |
| v1 complete   | Learner can decode a meaningful share of selected real-world samples. |

Coverage is a design signal, not a replacement for review by people who know the
language, script, and learner context.

## Source Catalog

Treat this as a starting map, not an automatic approval list.

| Category                | Sources and Tools                                                                | Best Use                                                         | Notes                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Word frequency          | `wordfreq`, Leipzig Corpora Collection, language-specific frequency lists        | Baseline high-frequency word candidates                          | Check domains and licenses; web frequency may not match environmental print.  |
| Large corpora           | OPUS, OSCAR, Common Crawl derivatives, Wikimedia dumps, mC4-style sources        | Broad frequency and language coverage                            | Web corpora need quality audits, language-ID checks, and copyright caution.   |
| Parallel corpora        | OPUS, FLORES-200, NLLB-related data, Tatoeba, Global Voices                      | Examples, translation checks, low-resource discovery             | Translation corpora are not always natural target-domain text.                |
| Treebanks               | Universal Dependencies, Stanza models, UDPipe                                    | Tokenization, lemmas, morphology, POS                            | Coverage depends on available language treebanks.                             |
| Language identity       | BCP 47, ISO 15924, Glottolog                                                     | Course identifiers and source disambiguation                     | Glottolog is especially useful for low-resource language bibliographies.      |
| Unicode metadata        | Unicode UAX #24, UAX #29, CLDR/LDML, ICU                                         | Script boundaries, segmentation, exemplar characters, transforms | Use as infrastructure, not pedagogy by itself.                                |
| Lexicons                | Wiktionary, PanLex, Wikidata Lexemes, Lexibank                                   | Glosses, pronunciations, translations, alternate forms           | Wiktionary and some lexicons require attribution and share-alike care.        |
| Morphology              | UniMorph, UD features, CAMeL Tools, spaCy, Stanza                                | Inflection-aware word selection and lemmatization                | Important for highly inflected languages.                                     |
| Phonology               | PHOIBLE, PanPhon, grammars, pronunciation dictionaries                           | Sound inventories, contrast drills, pronunciation checks         | Use expert review for language-specific phonology.                            |
| Transliteration and G2P | Epitran, uroman, Aksharamukha, Indic NLP Library, IndicXlit                      | IPA, romanization, script conversion, fallback pronunciation     | G2P is uneven for opaque orthographies and unvowelized scripts.               |
| Language-specific NLP   | PyThaiNLP, MeCab, Sudachi, KoNLPy, CAMeL Tools, Indic NLP Library                | Tokenization and morphology for hard-to-segment scripts          | Prefer maintained tools and document dictionary versions.                     |
| Speech and audio        | Common Voice, Forvo-style references, native recordings, PHOIBLE                 | Pronunciation and audio validation                               | License and voice consent matter before app use.                              |
| Environmental print     | Photos, menus, transit maps, packaging, public signs, official forms             | Domain validation and anchor context                             | Store provenance and avoid copyrighted images unless licensed.                |
| Fictional systems       | Official guides, public-domain works, permissive fan resources, invented corpora | In-world frequency and phrase selection                          | Rights review is mandatory; avoid shipping protected text without permission. |

## Source Quality Rubric

Score every source before relying on it.

```text
source_weight =
  0.25 * domain_match +
  0.20 * license_clarity +
  0.15 * language_id_quality +
  0.15 * corpus_cleanliness +
  0.10 * recency +
  0.10 * reviewer_trust +
  0.05 * tooling_accessibility
```

Do not use a low license-clarity source to generate shipped text. It may still
be useful for rough frequency intuition if the manifest marks it as analysis
only.

## Writing-System Playbooks

### Alphabets

Examples include Greek, Cyrillic, Georgian, Armenian, Latin extensions, and many
modern orthographies.

- Count letters, digraphs, diacritics, grapheme clusters, and sound mappings.
- Early anchors should favor stable one-to-one correspondences and frequent
  signs or labels.
- Watch for case, cursive forms, stress marks, palatalization, silent letters,
  and digraphs that learners perceive as units.

### Abjads

Examples include Arabic, Hebrew, Syriac, and related scripts.

- Treat consonant letters, vowel marks, matres lectionis, shaping forms, and
  ligatures separately.
- Early lessons should use fully explainable, high-frequency words and common
  sign forms; do not assume learners can infer unwritten vowels.
- Use morphology-aware tokenization and expert pronunciation review.
- Teach directionality, joining, and word shape without turning the course into a
  handwriting class.

### Abugidas and Akshara Systems

Examples include Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam, Thai,
Lao, Khmer, and Ethiopic-style systems with related behavior.

- Map consonant bases, inherent vowels, vowel signs, virama behavior, conjuncts,
  tone marks, and positional signs.
- Count both visible clusters and pedagogical parts.
- Sequence by high-payoff consonant-vowel frames before rare conjuncts or
  low-payoff variants.
- Use script conversion tools cautiously; conversion is not the same as
  pronunciation.

### Syllabaries

Examples include kana, Cherokee, Vai, Yi, and many historic syllabaries.

- Count syllabograms and syllable frequency, not alphabetic components unless
  the script has teachable internal structure.
- Early anchors should reuse a small syllabogram set across many useful words.
- Watch for voiced marks, small signs, archaic symbols, and mixed-script text.

### Featural Alphabets

Hangul is the primary modern example.

- Teach jamo features and syllable-block composition together.
- Count jamo, blocks, batchim finals, and syllable frequency.
- Early anchors should exploit transparent composition while avoiding too many
  final consonant rules at once.
- Use visual composition drills because block layout is part of decoding.

### Morphosyllabic and Logosyllabic Systems

Examples include Chinese Hanzi, Japanese Kanji, and historic systems with
semantic and phonetic components.

- Count characters, words, radicals/components, phonetic series, readings, and
  domain phrases.
- Use word and phrase frequency heavily; raw character frequency can overteach
  abstract function characters too early.
- Sequence components when they unlock many future characters, but keep anchors
  as real words.
- Treat multiple readings, simplified/traditional variants, stroke forms, and
  homophones as explicit risks.

### Mixed Systems

Examples include Japanese, Korean with Hanja, Hindustani across Devanagari and
Perso-Arabic, and many modern multilingual sign environments.

- Define which scripts are in scope for each course version.
- Segment and score each script separately, then score mixed-script anchors by
  real-world utility.
- Teach script-switching as a pattern when learners will see it in the wild.
- Avoid making the first course solve the whole language ecology.

### Historic and Liturgical Scripts

Examples include Egyptian hieroglyphs, cuneiform traditions, Linear B, Gothic,
Old Church Slavonic, and liturgical variants.

- Be explicit about whether the goal is transliteration, pronunciation,
  inscription recognition, manuscript reading, or scholarly sign values.
- Source from public-domain editions, museum data, academic corpora, and expert
  grammars where licensing allows.
- Accept that frequency may be corpus-specific rather than living-language
  frequency.
- Use facsimile and glyph-form variation review where rendering differs by hand,
  era, or medium.

### Fictional and Constructed Glyph Systems

Examples include invented alphabets, game scripts, cinematic signage, conlang
orthographies, and private-use glyph collections.

- Start with a rights review. Official franchise text, fonts, and images may be
  protected even when fan documentation is public.
- Prefer public-domain, permissively licensed, creator-owned, or user-provided
  corpora.
- If the system has too little text for frequency, weight in-world salience,
  canonical signs, map labels, faction names, and learner motivation more
  heavily.
- If no pronunciation exists, define whether the course teaches transliteration,
  symbol recognition, or an authored reading convention.
- Keep provenance clear so shipped examples can be removed or replaced if rights
  change.

## Tool Design

The first generation of tools should be offline authoring tools, not runtime
dependencies. They should produce reviewable JSON, Markdown, and CSV artifacts
that curriculum authors can inspect before anything enters app data.

Recommended modules:

- **Source manifest validator**: checks required metadata, license fields,
  attribution, source weights, and analysis-only flags.
- **Corpus normalizer**: repairs encoding problems, applies normalization,
  filters boilerplate, stores source provenance, and emits clean text.
- **Segmenter profile runner**: applies Unicode, ICU, `Intl.Segmenter`, Python
  `regex`, or language-specific tokenizers according to course metadata.
- **Inventory builder**: merges Unicode, CLDR, lexicon, and corpus observations
  into a proposed pedagogical grapheme list.
- **Frequency analyzer**: computes word, lemma, grapheme, pair, syllable,
  component, rule, and domain counts.
- **Candidate scorer**: applies grapheme and anchor formulas with configurable
  weights and visible penalties.
- **Lesson sequencer**: proposes lesson orders under cognitive-load constraints
  and records why alternatives were rejected.
- **Coverage validator**: measures known-grapheme, known-word, and rule coverage
  against target-domain text after each lesson.
- **Review packet generator**: produces human-readable files for native speakers,
  subject-matter experts, legal review, and curriculum authors.

### Suggested Manifest Shape

```yaml
course_id: thai-reading-v1
language_tag: th-Thai
script: Thai
target_domains:
  - menus
  - transit
  - public_signage
normalization:
  unicode_form: NFC
  preserve_original: true
segmentation:
  baseline: unicode_uax_29
  word_segmenter: pythainlp
sources:
  - id: thai_menu_samples
    kind: environmental_print
    license: internal_review_required
    use: scoring_only
    domain_weight: 0.9
  - id: wordfreq_th
    kind: frequency
    license: package_license_reviewed
    use: scoring
    domain_weight: 0.4
review:
  native_speaker_required: true
  pronunciation_required: true
  license_signoff_required: true
```

### Suggested Candidate Output

<!-- prettier-ignore-start -->

```json
{
  "anchor": "อาหาร",
  "gloss": "food",
  "newGraphemes": ["อ", "า", "ห", "ร"],
  "rules": ["silent_carrier", "long_aa_after_consonant"],
  "anchorScore": 0.84,
  "coverageGain": {
    "menus": 0.031,
    "public_signage": 0.012
  },
  "penalties": {
    "newLoad": 0.08,
    "irregularity": 0.02
  },
  "reviewNotes": ["High menu utility", "Needs explicit explanation of silent carrier behavior"]
}
```

<!-- prettier-ignore-end -->

## Review Gates

A course should not be implemented until these gates pass:

- **Pedagogy gate**: every lesson follows the learning-plus-practice contract,
  asks learners to read core and extension practice targets before revealing the
  answer, and improves decoding payoff.
- **Coverage gate**: stage-level coverage targets are measured against target
  corpora.
- **Segmentation gate**: tokenization and pedagogical grapheme mapping are
  reviewed for the script.
- **Pronunciation gate**: romanization, IPA, audio, or pronunciation notes are
  verified when the course claims sound mapping.
- **Culture gate**: anchors, mnemonics, examples, and drills are culturally safe
  and not misleading.
- **License gate**: shipped text, images, audio, fonts, and derived examples are
  approved for app use.
- **Engineering gate**: output data stays serializable, script-agnostic, and
  compatible with the current lesson contract or an explicitly approved schema
  change.

## Implementation Notes

- Prefer TypeScript for repo-integrated validators and export checks.
- Prefer Python adapters for NLP-heavy offline analysis when mature language
  tooling exists only in Python.
- Keep generated analysis artifacts out of runtime data until reviewed.
- Store source manifests and final authoring decisions with the task or course
  tracker.
- Keep per-language curriculum progress in `.ai/curriculum/<language>.md`.
- Update durable docs when a scoring rule, course boundary, or tooling contract
  becomes standard practice.

## Related Reading

- [learning-philosophy.md](../concept/learning-philosophy.md) for the research
  basis: usage-based learning, systematic grapheme-phoneme teaching,
  orthographic mapping, cognitive load, retrieval practice, and extensive
  reading.
- [app-philosophy.md](../app-philosophy.md) for product boundaries and the fixed
  lesson contract.
- [authoring-tools.md](./authoring-tools.md) for the first offline tooling slice,
  scaffolded files, and corpus-analysis guidance.
- [thai.md](./thai.md) for the current Thai frequency-first curriculum model.
- [database-dto-spec.md](../database-dto-spec.md) for the current delivery and
  DTO contract.

## Sources

These are useful starting points for curriculum research and tooling. Treat this
as a working bibliography, not blanket approval to ship derived content. Each
course still needs source-quality, license, attribution, and cultural review.

### Frequency and Corpora

- [wordfreq](https://github.com/rspeer/wordfreq): ready-made word-frequency
  estimates for many languages.
- [OPUS](https://opus.nlpl.eu/): large collection of open parallel corpora across
  hundreds of languages.
- [Leipzig Corpora Collection](https://wortschatz-leipzig.de/en/download/):
  comparable plain-text corpora with sentence and co-occurrence data.
- [OSCAR](https://oscar-project.org/): multilingual Common Crawl-derived corpus
  with language-specific subcorpora and quality caveats.
- [FLORES-200](https://github.com/facebookresearch/flores): professionally
  translated parallel benchmark covering 200 languages.
- [Common Crawl](https://commoncrawl.org/): raw web crawl source for large-scale
  corpus construction.
- [Wikimedia Dumps](https://dumps.wikimedia.org/): Wikipedia, Wiktionary, and
  related project dumps for many languages.
- [Tatoeba](https://tatoeba.org/): multilingual example sentences and
  translations.
- [Universal Dependencies](https://universaldependencies.org/): multilingual
  treebanks with tokenization, lemmas, morphology, and syntax.
- [UDHR Translations](https://www.ohchr.org/en/human-rights/universal-declaration/translations):
  short, comparable human-rights text in many languages.
- [Mozilla Common Voice](https://commonvoice.mozilla.org/): open speech dataset
  useful for pronunciation and audio coverage research.

### Unicode, Script Metadata, and Segmentation

- [Unicode Standard Annex #29](https://www.unicode.org/reports/tr29/): Unicode
  text segmentation, including grapheme, word, and sentence boundaries.
- [Unicode Standard Annex #24](https://www.unicode.org/reports/tr24/): Unicode
  script property and script classification guidance.
- [CLDR](https://cldr.unicode.org/): locale data, exemplar characters,
  transliteration transforms, numbering systems, and language metadata.
- [ICU Boundary Analysis](https://unicode-org.github.io/icu/userguide/boundaryanalysis/):
  BreakIterator behavior for character, word, line, and sentence boundaries.
- [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter):
  JavaScript locale-sensitive grapheme, word, and sentence segmentation.
- [Python regex](https://pypi.org/project/regex/): Unicode-aware regex package
  with `\X` grapheme-cluster matching and Unicode script properties.
- [ftfy](https://github.com/rspeer/python-ftfy): text cleanup library for
  mojibake and Unicode glitches in scraped corpora.
- [ISO 15924 Script Codes](https://unicode.org/iso15924/): standard script codes
  used in course identifiers and language-script tags.
- [IETF BCP 47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt): language-tagging
  standard for language, script, and region identifiers.

### Language Metadata, Typology, and Phonology

- [Glottolog](https://glottolog.org/): language, dialect, family, Glottocode,
  and bibliography catalog.
- [PHOIBLE](https://phoible.org/): cross-linguistic phonological inventories in
  Unicode IPA.
- [WALS](https://wals.info/): typological features for phonology, grammar, and
  lexical structure.
- [Lexibank](https://lexibank.clld.org/): standardized lexical datasets across
  many languages and concepts.
- [PanPhon](https://github.com/dmort27/panphon): IPA-to-articulatory-feature data
  and phonological distance tooling.

### Lexicons, Morphology, and Translation Aids

- [UniMorph](https://unimorph.github.io/): universal morphology schema and
  inflected-form datasets.
- [PanLex](https://panlex.org/): large lexical translation database for thousands
  of languages.
- [Wiktionary](https://www.wiktionary.org/): multilingual dictionary source for
  lemmas, pronunciations, inflections, and script variants.
- [Wikidata Lexemes](https://www.wikidata.org/wiki/Wikidata:Lexemes): structured
  lexical data connected to Wikidata entities.
- [Epitran](https://github.com/dmort27/epitran): orthography-to-IPA
  transliteration for many language-script pairs.
- [uroman](https://github.com/isi-nlp/uroman): broad-coverage universal
  romanization tool.
- [Aksharamukha](https://www.aksharamukha.com/): script converter and
  transliteration tooling for many Indic and historic scripts.

### Language-Specific NLP Tools

- [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp): Thai tokenization,
  romanization, IPA conversion, correction, and Thai language utilities.
- [MeCab](https://taku910.github.io/mecab/): Japanese morphological analyzer and
  tokenizer.
- [Sudachi.rs](https://github.com/WorksApplications/sudachi.rs): maintained
  Sudachi Japanese tokenizer and morphological analyzer.
- [KoNLPy](https://github.com/konlpy/konlpy): Python package for Korean natural
  language processing.
- [CAMeL Tools](https://github.com/CAMeL-Lab/camel_tools): Arabic NLP toolkit for
  preprocessing, morphology, dialect identification, and tagging.
- [Indic NLP Library](https://github.com/anoopkunchukuttan/indic_nlp_library):
  normalization, tokenization, syllabification, and script conversion for Indian
  languages.
- [spaCy](https://github.com/explosion/spaCy): multilingual tokenization,
  lemmatization, morphology, parsing, and NER.
- [Stanza](https://github.com/stanfordnlp/stanza): Stanford multilingual NLP
  pipelines for tokenization, lemmatization, morphology, parsing, and NER.

### Indic and Transliteration Resources

- [IndicXlit](https://github.com/AI4Bharat/IndicXlit): multilingual
  transliteration models and Aksharantar data for Indic languages.
- [IndicTrans2](https://github.com/AI4Bharat/IndicTrans2): open translation
  models, datasets, and benchmarks for 22 scheduled Indian languages.
- [AI4Bharat Datasets](https://ai4bharat.iitm.ac.in/datasets): Indic language
  corpora and benchmark releases.
- [Dakshina Dataset](https://github.com/google-research-datasets/dakshina):
  transliteration and text data for South Asian languages.

### Environmental Print and Real-World Text

- [OpenStreetMap](https://www.openstreetmap.org/): names, addresses, and map
  labels useful for signage and place-name validation.
- [OpenAddresses](https://openaddresses.io/): structured global address data.
- [OpenCage Address Formatting](https://github.com/OpenCageData/address-formatting):
  country-specific address-format templates.
- [libpostal](https://github.com/openvenues/libpostal): international address
  parsing, normalization, transliteration, and script detection.
- [Wikivoyage](https://www.wikivoyage.org/): travel-oriented place, phrase, and
  signage context across many destinations.
- [Open Food Facts](https://world.openfoodfacts.org/): multilingual packaging and
  product-label text, with license review required for downstream use.

### Historic, Specialist, and Public-Domain Text

- [Perseus Digital Library](https://www.perseus.tufts.edu/): classical texts,
  lexica, and morphology resources.
- [Internet Archive](https://archive.org/): scans and public-domain language
  learning, grammar, dictionary, and manuscript materials.
- [Project Gutenberg](https://www.gutenberg.org/): public-domain books useful for
  older-script and orthography research.
- [Endangered Languages Project](https://www.endangeredlanguages.com/): language
  documentation discovery and community resource pointers.
- [ELAR](https://www.elararchive.org/): endangered-language archive with access
  and license restrictions that must be checked per collection.
- [PARADISEC](https://www.paradisec.org.au/): Pacific and regional language
  archive with collection-specific access rules.

### Fictional and Constructed Writing Systems

- [ConScript Unicode Registry](https://www.kreativekorp.com/ucsur/): private-use
  code assignments for constructed scripts.
- [Omniglot](https://www.omniglot.com/): writing-system overviews, including many
  constructed and fictional scripts; use as orientation, not a licensing source.
- [The Language Creation Society](https://conlang.org/): conlang resources,
  creators, and documentation pointers.
- Official creator guides, licensed franchise references, and creator-provided
  corpora remain the safest sources for fictional scripts. Always confirm rights
  before storing examples, fonts, images, or derived lesson text.
