# Curriculum Authoring Tools

Glyphin's first curriculum tools are offline authoring helpers. They create
reviewable files, validate course manifests, score hand-entered candidates, and
generate review packets. They do not download corpora, call external services,
write to Supabase, or publish runtime lessons.

## Commands

Create a starter workspace for a future course:

```sh
pnpm curriculum:scaffold japanese-kana-v1 --name "Japanese Kana" --language-tag ja-Jpan --script Jpan
```

Reuse an existing tracker or skip tracker creation when a planning file already
exists:

```sh
pnpm curriculum:scaffold japanese-kana-v1 --name "Japanese Kana" --language-tag ja-Jpan --script Jpan --tracker .ai/curriculum/japanese-kana.md
pnpm curriculum:scaffold japanese-kana-v1 --name "Japanese Kana" --language-tag ja-Jpan --script Jpan --tracker none
```

Validate a course manifest:

```sh
pnpm curriculum:validate docs/curriculum/japanese-kana-v1/manifest.json
```

Score hand-entered anchor or grapheme candidates:

```sh
pnpm curriculum:score docs/curriculum/japanese-kana-v1/anchor-candidates.csv
pnpm curriculum:score docs/curriculum/japanese-kana-v1/grapheme-candidates.csv
```

Generate a review packet from the manifest and scored anchor candidates:

```sh
pnpm curriculum:review docs/curriculum/japanese-kana-v1 --force
```

## Scaffolded Files

The scaffold command creates these files:

- `.ai/curriculum/<course-id>.md`: central course tracker.
- `docs/curriculum/<course-id>/manifest.json`: machine-validated source and
  course manifest.
- `docs/curriculum/<course-id>/sources.csv`: source inventory and license notes.
- `docs/curriculum/<course-id>/grapheme-candidates.csv`: manual grapheme
  scoring input.
- `docs/curriculum/<course-id>/anchor-candidates.csv`: manual anchor scoring
  input.
- `docs/curriculum/<course-id>/lesson-sequence.md`: staged implementation
  outline for anchors, new units, rules, practice-target counts, review units,
  and drill focus.
- `docs/curriculum/<course-id>/review-packet.md`: generated reviewer handoff.
- `docs/curriculum/<course-id>/db-ingestion-strategy.md`: starter strategy for
  moving reviewed data into `curriculum.*` and `delivery.*`.
- `docs/curriculum/<course-id>/<course-id>.md`: durable course note for
  sequencing rationale, validation notes, and other seed-source decisions.
- `docs/curriculum/<course-id>/questions.md`: unresolved architecture, product,
  source, reviewer, licensing, or app-expansion decisions that research cannot
  safely answer during bootstrap.

Use the split intentionally: `.ai/curriculum/` is for active curriculum tracking
only, while `docs/curriculum/<course-id>/` is the durable home for bootstrap
artifacts that will inform future DB seeding and publication work.

The generated DB strategy intentionally stays Markdown. It should be reviewed
before any seed generator, SQL migration, or publication helper is written.

The scaffold command warns when it sees a tracker-like file in
`.ai/curriculum/`. Use `--tracker <path>` to reuse a known tracker or
`--tracker none` when a separate task file already owns planning.

## Bulk Bootstrap Workflow

For broad writing-system batches, treat scaffolded files as an artifact contract
rather than as final lesson content.

1. Choose a conservative v1 boundary with one language, script, audience, and
   target-domain profile.
2. Scaffold the course workspace.
3. Fill `manifest.json` and `sources.csv` from researched, license-audited
   sources.
4. Validate the manifest with `pnpm curriculum:validate`.
5. Fill grapheme and anchor candidate CSVs with reviewed or clearly marked
   manual-estimate values.
6. Score both candidate files with `pnpm curriculum:score`.
7. Draft `lesson-sequence.md` from the highest-payoff candidates and cognitive
   load constraints in the authoring framework.
8. Generate `review-packet.md` with `pnpm curriculum:review`.
9. Record unresolved app, database, product, source, or reviewer decisions in
   `questions.md`.

The batch is review-ready when every in-scope course has the artifact set above,
automated validation has passed, and any remaining implementation blockers are
explicitly documented.

## Candidate Scoring

The score command implements the formulas from the
[curriculum authoring framework](./authoring-framework.md). It accepts CSV rows
with `candidate_type` set to `anchor` or `grapheme`, appends
`candidate_score` and `score_band`, and writes a sorted `.scored.csv` file.

All scoring fields are numbers from `0` to `1`. Penalties are also numbers from
`0` to `1` and are subtracted from the weighted score. The score is an authoring
signal, not an automatic lesson decision.

The score command validates that every required numeric scoring column exists
for the inferred candidate type and reports row-specific errors when a numeric
field contains free text. Keep penalty columns before the free-text `notes`
column so malformed rows fail clearly instead of shifting note text into a
penalty field.

## Manifest Validation

The manifest validator checks:

- required course, language, script, normalization, segmentation, source, DB, and
  review fields;
- lowercase kebab-case course IDs;
- known source-use values: `discovery_only`, `scoring_only`, `scoring`, and
  `shipped_content`;
- source domain weights from `0` to `1`;
- license clarity before anything is marked as shipped content.

Unknown licenses are allowed for discovery-only research but should be resolved
before scoring or authoring learner-visible content.

## Corpus Analysis Strategy

Do not build a full corpus-analysis pipeline first. For widely used writing
systems, good prior work already exists: precomputed word frequencies,
segmentation tools, dictionaries, treebanks, and national corpora often cover the
hardest parts.

Recommended order:

1. Start with precomputed sources: `wordfreq`, Leipzig, language-specific
   frequency lists, Unicode/CLDR inventories, Wiktionary, and established learner
   lists.
2. Add language-specific tokenizers only when the target script needs them:
   MeCab or Sudachi for Japanese, CAMeL Tools for Arabic, PyThaiNLP for Thai,
   KoNLPy or mecab-ko for Korean, Indic NLP tools for Indic scripts.
3. Use domain samples to validate rankings rather than to build a giant corpus:
   menus, signs, packaging, transit maps, OpenStreetMap names, Open Food Facts,
   Wikivoyage, or licensed image/text samples.
4. Build custom corpus ingestion only when existing sources disagree, fail a
   target domain, or do not cover the script.

The deferred Unicode inventory probe should come with the corpus-analysis pass.
It can inspect sample text for scripts, code points, grapheme clusters,
normalization differences, and mixed-script behavior before any tokenizer-specific
adapter is added.

## Existing Corpus And Frequency Tools

Useful off-the-shelf options by need:

| Need                               | Existing tools or sources                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Cross-language word frequency      | `wordfreq`, Leipzig Corpora Collection, OPUS, OSCAR, Wikimedia dumps                                            |
| Unicode inventory and segmentation | Unicode UAX #29, CLDR, ICU BreakIterator, `Intl.Segmenter`, Python `regex`                                      |
| Tokenization and morphology        | Universal Dependencies, Stanza, spaCy, UDPipe, CAMeL Tools, PyThaiNLP, MeCab, Sudachi, KoNLPy                   |
| Japanese writing system            | BCCWJ resources, MeCab, Sudachi, JMdict, KANJIDIC2, Joyo and Kyoiku kanji lists                                 |
| Chinese characters                 | SUBTLEX-CH-style lists, Unihan, CC-CEDICT, jieba, pkuseg, Wikimedia dumps                                       |
| Korean Hangul                      | Sejong-style resources, KoNLPy, mecab-ko, Universal Dependencies, Wiktionary                                    |
| Arabic script                      | CAMeL Tools, Buckwalter-style transliteration resources, Tashkeela, Quranic Arabic corpora, Arabic UD treebanks |
| Indic scripts                      | Indic NLP Library, Aksharamukha, IndicXlit, IndicTrans2, Dakshina, AI4Bharat datasets                           |
| Low-resource languages             | Glottolog bibliographies, PHOIBLE, Lexibank, PanLex, UniMorph, OPUS, Tatoeba                                    |
| Environmental print                | OpenStreetMap, OpenAddresses, libpostal, Wikivoyage, Open Food Facts                                            |

Licenses vary widely. Treat most corpus outputs as scoring evidence until a
source is explicitly cleared for shipped examples.

## What To Defer

Defer these until a pilot course proves the need:

- corpus downloaders and crawlers;
- OCR for environmental-print photos;
- language-specific tokenizer wrappers;
- G2P or transliteration model integration;
- automated lesson sequencing;
- DB seed generation for non-Thai courses.

The current tools should get authors to a reviewed source manifest, ranked
candidates, and a concrete DB ingestion plan. That is the right amount of runway
before the next course is selected.

## Known Friction Points

These gaps were identified during the Korean Hangul bootstrap (2026-05-20) and
should be addressed before the next course:

### Duplicate tracker on scaffold

The scaffold command now supports `--tracker <path>` and `--tracker none`, and
warns when a tracker-like file already exists in `.ai/curriculum/`. Korean Hangul
still has two historical files: `korean-hangul.md` (bootstrap runbook, written by
hand) and `korean-hangul-v1.md` (scaffold output). Future scaffold runs should
reuse or skip tracker creation intentionally.

### No `jamo_position` field in grapheme candidates

The grapheme-candidates CSV has no way to declare the positional role of a
grapheme: initial consonant (choseong), vowel (jungseong), or final consonant
(jongseong). This matters critically for Hangul because ㅇ behaves as a silent
placeholder as an initial but as the ng sound as a final — they are the same
glyph but completely different pedagogical units. The workaround is to document
position in the `notes` column, but that is invisible to the scorer.

Proposed fix: add an optional `jamo_position` column (values: `initial`,
`vowel`, `final`, `any`) to the grapheme candidate schema. Document it in the
Hangul-specific authoring notes in `authoring-framework.md`.

### Manual scoring and `source_confidence`

The scoring CSV has no automated pathway to populate frequency columns from a
real corpus. For a bootstrap pass, all scores are hand-entered estimates.
The `source_confidence` field is the correct place to encode this uncertainty —
set it to `0.4`–`0.5` for manual estimates and `0.8`–`1.0` for corpus-backed
values. Document this convention explicitly so reviewers know how to interpret
score bands on a manual-estimate pass.

Score bands on a bootstrap pass are **relative rankings, not absolute quality
judgments**. A "weak" anchor word (e.g., 화장실) is still an essential lesson
anchor — it just has a high `new_load_penalty` that appropriately delays it to
Stage 2+.

### CSV column order sensitivity

Penalty columns must appear in the exact order declared in the CSV header.
During the Korean Hangul bootstrap, a descriptive notes string was accidentally
placed in the `new_load_penalty` column, causing the score command to fail with
a numeric parse error. The fix is to always write penalty values before any
free-text `notes` field. The score command now validates required scoring
columns and reports the offending row, candidate, and numeric column when a value
cannot be parsed.

### Penalty weight calibration

Grapheme penalties are subtracted as absolute values from the weighted score.
A `confusability_penalty` of `0.10` plus `irregularity_penalty` of `0.05` drops
a consonant with an otherwise strong 0.64 raw score below the 0.50 "promising"
threshold. For ㅂ and ㄷ — common Korean consonants with well-known aspirated
counterparts — this pushes them into "weak" despite being required for core
target-domain vocabulary (밥, 버스, etc.). Consider either (a) reducing default
penalty magnitudes for widely common graphemes or (b) treating confusability as
a soft sequencing constraint ("teach after its pair") rather than a score
reducer.

### Runtime type names

`Word.thai` and `SyllableBreakdown.thai` in `src/lib/data/types.ts` are
Thai-specific field names. Before Korean lesson content can be added to the
app, these must be renamed to a language-agnostic field (e.g., `text`), with
all references in `src/lib/data/thai.ts` updated accordingly. This rename is
tracked as an engineering follow-up and was intentionally deferred from the
bootstrap task.

## Cross-Course Lessons

The Korean Hangul bootstrap surfaced several rules that should apply to future
curriculum work, not just to Hangul.

- Set the course boundary with standards-based identifiers before authoring
  begins. Use the right language tag, script code, and explicit scope so the
  course does not drift into region, script, or variant assumptions later.
- Bootstrap first and automate later. A validated manifest, source inventory,
  candidate scoring pass, review packet, and DB strategy are enough to expose
  real gaps before heavier corpus or publication tooling is justified.
- Treat pedagogical units and Unicode or rendering units as separate layers.
  Storage text, visible glyphs, grapheme clusters, and teachable units are often
  different things.
- Expect script-specific extensions. The shared pipeline should stay general,
  but it must allow fields or notes that capture script-specific pedagogy when a
  generic schema is too coarse.
- Treat bootstrap scores as relative sequencing signals, not absolute truth.
  Manual estimates are acceptable early on, but uncertainty should be visible
  through fields such as `source_confidence` and reviewer notes.
- Use penalties carefully. A high penalty can mean "teach later" rather than
  "low value," so the scoring model should not bury essential high-frequency
  units just because they are confusable or irregular.
- Validate authoring inputs as early as possible. CSV headers, numeric columns,
  and schema expectations should fail fast with clear errors instead of letting a
  malformed row break scoring later.
- Expect the first non-Thai course to reveal product-generalization work. When a
  curriculum exposes Thai-specific names or assumptions in the app model, treat
  that as shared engineering work, not a one-off course quirk.
- Keep tracking and durable documentation separate. Active curriculum planning
  belongs in `.ai/curriculum/`; reusable outputs from a bootstrap pass belong in
  `docs/curriculum/` once they are stable enough to outlive the task.
- Keep source licensing conservative by default. Corpus outputs and reference
  materials may be useful for scoring long before they are safe to quote or ship
  in learner-facing content.
