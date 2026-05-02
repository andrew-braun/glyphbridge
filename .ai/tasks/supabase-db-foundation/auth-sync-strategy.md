# Task: Supabase auth and progress sync strategy

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: in-progress

## Related Docs

- `README.md` for the bundle index and redundancy assessment
- `foundation-plan.md` for the broader database architecture and schema direction
- `implementation-status.md` for the current implemented foundation and the immediate pre-auth next steps

## Goal

Plan a secure, low-cost path for adding user accounts and progress syncing to GlyphBridge without paying for premium auth SaaS or hand-rolling authentication.

## Scope

- In scope:
  - Auth provider recommendation
  - SvelteKit integration shape
  - Progress sync and migration strategy
  - Security and operational caveats
- Out of scope:
  - Auth implementation
  - Database migrations
  - UI for sign-in and account management

## Constraints

- Technical:
  - Align with the repo guidance that secure auth or data work must use current docs and conservative server-side boundaries.
  - Align the auth rollout with the current server-capable lesson-delivery architecture rather than the earlier static-only app assumptions.
  - Keep the current anonymous local progress path useful until account features are ready.
- Product:
  - Users should be able to start learning anonymously and attach progress to an account later.
  - The solution should scale from early traffic without expensive per-user SaaS pricing.
- Security:
  - Any implementation must use server-side session verification, clear public/private env separation, and least-privilege data access.
  - Authorization must rely on server-verified user identity, not cookie-derived session payloads alone.
  - Learner writes stay server-owned by default; any direct client write surface requires separate justification and review.

## Reviewed Current State

- The app now has a real server runtime via `@sveltejs/adapter-node` and already serves `/learn` through server-owned reads of published `delivery.*` lesson bundles.
- The public learn subtree now overrides the root SPA shell with `ssr = true` and `prerender = true`, and build-time publication export writes a manifest plus a publication-scoped lesson artifact consumed by the learn routes.
- Public lesson pages now carry a stable `publicationId` and `publicationCacheKey`, and the learn index applies learner-specific progress badges and locking only after hydration.
- The DB-side hardening that earlier planning treated as pending is complete: direct learner-attempt inserts were removed, `SECURITY DEFINER` search paths were pinned, private enums moved out of `public`, deny-by-default RLS now covers `curriculum.*`, and the learner sync function now derives authenticated identity internally.
- Delivery reads now use private env vars in `src/lib/server/delivery-lessons.ts`, but `src/lib/supabase.ts` still exports a module-scoped client and is not safe for authenticated server work.
- `src/routes/+layout.ts` still exports `prerender = true` and `ssr = false`, so the auth rollout must explicitly decide whether to remove the app-wide client-only shell or isolate authenticated routes inside a server-rendered subtree.
- Local progress still lives in `src/lib/stores/progress.ts` and derives from the static Thai lesson pack, while the prerendered learn routes now key off the active published publication, so the first local-to-account merge must map that snapshot onto the active published course version intentionally rather than assuming the static pack is the only lesson catalog.

## Decisions

- Decision: Prefer Supabase Auth with `@supabase/ssr` and a small Postgres-backed progress model.
  Reason: It provides the cleanest combined path for auth and progress syncing with a realistic free or low-cost entry point.
- Decision: Keep anonymous localStorage progress and merge it into the authenticated record on first sign-in.
  Reason: The app remains useful before login, and users do not lose early progress when accounts are introduced.
- Decision: Prefer email OTP as the first auth method; keep password auth, OAuth providers, and Supabase anonymous auth out of v1 unless a separate product need is approved.
  Reason: It minimizes credential-management surface area, reduces account-recovery complexity, and keeps the first secure rollout easier to audit.
- Decision: Keep browser-side Supabase usage narrow and non-privileged.
  Reason: The browser may need a client for auth initiation or session-aware UI, but learner reads and writes should continue to flow through server-owned SvelteKit boundaries.
- Decision: Stop treating the root `ssr = false` and `prerender = true` layout defaults as compatible with the long-term auth boundary.
  Reason: Verified session-aware layout data and secure route protection are simpler and less error-prone when authenticated routes run in a server-capable segment by design.
- Decision: Keep published curriculum routes prerendered and publication-versioned even after auth lands.
  Reason: The lesson content is shared public data with low change frequency, while learner state is per-user and should arrive as a separate authenticated overlay rather than forcing `/learn` and `/learn/[id]` back to fully dynamic rendering.

## Progress

- [x] Discovery and research
- [x] Strategy recommendation captured
- [x] Architecture and security review refreshed for the current repo state
- [ ] Implementation planning

## Current Recommendation

- Keep Supabase Auth and the existing learner schema, but treat the first auth rollout as an app-boundary project rather than a DB-foundation project.
- Add request-scoped Supabase clients via `@supabase/ssr`, validate sessions server-side, and expose only the minimum verified session data to the app shell.
- Use server-verified `getUser()` for authorization decisions. `getSession()` may participate in refresh and cookie maintenance, but it must not decide access.
- Keep learner data access server-owned. The browser client, if present at all, should not become a generic learner-data client.
- Merge anonymous local progress into the authenticated learner model on the first verified session, with explicit course-version mapping and idempotent conflict handling.
- Treat `/learn` and `/learn/[id]` as publication routes, not authenticated routes. Auth should add a learner-projection read path that overlays per-user progress onto those prerendered pages after hydration or through a reviewed server-rendered learner subtree when needed.

## Current Entry Point

- The DB-side hardening prerequisites are complete.
- The public published-lesson read path over `delivery.*` is now complete and working in local development when the documented delivery env vars are set.
- The learn subtree already demonstrates the route-branch approach: public lesson content can be server-rendered and prerendered independently of the root SPA shell.
- Auth-lane next step: land the request-scoped SvelteKit auth boundary with `@supabase/ssr`, `src/hooks.server.ts`, `App.Locals`, and a server layout that exposes only minimal verified session data.
- Before the first authenticated route ships, either remove the app-wide `ssr = false` and `prerender = true` defaults or isolate auth-bearing routes inside a dedicated subtree with `ssr = true` and `prerender = false`. The learn subtree does not need to lose prerendering to make that work.
- Replace the module-scoped Supabase export in `src/lib/supabase.ts` with explicit browser and server surfaces; do not reuse a singleton across authenticated server requests.
- Do not start the first authenticated route, action, merge path, or learner sync path until that boundary exists.

## Required Implementation Sequence

1. Route and runtime boundary

- Remove the app-wide client-only default or create a dedicated authenticated route group with server rendering enabled.
- Preserve the existing prerendered public lesson branch; do not collapse published lesson pages back into a user-specific dynamic render path just to support auth.
- Add `src/hooks.server.ts` for request-scoped Supabase setup and session refresh.
- Add `App.Locals` typing in `src/app.d.ts`.
- Add `+layout.server.ts` for the app shell or authenticated subtree and return only minimal verified auth state.

1. Supabase client surfaces

- Replace the current module-scoped `src/lib/supabase.ts` export with explicit factories.
- Keep the browser client limited to auth initiation and session-aware UI.
- Keep any privileged service-role or admin client in a dedicated server-only module, never in universal code.

1. Auth flows

- Add server-owned sign-in, verification, and sign-out flows.
- Keep redirect allow-lists exact and reject arbitrary user-supplied redirect targets.
- If password auth is ever enabled later, treat it as a separate security review item.

1. Learner bootstrap and merge

- Rely on `handle_new_user()` for profile and preferences bootstrap.
- Create the first server-owned enrollment path.
- Define a one-time local-to-account merge that is idempotent, version-aware, and explicit about conflict rules.
- Map the local snapshot onto the active published `publicationId`, not onto assumptions derived from the static Thai pack alone.

1. Learner sync and server writes

- Keep `learner.lesson_progress` and attempt projection server-owned.
- Do not call private learner-write paths through the public delivery client.
- Pick and document the privileged server caller model for `internal_api.sync_lesson_attempt_batch(...)` before implementing the first sync endpoint.
- Add a small authenticated learner-projection read path for public lesson surfaces so prerendered publication pages can fetch per-user progress without becoming per-user HTML.

1. Hosted rollout hardening

- Configure exact site and redirect URLs.
- Enable captcha and tune signup or OTP rate limits.
- Wire a real SMTP provider.
- Add deployment requirements for SSL enforcement, network restrictions, and log scrubbing.

## Next-Phase Security Gates

These items are intentionally deferred until the authenticated SvelteKit boundary work starts. They should ship as part of that next phase, not as optional cleanup after it.

- Replace the module-scoped client in `src/lib/supabase.ts` with request-scoped `@supabase/ssr` clients and add the matching `hooks.server.ts` session flow. Covers `H5` and `L5` from the DB audit.
- Use verified server-side user lookups for authorization. Do not authorize from cookie-derived session payloads alone.
- Keep anonymous auth disabled until the anon-to-account merge flow, captcha posture, and rate limits are designed together. Covers `M11`.
- Keep authenticated writes server-owned by default, then add column-level grants only for any learner table that is intentionally exposed for direct client writes. Covers the deferred portion of `H8`.
- Keep publication cache keys and authenticated learner data separate. Do not let user-specific state leak into prerendered publication artifacts, CDN cache keys, or future service-worker publication caches.
- Treat the current local auth config as non-production. Before hosted rollout, harden signup or OTP abuse controls, password settings if passwords are enabled, email confirmation posture, exact redirect allow-lists, secure password change, and MFA for any privileged human accounts. Covers `H4`.
- Add production deployment requirements for SSL enforcement, network restrictions, and secret-handling discipline alongside the deployment target decision. Covers `M8`.
- Add `pnpm exec supabase db lint` and advisor review to the DB change workflow before more authenticated DB work lands. Covers `L6`.

## Resolved Questions

- The first authenticated persistence shape should use the existing normalized learner tables and projection flow, not a new JSON snapshot table.
  Reason: `learner.course_enrollments`, `learner.lesson_attempts`, `learner.lesson_progress`, and `learner.preferences` already exist, are documented, and have received DB-side hardening.

## Open Questions

- Whether to remove the app-wide `ssr = false` / `prerender = true` defaults entirely or isolate authenticated routes in a dedicated server-rendered route group while leaving the existing public learn subtree prerendered.
- Which privileged server caller model should own `internal_api.sync_lesson_attempt_batch(...)`: a dedicated server-only SQL or RPC helper with private credentials, or another reviewed server-only wrapper that preserves the private-schema boundary.
- Whether the first sign-in flow should use email OTP code entry only or also permit magic-link clicks after the callback and redirect handling is reviewed end to end.
- What the first authenticated learner-projection read path should look like for prerendered public lesson pages: remote function, dedicated endpoint, or another reviewed server-owned surface.
- How the local progress snapshot should map into the active published course version when the published lesson catalog eventually diverges from the static Thai pack.
- Which hosted deployment target should own the server-capable SvelteKit runtime now that the app already depends on `@sveltejs/adapter-node` for DB-backed lesson delivery.

## Follow-Up

- Draft the exact `hooks.server.ts`, `App.Locals`, `+layout.server.ts`, and browser-client split before touching auth UI.
- Define the one-time local-to-account merge behavior and conflict rules in detail, including course-version mapping and idempotency.
- Decide and document the privileged server caller for learner sync before the first authenticated write endpoint lands.
- Build on the shipped public delivery read path rather than adding another public data surface before the authenticated route work tracked here.
- Use `docs/auth.md` as the durable security reference for common auth mistakes and rollout guardrails.
