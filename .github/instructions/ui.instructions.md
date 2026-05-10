---
applyTo: "src/lib/components/ui/**/*.svelte"
---

# UI Primitive Instructions

- Files in `ui/` must remain domain-agnostic.
- Do not import lesson data, stores, or route modules here.
- Do not add localStorage, fetch, SEO, or page-specific business logic.
- Use native semantics first, and prefer Bits UI for interactive primitives and composite controls wherever possible.
- For repeated interactive patterns, make these components the app-facing wrapper layer over Bits UI so styling and behavior stay consistent across routes and feature components.
- Add variants only when they map to shared design-system needs, not one-off screens.
- Prefer snippets, render tags, and typed callback props over legacy component patterns.
- Keep APIs easy to compose and hard to misuse.
- Avoid generic AI-design defaults in shared primitives: no decorative gradient text gimmicks, emoji-only empty states, or interchangeable SaaS card treatments unless the pattern has a product-specific reason.
- Prefer specific, intentional states over perfectly smoothed sameness: copy should be concrete, motion restrained, and visual accents tied to the learning experience rather than trend-driven polish.
- When a shared section only needs staged entrance motion, prefer `Reveal.svelte` over introducing new one-off keyframe wrappers.
