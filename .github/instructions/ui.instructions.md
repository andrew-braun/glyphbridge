---
applyTo: "src/lib/components/ui/**/*.svelte"
---

# UI Primitive Instructions

- Files in `ui/` must remain domain-agnostic.
- Do not import lesson data, stores, or route modules here.
- Do not add localStorage, fetch, SEO, or page-specific business logic.
- Use native semantics first; use Bits UI when an accessible primitive is genuinely needed.
- Add variants only when they map to shared design-system needs, not one-off screens.
- Prefer snippets, render tags, and typed callback props over legacy component patterns.
- Keep APIs easy to compose and hard to misuse.
