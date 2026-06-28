# Task: Writing Systems Data Ranking

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: done

## Goal

Add a bootstrap-difficulty ranking to the writing systems catalog, prioritizing
systems with abundant language metadata, corpora, frequency lists, NLP tooling,
academic research, and pedagogical literature.

## Scope

- In scope:
  - Preserve the existing popularity rankings.
  - Add a new `Ranking By Available Data` section to
    `docs/curriculum/writing-systems-catalog.md`.
  - Rank candidates from easiest to hardest to bootstrap for Glyphin.
- Out of scope:
  - Creating detailed source manifests for every candidate.
  - Changing course data, DB schema, or authoring tools.

## Constraints

- Technical:
  - Keep the ranking scan-friendly and durable rather than exhaustive at the row
    level for every obscure script.
- Product:
  - Optimize for bootstrap readiness, not learner demand.
- Security:
  - No security-sensitive changes.

## Decisions

- Decision: Treat data readiness as a separate ranking axis from learner demand.
  Reason: A script can be popular but hard to bootstrap if corpora, review
  expertise, tooling, or licensing are thin.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation

- `pnpm exec markdownlint-cli2 docs/curriculum/writing-systems-catalog.md .ai/2026-05-21-writing-systems-data-ranking.md` passed after final newline fix.
- `pnpm check` passed with 0 errors and 0 warnings.

## Open Questions

- None yet.

## Follow-Up

- Consider converting this ranking into a scoring spreadsheet once the next course
  candidate shortlist is chosen.
