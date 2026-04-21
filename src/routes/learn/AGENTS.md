# Learn Route Rules

## Product Role

- `src/routes/learn` is the core learning journey, not just another content section.
- Changes here must protect pedagogical clarity, progress continuity, and mobile usability.

## Flow Ownership

- The route-level lesson page owns the state machine and navigation between steps.
- Step components own the rendering and interaction of an individual step.
- Do not spread progression rules across unrelated modules.

## Lesson Integrity

- The visible lesson sequence must stay linear unless product requirements explicitly change.
- New letters, rules, and drills must come from the lesson data model.
- A lesson should not be marked complete before its drill flow is complete.
- Progress updates should happen once per completion event, with deterministic scoring.

## UX Standards

- Keep instructions short and confidence-building.
- Avoid surprise branching, hidden state, or abrupt context switches.
- Preserve obvious recovery paths such as returning to the lesson list or moving to the next lesson.
