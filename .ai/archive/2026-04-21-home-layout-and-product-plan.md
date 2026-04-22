# Task: Home layout polish and product planning

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: done

## Goal

Improve the home-page layout system and section presentation, then capture product planning guidance for progress persistence, curriculum design, audio, and auth.

## Scope

- In scope:
  - Shared layout max-width variables
  - Reusable heading spacing primitive
  - How It Works visual refresh
  - Planning notes for local progress, curriculum sequencing, audio, and auth
- Out of scope:
  - Auth implementation
  - Audio implementation
  - Curriculum data expansion
  - Database-backed persistence

## Constraints

- Technical:
  - Keep mobile behavior intact while improving desktop breathing room.
  - Reuse shared tokens instead of introducing one-off sizing rules.
- Product:
  - Keep the design learner-focused and easy to extend.
- Security:
  - Auth remains planning-only until researched and explicitly approved.

## Decisions

- Decision: Use root-level CSS custom properties for layout widths and section heading spacing.
  Reason: The app can tune desktop width and section rhythm from one place without coupling components to hard-coded values.
- Decision: Add a small reusable Heading primitive instead of sprinkling h2 margins across sections.
  Reason: Section spacing becomes explicit, consistent, and easy to evolve.
- Decision: Keep progress, audio, curriculum, and auth work as documented plans in this pass.
  Reason: The repo already has partial progress persistence, while the other items need deliberate follow-through rather than speculative code.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Planning Summary

- Local progress: keep the existing localStorage-backed store, then harden it with normalization, schema versioning, and a future storage-repository boundary instead of replacing it.
- Curriculum strategy: optimize early lessons for real-world decoding coverage, teaching high-payoff vowels, finals, and common orthographic chunks before low-value alphabet completeness.
- Audio strategy: use a small human-recorded static corpus for taught letters, words, and syllables as the MVP, with optional cloud TTS only as backfill later.
- Auth strategy: prefer Supabase Auth with `@supabase/ssr` and a small Postgres progress model when server-backed accounts are introduced; merge anonymous local progress into the authenticated account on first sign-in.

## Open Questions

- Whether the lesson-step width should stay slightly narrower than the new page container on large desktops long-term.
- Whether to evolve the new Heading primitive into a richer page-title system later.

## Follow-Up

- Wire the local progress hardening plan into a focused store refactor.
- Turn the curriculum, audio, and auth recommendations into implementation specs.
