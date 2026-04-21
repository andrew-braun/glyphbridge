# Source Tree Rules

## Scope

- These rules apply to all application code under `src/`.

## Module Placement

- Put route concerns in `src/routes`.
- Put reusable rendering in `src/lib/components`.
- Put canonical curriculum content and shared schemas in `src/lib/data`.
- Put client state and persistence in `src/lib/stores`.
- Put generally reusable pure helpers in `src/lib/utils` only when multiple owners need them.

## Imports And Dependencies

- Prefer `$lib` and `$app` aliases for shared modules.
- Avoid deep relative traversal when an alias or clearer boundary exists.
- Do not make low-level modules depend on route modules.

## Source Style

- In `src/**`, follow the surrounding style of the touched file and avoid unrelated reformatting.
- Keep modules top-down and readable: imports, types, props or state, derived values, handlers, markup, styles.
- Comments should explain intent, constraints, or non-obvious tradeoffs, not restate syntax.

## Browser And Runtime Safety

- Assume code may eventually run with more SSR enabled than today. Do not bake in unnecessary client-only assumptions.
- Guard browser APIs and keep persistence or side effects behind clear boundaries.

## Abstraction Discipline

- Prefer composition over inheritance-like layering.
- Do not extract helpers until the ownership and reuse case are both clear.
- Avoid boolean-prop explosions. If a component is becoming many components in disguise, split it.
