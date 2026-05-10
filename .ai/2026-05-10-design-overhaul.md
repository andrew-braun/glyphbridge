# 2026-05-10 Design Overhaul

## Scope

- Replace the current generic purple-white aesthetic with a stronger, dark-first visual system.
- Add dark/light mode with dark as the default.
- Turn the home page into a smart shell for first-time guests, anonymous returners, and signed-in learners.
- Establish reusable theme, motion, and illustration primitives that can support future named themes.

## Design Direction

- Working direction: Neon Glyph with warmth.
- Keywords: simple, whimsical, educational, colorful, slight synthwave.
- Product stance: start learning immediately with no login, save progress locally, optionally create an account later.

## Assumptions

- `/` remains the smart home shell for the first implementation slice.
- Anonymous learners with local progress should see a progress-first home, not the pure marketing surface.
- Multi-language work in this pass is presentation-first scaffolding, not full curriculum plumbing.

## Execution Plan

1. Build theme infrastructure: tokens, root theme variables, dark-default state, and shell toggle.
2. Restyle the app shell and home surfaces to use the new theme layer.
3. Split the home composition into guest CTA and learner hub variants.
4. Add reusable motion and illustration primitives.
5. Cascade the redesign across the primary learner routes.
6. Update instructions and docs if the new conventions become durable.

## Progress

- [x] Research external inspiration and audit current architecture.
- [x] Define redesign direction and implementation strategy.
- [x] Add tracker-backed implementation slices.
- [x] Ship theme foundation.
- [x] Ship the first home-shell redesign slice.
- [x] Apply the new visual system to core routes.

## Current Slice

- Goal: carry the shared design language across the full learner journey and remove the most obvious AI-generic patterns.
- Hypothesis: shared surface utilities, concrete copy, and theme-aware primitives will make the app feel authored rather than template-driven.
- Validation: `pnpm check`, `pnpm stylelint`, and `pnpm lint` after the route and lesson-flow pass.

## Landed In This Slice

- Added a client theme controller at `src/lib/stores/theme.svelte.ts` with dark mode as the default and a persisted light/dark toggle.
- Restyled the shared app shell through `src/lib/styles/global.scss`, `src/routes/+layout.svelte`, `src/lib/components/navigation/MainNav.svelte`, and `src/lib/components/ui/ThemeToggle.svelte`.
- Replaced the generic root hero with separate guest and learner home surfaces in `src/routes/+page.svelte`.
- Added a reusable animated SVG illustration in `src/lib/components/illustrations/GlyphOrbit.svelte`.
- Added `GuestHomeShell.svelte` and `LearnerHomeHub.svelte` for the new home composition.
- Updated home-adjacent supporting components (`StatCard`, `HowItWorksSection`, `LessonList`, `IconBox`) to use the new theme tokens and card treatment.
- Carried the shared design vocabulary across `/learn`, `/learn/[id]`, `/practice`, `/auth`, `/words`, and `/alphabet`.
- Updated the shared route and lesson primitives (`Progress`, `ToggleTiles`, `LetterDetailPanel`, `DrillExercise`, lesson-step components, and `PageHero`) to use semantic theme values instead of fixed light-mode palette assumptions.
- Replaced emoji-forward empty or success states with product-specific Thai glyph treatments and more specific product copy.
- Added durable guidance in UI instructions to avoid generic AI-design defaults such as gradient-text gimmicks, emoji-only empty states, and interchangeable SaaS card styling.

## Anti-AI Design Rules

1. Avoid overly smooth, interchangeable hero patterns. Prefer asymmetric composition, product-specific copy, and visuals tied to reading Thai rather than a generic “app landing page” formula.
2. Avoid emoji-only empty and success states. Use lightweight branded glyph or illustration treatments that belong to GlyphBridge.
3. Avoid neutral filler copy. Every heading and support line should say something concrete about the learner’s next step, current progress, or what makes the product different.
4. Avoid infinite card sameness. Shared surfaces should come from the same system, but emphasis should shift by context through accent panels, specific badges, and purposeful layout changes.
5. Avoid trend-driven decoration without teaching value. Motion, glow, and synthwave accents should guide attention or reinforce progress, not exist as generic polish.

## Next Slice

1. Retire or repurpose the legacy `HomeHero.svelte` and related one-off hero abstractions now that the route pass no longer depends on them.
2. Add motion helpers and reusable decorative primitives so future illustrations do not stay one-off.
3. Evaluate typography upgrades that add personality without reducing Thai readability.
4. Clean up remaining legacy Sass palette exports once no active components depend on them.

## Follow-up

- Evaluate a stronger typography pairing for Latin and Thai.
- Define a compact animated SVG illustration system for hero and empty-state surfaces.
- Add future named themes once the semantic token model is stable.
