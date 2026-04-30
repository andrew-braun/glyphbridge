# Task: Delivery Read Boundary

- Start date: 2026-04-30
- Owner: GitHub Copilot
- Status: completed

## Goal

Move the learn runtime's first lesson reads off static TypeScript data and onto the
seeded `delivery.course_publication_lessons` bundle through a server-owned
SvelteKit boundary.

## Ordered Scope

1. Introduce a server-only lesson reader that consumes the active published lesson
   bundle from `delivery.*` and maps it back into the current runtime lesson
   contract.
2. Switch the learn index and lesson detail routes to server-owned loads backed by
   that delivery reader.
3. Move the app from static-only adapter posture to a server-capable SvelteKit
   runtime so those server-owned reads can actually exist in production.
4. Update the Supabase workstream trackers to reflect the completed boundary and
   the next post-read gate.

## Constraints

- Keep the current six-step lesson flow and local progress store working.
- Keep learner-facing reads on published `delivery.*` content only.
- Do not start authenticated route work or `@supabase/ssr` session wiring in this
  slice.
- Keep the returned lesson shape compatible with the existing lesson components.

## Validation Plan

- Validate route and type changes with `pnpm check`.
- Validate the server-capable runtime build with `pnpm build`.

## Implemented

- Added `src/lib/server/delivery-lessons.ts` to read the active published lesson
  bundle from `delivery.course_publication_lessons` and map it back into the
  current lesson contract.
- Added `src/routes/learn/+page.server.ts` and `src/routes/learn/[id]/+page.server.ts`
  so the learn index and lesson detail pages now load published lesson data on the
  server.
- Updated the learn route components to consume server-loaded lesson data while
  preserving the current lesson flow and local progress store.
- Switched `svelte.config.js` to `@sveltejs/adapter-node` so the server-owned
  lesson read boundary has a real deployment runtime.
- Documented the required local Supabase env bootstrap in `.env.example` and made
  the missing-env 503 actionable for local development.
- Updated the Supabase workstream trackers and repo instructions to reflect the
  new server-capable lesson-delivery posture.

## Validation

- Passed: `pnpm check`
- Passed: `pnpm build`
- Passed: local smoke test against `node build` with the local Supabase publishable key, confirming `/learn` and `/learn/1` render published lesson data from `delivery.*`
- Passed: fresh local dev-server smoke test after wiring `.env`, confirming `/learn` loads from the published lesson bundle without the earlier missing-env 503
