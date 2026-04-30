# UI Primitive Rules

## Purpose

- Files in this directory are reusable design-system primitives for the whole app.
- For repeated interactive patterns, this directory should be the default home for app-owned wrappers built on top of Bits UI.

## Boundaries

- UI primitives must stay domain-agnostic.
- Do not import lesson data, stores, or route modules into `ui/` components.
- Do not read or write localStorage, network state, or page-level metadata here.

## API Expectations

- Expose only stable, reusable props.
- Add variants only when they map to a deliberate design token or a repeated product need.
- Prefer Bits UI for interactive primitives and composite controls wherever possible.
- Prefer feature components consuming these wrappers over importing raw Bits UI directly once the product-level API is clear.
- Keep plain native elements for cases where a headless primitive adds no value.
- If using Bits UI, preserve its accessibility guarantees rather than fighting them with ad hoc markup.

## Quality Standards

- Primitives should be easy to compose, hard to misuse, and visually consistent.
- Keep class APIs simple and predictable.
- Do not sneak in app-specific business logic.
