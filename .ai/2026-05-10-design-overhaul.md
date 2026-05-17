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
- Added shared motion and decorative primitives in `src/lib/components/ui/Reveal.svelte` and `src/lib/components/illustrations/GlyphRibbon.svelte`.
- Added `GuestHomeShell.svelte` and `LearnerHomeHub.svelte` for the new home composition.
- Updated home-adjacent supporting components (`StatCard`, `HowItWorksSection`, `LessonList`, `IconBox`) to use the new theme tokens and card treatment.
- Carried the shared design vocabulary across `/learn`, `/learn/[id]`, `/practice`, `/auth`, `/words`, and `/alphabet`.
- Updated the shared route and lesson primitives (`Progress`, `ToggleTiles`, `LetterDetailPanel`, `DrillExercise`, and lesson-step components) to use semantic theme values instead of fixed light-mode palette assumptions.
- Replaced emoji-forward empty or success states with product-specific Thai glyph treatments and more specific product copy.
- Added durable guidance in UI instructions to avoid generic AI-design defaults such as gradient-text gimmicks, emoji-only empty states, and interchangeable SaaS card styling.
- Retired the unused legacy hero wrappers and upgraded the global typography stack to a more distinctive display/body pairing.

## Anti-AI Design Rules

1. Avoid overly smooth, interchangeable hero patterns. Prefer asymmetric composition, product-specific copy, and visuals tied to reading Thai rather than a generic “app landing page” formula.
2. Avoid emoji-only empty and success states. Use lightweight branded glyph or illustration treatments that belong to GlyphBridge.
3. Avoid neutral filler copy. Every heading and support line should say something concrete about the learner’s next step, current progress, or what makes the product different.
4. Avoid infinite card sameness. Shared surfaces should come from the same system, but emphasis should shift by context through accent panels, specific badges, and purposeful layout changes.
5. Avoid trend-driven decoration without teaching value. Motion, glow, and synthwave accents should guide attention or reinforce progress, not exist as generic polish.

## Palette Research

- Accessibility baseline: readable body text and interactive states matter more than brand hue preference. Contrast has to hold across text, focus states, and tinted surfaces, not just on flat backgrounds.
- Product signal: for an education app, dominant cool hues and warm neutrals feel more reliable and approachable than high-chroma magenta-purple pairings. Blue carries the trust and clarity role better than neon violet when the product needs to feel easy to use.
- Emotional balance: the most promising direction is a softened split-complementary system with one calm dominant color and smaller warm accents. That keeps the UI playful without making every surface feel promotional.
- Practical conclusion for GlyphBridge: use muted sky/ink blue as the main structural color, warm paper neutrals for the resting surfaces, coral as the encouragement accent, and mint/marigold only for success and warning semantics.
- Synthwave should survive only as a hint in glow, illustration, and celebratory accents. It should not own the base surfaces or primary reading experience.

## Next Slice

1. Clean up remaining legacy Sass palette exports once no active components depend on them.
2. Run a visual QA sweep for the softer classroom palette across home, auth, and lesson routes and tune any surfaces that still feel too dark-default or too promotional.
3. Extend `Reveal` and `GlyphRibbon` to a few more secondary routes if future screens need staged entrances or branded decorative states.
4. Revisit font weights after another round of mobile QA and visual tuning.

## Follow-up

- Sweep for old one-off animation snippets that can move to the new shared motion layer.
- Capture future optional named themes around the calmer token model instead of returning to full-screen neon as the default.
- Add future named themes once the semantic token model is stable.
