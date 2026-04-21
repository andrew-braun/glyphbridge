# Curriculum Data Rules

## Source Of Truth

- `types.ts` defines the canonical schema.
- Lesson content files are the single source of truth for curriculum structure and teaching copy.
- Keep all data plain, serializable TypeScript data with no presentation markup or framework-specific objects.

## Modeling Standards

- Update shared types intentionally before widening content structures.
- Keep lesson IDs stable once introduced.
- Preserve ordering guarantees; curriculum order is product behavior.
- Add fields only when multiple lessons or UI paths need them.

## Pedagogical Data Quality

- Every lesson must justify its new letters, rules, and drills through the anchor word and learning flow.
- `reviewLetters` may only reference letters introduced in earlier lessons.
- Drill options should be plausible distractors with one unambiguous correct answer.
- Keep transliteration and explanatory voice consistent within the language pack.
- Context notes should be real-world and helpful, not filler.
