# UI Primitive Rules

## Purpose

- Files in this directory are reusable design-system primitives for the whole app.

## Boundaries

- UI primitives must stay domain-agnostic.
- Do not import lesson data, stores, or route modules into `ui/` components.
- Do not read or write localStorage, network state, or page-level metadata here.

## API Expectations

- Expose only stable, reusable props.
- Add variants only when they map to a deliberate design token or a repeated product need.
- Prefer native HTML elements unless an accessible headless primitive is required.
- If using Bits UI, preserve its accessibility guarantees rather than fighting them with ad hoc markup.

## Quality Standards

- Primitives should be easy to compose, hard to misuse, and visually consistent.
- Keep class APIs simple and predictable.
- Do not sneak in app-specific business logic.
