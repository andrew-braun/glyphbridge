# Task: Korean Hangul Curriculum Bootstrap Instructions

- Start date: 2026-05-20
- Owner: GitHub Copilot
- Status: done

## Goal

Create bootstrap instructions for the first post-Thai curriculum pilot: Korean
written in Hangul, using standardized identifiers and the existing authoring
tools, then place that guidance in `.ai/curriculum` rather than `docs/`.

## Scope

- In scope:
  - Document the recommended course ID, BCP 47 language tag, and ISO 15924 script
    code.
  - Provide the scaffold command and first-pass authoring sequence.
  - Define the first-pass scope, source starter categories, candidate scoring
    pass, review packet questions, and DB strategy review focus.
  - Move the bootstrap note into `.ai/curriculum` and remove the stale docs index entry.
- Out of scope:
  - Actually scaffold the Korean/Hangul workspace.
  - Select real anchor words.
  - Add corpus analysis, tokenizer integration, or DB seed generation.

## Constraints

- Technical:
  - Use the existing dependency-free authoring CLI.
  - Keep guidance compatible with JSON manifests and CSV candidate files.
- Product:
  - Preserve the real-word-first Glyphin lesson model.
  - Keep Hanja and regional comparison out of the Hangul-only pilot.
- Security:
  - Treat all external source text as non-shipping until license review.
  - Do not add DB writes or production data changes.

## Decisions

- Decision: Use `ko-Hang` as the language tag and `Hang` as the script code.
  Reason: The pilot is Korean written in Hangul, not Korean scoped to a region
  and not the broader Hangul-plus-Hanja Korean script boundary.
- Decision: Document the bootstrap as a runbook rather than scaffolding the
  course immediately.
  Reason: The user asked for instructions for the next step, and the actual
  course workspace should be created when authoring begins.
- Decision: Keep the Korean/Hangul bootstrap instructions in
  `.ai/curriculum/korean-hangul.md` instead of `docs/`.
  Reason: This is active curriculum-tracking and next-step guidance, not a
  durable project reference.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation

- Focused Prettier and markdownlint checks passed for the moved `.ai/curriculum`
  tracker, the `.ai/curriculum` index, the docs index cleanup, and this tracker.

## Open Questions

- Should the actual course workspace be scaffolded in the next task, or should
  we first choose source candidates in the durable runbook?

## Follow-Up

- Run the documented scaffold command when Korean/Hangul curriculum authoring
  starts.
- Fill the source manifest with reviewed corpus and dictionary candidates.
- Generate a review packet before drafting lessons.
