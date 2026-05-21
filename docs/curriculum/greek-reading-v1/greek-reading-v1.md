# Greek Reading Curriculum Notes

This durable course note records the v1 boundary and bootstrap decisions for a
Modern Greek reading course.

## Course Boundary

- Language/script: Modern Greek in the Greek script, `el-Grek`, ISO 15924
  `Grek`.
- Target learner: English-literate traveler or culture learner who wants to read
  practical Greek text before studying full grammar.
- Target domains: menus, cafes, transit signs, street names, public facilities,
  museum/cultural-site labels, everyday labels, and basic storefront signage.
- In scope for v1: monotonic Modern Greek, base alphabet, final sigma, tonos,
  common i/o vowel spelling mergers, and high-frequency digraphs such as `ει`
  and `ου`.
- Out of scope for v1: Ancient Greek, polytonic orthography, Cypriot Greek as a
  separate regional course, full morphology, handwriting, production spelling,
  and exhaustive digraph coverage.

## Sequencing Rationale

- Frequency sources: Unicode and CLDR for script metadata, `wordfreq` for rough
  frequency intuition, OpenStreetMap names for environmental-print validation,
  Wiktionary for discovery-only spelling/gloss checks, and app-authored examples
  for learner-visible content.
- First-session decoding target: `νερό`, `καφέ`, and `μετρό`, because they are
  high-utility and introduce vowels, sonorants, rho, kappa, phi, tau, and tonos
  without requiring final sigma or digraphs.
- Stage 1 goal: make the learner comfortable reading real short words and seeing
  tonos as a stress marker.
- Stage 2 goal: add sigma/final-sigma, delta, eta/iota spelling contrast, xi,
  and gamma through menu and transit anchors.
- Stage 3 goal: add chi and the `ει` and `ου` digraphs through entrance/exit,
  chicken, museum, and pharmacy anchors.
- Stage 4 goal: use open/closed, caution, and thank-you as late heart words that
  consolidate longer chunks and remaining digraph behavior.

## Script Notes

- Final sigma is a positional spelling rule: `σ` inside or at the start of a
  word, `ς` at the end.
- Tonos is a stress marker in Modern Greek, not a Thai-like tone mark.
- Modern Greek keeps several historical spellings for sounds that have merged:
  `ι`, `η`, and `υ` can all sound like /i/; `ο` and `ω` can both sound like /o/.
- Greek has strong positive transfer for some Latin-literate learners, but beta
  is a major trap because `β` sounds /v/, not /b/.
- Cyrillic-literate learners may need explicit confusable drills for forms such
  as Β, Γ, Δ, Π, Ρ, Σ, Τ, and Χ.

## Validation Notes

- Segmentation review: verify that final sigma, tonos-marked vowels, and common
  digraphs are represented as pedagogical units without confusing storage
  grapheme clusters with teachable units.
- Pronunciation review: confirm Modern Greek pronunciations for γ, δ, θ, χ,
  beta, vowel mergers, and `ευ` before any learner-facing copy is shipped.
- Cultural review: confirm that anchors such as `καφέ`, `ταξί`, `φαρμακείο`,
  `ανοιχτό`, `κλειστό`, and `ευχαριστώ` are natural for beginner traveler
  contexts.
- License review: keep Wiktionary, OpenStreetMap, Europarl, and upstream corpus
  data out of shipped content until attribution and derived-data obligations are
  approved. Prefer app-authored examples for runtime lessons.
