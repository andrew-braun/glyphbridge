# Task: Curriculum Authoring Framework

- Start date: 2026-05-19
- Owner: GitHub Copilot
- Status: done

## Goal

Design a reusable, research-backed framework and tool plan for building
Glyphin curricula across real and fictional writing systems.

## Scope

- In scope:
  - Generalize the Thai curriculum approach into a script-agnostic authoring
    method.
  - Define a frequency, coverage, decodability, and cognitive-load formula for
    selecting anchor words and graphemes.
  - Identify source categories, concrete datasets, tooling, and licensing risks.
  - Document how the framework should support alphabets, abjads, abugidas,
    syllabaries, featural systems, morphosyllabic systems, mixed systems,
    historic scripts, and fictional glyph collections.
  - Create durable documentation in `docs/` and update the docs index.
- Out of scope:
  - Implementing ingestion scripts or production authoring UI.
  - Rewriting the current runtime DTOs.
  - Authoring a complete second course.
  - Making any security-sensitive deployment or database changes.

## Constraints

- Technical:
  - Keep the framework aligned with the existing six-step lesson contract.
  - Preserve script-agnostic language: course, text, segments, graphemes,
    rules, drills.
  - Treat curriculum data as the source of truth, with tools producing reviewable
    authoring artifacts rather than app behavior hidden in code.
- Product:
  - Optimize for useful real-world decoding, not alphabet-chart completion.
  - Use real words and environmental print as validation surfaces.
  - Keep learner cognitive load small and cumulative.
- Security:
  - No secrets, credentials, auth, environment, or database changes are part of
    this task.
  - Corpus and fictional-script use must include licensing and attribution
    review before shipping data.

## Decisions

- Decision: Put the durable framework in `docs/curriculum/authoring-framework.md`.
  Reason: It belongs beside the existing Thai curriculum reference and should be
  discoverable from `docs/README.md`.
- Decision: Treat Unicode grapheme clusters as the baseline unit, then map them
  into pedagogical graphemes per course.
  Reason: User-visible characters, script behavior, and teachable units do not
  always match code points or native alphabet entries.
- Decision: Use a weighted anchor score rather than raw word frequency alone.
  Reason: A high-frequency word can be poor early material if it adds too many
  new forms, uses an opaque irregular rule, or has weak real-world payoff.

## Research Notes

- Corpus and frequency sources: `wordfreq`, OPUS, Leipzig Corpora Collection,
  OSCAR, Wikimedia dumps, Tatoeba, Universal Dependencies, Common Voice, FLORES,
  UDHR.
- Unicode and segmentation sources: Unicode UAX #29, UAX #24, CLDR/LDML, ICU
  BreakIterator, JavaScript `Intl.Segmenter`, Python `regex` `\X`.
- Language metadata sources: ISO 15924, BCP 47, Glottolog, PHOIBLE, WALS,
  Lexibank.
- Lexicon and morphology sources: UniMorph, PanLex, Wiktionary, Wikidata Lexemes,
  Lexibank.
- Pronunciation and transliteration tools: Epitran, PanPhon, uroman,
  Aksharamukha, Indic NLP Library, IndicXlit.
- Tokenization and NLP tools: PyThaiNLP, MeCab, Sudachi, KoNLPy, CAMeL Tools,
  spaCy, Stanza.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation Notes

- `pnpm check` passed with 0 errors and 0 warnings.
- Focused `markdownlint-cli2` passed for this task's changed Markdown files.
- Full `pnpm markdownlint` currently reports pre-existing errors under
  `.kilo/node_modules`; run focused markdownlint against the files changed in
  this task for the useful docs signal.

## Open Questions

- Which language or script should be the first non-Thai pilot for this framework?
- Should the first tooling prototype be TypeScript-first for repo integration or
  Python-first for access to mature NLP libraries?
- How much licensed third-party lexical data can be stored directly versus used
  only to score or validate author-authored content?

## Follow-Up

- Prototype a curriculum-source manifest format for one new course.
- Build a small offline scoring script once a second pilot writing system is
  selected.
- Revisit the runtime DTOs after the framework has been tested against at least
  two non-Thai scripts.
