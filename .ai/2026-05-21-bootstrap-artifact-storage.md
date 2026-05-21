# Task: Bootstrap Artifact Storage

- Start date: 2026-05-21
- Owner: GitHub Copilot
- Status: done

## Goal

Align the curriculum bootstrap workflow with the intended storage boundary:
active tracking lives in `.ai/curriculum`, while the bootstrap artifacts that
become seed-source material live in `docs/curriculum/<course-id>/`.

## Scope

- In scope:
  - Update the curriculum authoring CLI scaffold paths.
  - Update authoring and tracker documentation to match the durable-doc layout.
  - Correct Korean Hangul references that still point bootstrap artifacts at
    `.ai/curriculum/<course-id>/`.
- Out of scope:
  - Moving or rewriting existing course content beyond path/reference fixes.
  - Changing DB schemas or publication logic.

## Constraints

- Technical:
  - Preserve the tracker file in `.ai/curriculum/<course-id>.md`.
  - Keep command-line validation, scoring, and review workflows path-agnostic.
- Product:
  - Treat bootstrap artifacts as durable authoring sources for future seeding.
- Security:
  - No secrets, auth, or DB writes.

## Decisions

- Decision: Bootstrap manifests, candidate CSVs, review packets, DB strategies,
  and course notes should live under `docs/curriculum/<course-id>/`.
  Reason: Those files are durable seed-source material, not ephemeral task
  tracking.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation

- `node --check scripts/curriculum-authoring-tools.mjs` passed.
- A temporary scaffold under `/tmp/glyphbridge-durable-bootstrap-test` wrote the
  tracker to `.ai/curriculum/demo-course.md` and the bootstrap artifacts to
  `docs/curriculum/demo-course/`.
- Focused Prettier checks passed for the touched script and Markdown files.
- Focused markdownlint checks passed for the touched Markdown files.

## Open Questions

- None yet.

## Follow-Up

- Verify the scaffold command produces the corrected durable-doc layout.
