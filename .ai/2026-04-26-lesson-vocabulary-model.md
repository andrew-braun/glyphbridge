# Task: Lesson vocabulary model

- Start date: 2026-04-26
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Record the schema and DTO changes needed to support first-class reusable lesson
vocabulary so GlyphBridge can grow from anchor-word lessons into both script teaching
and vocabulary drilling.

## Decision

- Chosen direction: add `curriculum.vocabulary_items`,
  `curriculum.vocabulary_segments`, and `curriculum.lesson_vocabulary`.
- Keep `curriculum.anchor_targets` and `curriculum.anchor_segments` as the featured
  lesson-word projection for the current runtime lesson contract.
- Extend the published lesson bundle with a vocabulary list while keeping the
  existing `anchor` field for compatibility during the transition.

## Why

- One vocabulary item should be reusable across lessons.
- One lesson should be able to teach and drill more than one word.
- Vocabulary needs its own durable model if the app will later support standalone
  vocabulary drilling, review, search, and spaced repetition.
- Keeping extra words only inside drill JSON would make reuse, analytics, and future
  non-lesson vocabulary modes harder than they need to be.

## Scope Of This Pass

- Update `docs/database-dto-spec.md` with the new tables and lesson bundle DTO.
- Update `docs/db.md` and the active Thai seeding docs so the next seed step uses the
  broader content model.
- Do not implement SQL migrations, seed code, or runtime TypeScript model changes in
  this pass.

## Follow-Up Work

- Add the SQL migration that creates the new vocabulary tables.
- Update the seed implementation to populate anchor-backed vocabulary rows.
- Author the first supporting-vocabulary inventory beyond the current anchor words.
- Update the runtime lesson model and UI to consume lesson vocabulary directly.

## Validation

- Run markdown lint on every touched doc after the architecture update.
