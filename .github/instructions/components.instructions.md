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
- Prefer Bits UI for interactive primitives and composite controls wherever possible; fall back to custom interaction code only when native HTML already covers the behavior or Bits UI is not a fit.
- Once a Bits UI-backed interaction pattern shows real reuse or shared styling needs, extract it into an app-owned `src/lib/components/ui` primitive instead of repeating raw Bits UI composition in feature components.
- Prefer `$derived` over `$effect` for computed state.
- Prefer snippets and render tags over legacy slot patterns in new components.
- Avoid legacy Svelte APIs when a runes-mode equivalent exists.
- Extract shared abstractions only after a second real reuse or when the boundary is clearly stable.
