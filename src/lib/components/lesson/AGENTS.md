# Lesson Step Rules

## Purpose

- Lesson components implement the step-by-step teaching experience for a single lesson.

## Pedagogical Constraints

- Preserve the canonical order of the learning flow: intro, breakdown, letters, rules, drills, complete.
- Each step should have one clear learning objective.
- Keep explanations concise, concrete, and cumulative.
- Prefer reinforcing previously introduced patterns over introducing surprise complexity.

## Data Ownership

- Step components render data that comes from the lesson model.
- Do not hardcode duplicate lesson facts in multiple step components when they belong in `src/lib/data`.
- If a step needs new structured content, extend the data model deliberately rather than sprinkling string literals through the UI.

## Interaction Standards

- Drills must feel deterministic and fair.
- Completion logic belongs in the lesson flow owner, not in arbitrary leaf components.
- Keep the pace tight and the cognitive load low on mobile as well as desktop.
