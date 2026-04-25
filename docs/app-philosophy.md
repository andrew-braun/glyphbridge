# App Philosophy

GlyphBridge is a real-word-first reading app for scripts and writing systems. Its purpose is to help learners decode useful text quickly enough to feel momentum early. The app is not an abstract alphabet chart, a grammar course, or a dictionary. It teaches reading through real words, recurring patterns, and short drills that turn unfamiliar script into legible text.

## Product Definition

- The public-facing learning unit is a course. A course combines a language context, a script system, and an ordered curriculum.
- A script system is supporting metadata for rendering, grouping, and directional behavior. It is not the main product abstraction.
- A lesson is an ordered unit anchored to one real word or one tightly related reading target.
- A grapheme is the smallest teachable script unit surfaced by the app: letter, vowel sign, diacritic, tone mark, syllabic component, or other script-specific piece.
- A rule is a concise explanation of a recurring orthographic or phonetic pattern.
- A drill is a deterministic practice item that checks recognition, mapping, pronunciation, or visual discrimination.

## Teaching Model

- Teach for decoding payoff, not exhaustive symbol coverage.
- Introduce high-yield graphemes and patterns first.
- Anchor every lesson in text a learner could plausibly encounter outside the app.
- Keep cognitive load low by introducing small, cumulative sets of new material.
- Teach rules in the context of words, not as detached theory.
- Reinforce earlier material through review without breaking the primary lesson path.
- Judge curriculum quality by how quickly learners can decode useful text, not by how quickly they finish a full script chart.

## Lesson Contract

Every lesson follows the same six-step structure:

1. Intro: present the anchor word and why it matters.
2. Breakdown: show how the word segments into readable parts.
3. Letters: introduce only the new graphemes required for this lesson.
4. Rules: explain the specific patterns that make the word readable.
5. Drills: verify recognition, mapping, pronunciation, and discrimination.
6. Complete: summarize performance and unlock the next lesson.

Each lesson should define a stable identifier, stage, title, anchor word, new graphemes, introduced rules, drills, and optional review graphemes. Components should render this contract. They should not invent lesson-specific structures or duplicate curriculum facts in UI code.

## Progress Path

- Lesson progression is linear by default.
- The next lesson unlocks only after the previous lesson is completed.
- A lesson is not complete until its drills are finished and scored.
- Progress is course-scoped, not global.
- Canonical progress should be stored as lesson completion records plus current position.
- Known graphemes, known words, and unlock state should be derived where practical instead of stored as competing sources of truth.
- The current lesson is the first incomplete lesson in the ordered course.
- Review and practice surfaces should draw from completed lessons and their taught material.

## Technical Implications

- Curriculum content is canonical data. It must stay serializable, schema-driven, stable, and free of presentation markup.
- Routes own page orchestration and metadata.
- Reusable components own rendering.
- Prefer Bits UI for reusable interactive controls where a headless primitive improves consistency; keep native elements for simple interactions that do not need extra abstraction.
- State layers own persistence and derived learner progress.
- Database access, auth, and privileged mutations belong behind server-only boundaries.
- Components and DTOs must be script-agnostic. Prefer names such as `course`, `text`, `segments`, and `graphemes` over language-specific field names.
- Stable course and lesson identifiers matter. Ordering is intentional and part of the learning design.
- Script-specific nuance should live in bounded metadata owned by the curriculum model, not in global assumptions baked into routing, component APIs, or progress logic.
- When backend persistence is added, store the minimum canonical learner facts and derive the rest.

## Decision Rules

Use this document as a filter for product and implementation choices:

- Does this help learners decode useful text sooner?
- Is this concept owned by curriculum data, rendering, or progress state?
- Can this model support another writing system without renaming core concepts?
- Are we storing a fact that should be derived instead?
- Does this preserve the fixed lesson flow unless there is a concrete product reason to change it?

## Related Documents

- [README.md](../README.md)
- [concept/approach-thai.md](./concept/approach-thai.md)
- [security-review-checklist.md](./security-review-checklist.md)
