# Task: Curriculum Tracking Home

- Start date: 2026-05-02
- Owner: GitHub Copilot
- Status: completed

## Goal

Create a single curriculum-centered location under `.ai/` for per-language glyph
system progress and to-dos, starting with Thai.

## Ordered Scope

1. Create `.ai/curriculum/thai.md` as the authoritative Thai curriculum tracker.
2. Move the current Thai curriculum status and follow-up inventory out of the
   Supabase task bundle so curriculum progress is tracked independently.
3. Update workflow instructions and task references so future language systems use
   `.ai/curriculum/<language>.md` as the central curriculum progress location.

## Constraints

- Keep Supabase implementation tracking in the existing DB workstream docs.
- Keep durable Thai concept rationale in `docs/concept/approach-thai.md`.
- Leave only one authoritative Thai curriculum tracker under `.ai/`.

## Implemented

- Added `.ai/curriculum/thai.md` as the central Thai curriculum status and to-do
  tracker.
- Updated `.ai/README.md`, `AGENTS.md`, and `.github/copilot-instructions.md` to
  point future curriculum tracking at `.ai/curriculum/<language>.md`.
- Updated Supabase workstream docs to reference the new Thai curriculum tracker.
- Removed the older `thai-curriculum-seed-dataset.md` file from the Supabase task
  bundle to avoid split authority.

## Validation

- Planned: `markdownlint-cli2` on the touched markdown and instruction files.
- Planned: `pnpm check` to keep the repo validation baseline intact.
