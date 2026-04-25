# Component Rules

## Responsibilities

- Components render UI and manage only the minimum local state needed for that UI.
- Route data fetching, persistence, and app-wide orchestration belong outside generic components.
- Keep the taxonomy clean:
  - `ui/` for domain-agnostic primitives
  - `layout/` for structural wrappers
  - `content/` for section-level compositions
  - `lesson/` for lesson-step rendering
  - `exercises/` for reusable practice interactions

## Component API Design

- Use typed props with a small, obvious public API.
- Treat props as immutable inputs.
- Prefer callback props over hidden store writes or implicit global communication.
- Use local state only for ephemeral view concerns.
- If a component needs route knowledge, SEO knowledge, or persistence, it probably belongs higher in the tree.

## Composition Standards

- Reuse existing primitives before introducing new wrappers.
- Prefer Bits UI for reusable interactive primitives and composite controls wherever it fits the product behavior.
- Wrap Bits UI primitives only when the wrapper adds a stable app-level API, consistent styling, or repeated composition value.
- Do not wrap primitives just to rename props or move markup around once.

## Accessibility And Styling

- Use semantic HTML and accessible interaction patterns by default.
- Keep headings, labels, focus behavior, and keyboard interaction correct.
- Use shared design tokens and existing utility/layout components where they fit.
