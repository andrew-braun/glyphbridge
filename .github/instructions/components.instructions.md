---
applyTo: "src/lib/components/**/*.svelte"
---

# Component Instructions

- Components should stay presentational-first.
- Use typed props with a small, deliberate API.
- Treat props as read-only. Prefer callback props for upward communication.
- Keep route loading, persistence, and metadata concerns out of reusable components.
- Reuse existing primitives before creating new wrappers.
- Use semantic HTML and accessible interactions by default.
- Prefer `$derived` over `$effect` for computed state.
- Prefer snippets and render tags over legacy slot patterns in new components.
- Avoid legacy Svelte APIs when a runes-mode equivalent exists.
- Extract shared abstractions only after a second real reuse or when the boundary is clearly stable.
