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
  - Users should be able to open the main screen and see their last-known progress and next lessons immediately, even before a network round-trip completes.
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
- `src/routes/+layout.ts` still exports `prerender = true` and `ssr = false`, which means the current main screen is already client-first and well positioned to become a learner-aware local-first shell without waiting on SSR.
- Local progress still lives in `src/lib/stores/progress.ts` and derives from the static Thai lesson pack, while the prerendered learn routes now key off the active published publication, so the first local-to-account merge must map that snapshot onto the active published course version intentionally rather than assuming the static pack is the only lesson catalog.

## Decisions

- Decision: Prefer Supabase Auth with `@supabase/ssr` and a small Postgres-backed progress model.
  Reason: It provides the cleanest combined path for auth and progress syncing with a realistic free or low-cost entry point.
- Decision: Keep anonymous localStorage progress and merge it into the authenticated record on first sign-in.
  Reason: The app remains useful before login, and users do not lose early progress when accounts are introduced.
- Decision: Prefer email OTP as the first auth method; keep password auth, OAuth providers, and Supabase anonymous auth out of v1 unless a separate product need is approved.
  Reason: It minimizes credential-management surface area, reduces account-recovery complexity, and keeps the first secure rollout easier to audit.
- Decision: Do not ship a browser Supabase client in v1.
  Reason: The browser should talk only to app-owned SvelteKit surfaces, while all Supabase auth, projection, and learner sync work stays server-owned.
- Decision: Keep published curriculum routes prerendered and publication-versioned even after auth lands.
  Reason: The lesson content is shared public data with low change frequency, while learner state is per-user and should arrive as a separate authenticated overlay rather than forcing `/learn` and `/learn/[id]` back to fully dynamic rendering.
- Decision: Do not make the whole app SSR-first just to show learner status on the main screen.
  Reason: A local-first learner shell gives the fastest launch and the best offline posture, while SSR remains necessary only for trusted auth, protected operations, and reviewed server-owned surfaces.
- Decision: Make the main screen learner-aware through a local-first snapshot plus authenticated background revalidation.
  Reason: This matches the desired Duolingo-style experience without coupling the app shell to per-request personalized HTML.
- Decision: Treat service workers as a cache layer for the app shell and publication-owned content, not as the primary store for learner state.
  Reason: Offline learner progress, merge state, and eventual sync queues need a local data model of their own and should not depend on user-specific HTML caches.
- Decision: Use email OTP code entry only for the first auth rollout; do not support magic-link clicks in v1.
  Reason: Code entry avoids callback-link scanner issues and keeps redirect handling smaller for the first secure release.
- Decision: Allow open public signup in v1, guarded by hosted Supabase abuse controls before public launch.
  Reason: The product should be generally accessible, but OTP initiation must still be rate-limited and captcha-protected in production.
- Decision: Use strictly server-projected learner data. The browser must not create a Supabase client or query Supabase directly.
  Reason: This creates a clear app-owned boundary between all users and database access, with SvelteKit server code as the only database caller.
- Decision: Preserve prerendered and local-first public surfaces wherever possible, and add dynamic server-owned auth surfaces only where trust boundaries require them.
  Reason: Published lesson content and the home shell do not need per-user HTML, while auth callbacks, learner projections, merge, and sync need verified server execution.
- Decision: Use monotonic merge rules for local-to-account progress: completed progress never regresses, best score wins, earliest completion is preserved, latest activity is preserved, and the current lesson is recomputed from verified merged progress.
  Reason: This is safe to retry and protects existing account progress from being overwritten by stale or partial local state.
- Decision: Treat local/offline progress as untrusted input once accounts exist.
  Reason: Users can edit localStorage or other client storage, so authenticated progress must be accepted only through validated lesson-attempt events and server projection rules, not by trusting a client snapshot as canonical state.

## Progress

- [x] Discovery and research
- [x] Strategy recommendation captured
- [x] Architecture and security review refreshed for the current repo state
- [ ] Implementation planning

## Current Recommendation

- Keep Supabase Auth and the existing learner schema, but treat the first auth rollout as an app-boundary project rather than a DB-foundation project.
- Add request-scoped Supabase clients via `@supabase/ssr`, validate sessions server-side, and expose only the minimum verified session data to the app shell.
- Use server-verified `getUser()` for authorization decisions. `getSession()` may participate in refresh and cookie maintenance, but it must not decide access.
- Keep learner data access strictly server-owned. Do not ship a browser Supabase client in v1; browser auth and learner state should communicate only with app-owned SvelteKit surfaces.
- Treat the main screen as a learner-aware local-first shell: render the last-known snapshot immediately, then reconcile against a small authenticated learner projection when session and network are available.
- Merge anonymous local progress into the authenticated learner model on the first verified session only through validated, server-projected attempt data, with explicit course-version mapping and idempotent conflict handling.
- Treat `/learn` and `/learn/[id]` as publication routes, not authenticated routes. Auth should add a learner-projection read path that overlays per-user progress onto those prerendered pages after hydration or through a reviewed server-rendered learner subtree when needed.
- Keep the app-wide home experience and offline posture driven by local learner state, not by SSR-personalized HTML. SSR should support trust boundaries, not replace the local-first shell.

## Refined Rollout Shape

- Keep the root home shell client-first and local-first.
- Keep public lesson content prerendered and publication-versioned.
- Add a small dynamic auth island under dedicated routes such as `/auth/*` for email-code initiation, verification, and sign-out.
- Add server-owned projection and merge surfaces that run only after a verified session exists.
- Prefer SvelteKit remote functions for first-party projection and sync calls if they fit the framework support at implementation time; otherwise use small `+server.ts` handlers with explicit validation.
- Split database callers into request-scoped user auth clients and narrowly scoped server-only privileged callers. Do not expose either surface to browser code.
- Remove or avoid direct browser access to the Supabase REST surface for learner reads. If the database grants remain broader for defense-in-depth or future tooling, the app contract should still be server-projection-only.

## Efficient Implementation Plan

1. Lock the boundary.

- Install `@supabase/ssr`.
- Replace `src/lib/supabase.ts` with server-safe helpers and no exported singleton browser client.
- Add `src/hooks.server.ts`, `App.Locals`, and a verified `safeGetSession()` helper that uses `getUser()` for trust decisions.
- Choose server-only `SUPABASE_AUTH_URL` and `SUPABASE_AUTH_PUBLISHABLE_KEY` for the request-scoped auth client, plus a separate private privileged key only if a reviewed server-only caller needs it.

1. Create dynamic auth surfaces.

- Add email-code request, email-code verify, and sign-out routes/actions under a server-rendered, non-prerendered auth branch.
- Keep signup open with `shouldCreateUser: true`.
- Reject arbitrary redirect targets with a tiny exact allow-list.

1. Add the learner projection contract.

- Define one small DTO for the home shell and lesson overlays: active publication, resume lesson, per-lesson completion state, score summary, and reconciliation metadata.
- Serve it only from verified server code.
- Cache only public publication data, not learner projection data.

1. Build the publication-to-learner map.

- Resolve `publicationId` to `course_version_id`.
- Resolve lesson ordinal or slug to curriculum lesson UUID.
- Keep this mapping server-only so local progress can be translated without exposing curriculum internals.

1. Implement trusted merge.

- Treat local progress as a candidate history, not as authority.
- Convert local completed lessons into bounded server-validated attempt records for the active publication.
- Project those attempts through the same server-owned sync path used for normal progress.
- Track merge completion/idempotency so retrying does not duplicate progress.

1. Wire the local-first shell.

- Render current local progress immediately.
- After verified sign-in, fetch the server projection and reconcile monotonically.
- Show account state from app-owned session data, not from a browser Supabase client.

1. Harden for hosted rollout.

- Configure exact site and redirect URLs.
- Enable captcha for OTP initiation.
- Tune OTP and signup rate limits.
- Wire production SMTP.
- Confirm no secrets, tokens, cookies, or learner projections appear in prerendered artifacts, CDN cache keys, service-worker publication caches, or logs.

## Current Entry Point

- The DB-side hardening prerequisites are complete.
- The public published-lesson read path over `delivery.*` is now complete and working in local development when the documented delivery env vars are set.
- The learn subtree already demonstrates the route-branch approach: public lesson content can be server-rendered and prerendered independently of the root SPA shell.
- Auth-lane next step: land the request-scoped SvelteKit auth boundary with `@supabase/ssr`, `src/hooks.server.ts`, `App.Locals`, and a server layout that exposes only minimal verified session data.
- The main screen does not need to become SSR-first for auth to land. The first learner-aware home pass can stay client-first, show the local snapshot immediately, and fetch a small authenticated learner projection after hydration.
- Add a dedicated authenticated projection surface for the home screen and public lesson overlays before introducing any protected account or sync UI that truly needs a server-rendered subtree.
- Replace the module-scoped Supabase export in `src/lib/supabase.ts` with a server-owned request boundary; do not reuse a singleton across authenticated server requests and do not add a browser Supabase client in v1.
- Do not start the first authenticated route, action, merge path, or learner sync path until that boundary exists.

## Required Implementation Sequence

1. Route and runtime boundary

- Preserve the current client-first home shell if it remains the learner-aware landing surface.
- Preserve the existing prerendered public lesson branch; do not collapse published lesson pages back into a user-specific dynamic render path just to support auth.
- Add `src/hooks.server.ts` for request-scoped Supabase setup and session refresh.
- Add `App.Locals` typing in `src/app.d.ts`.
- Add the minimal server-owned auth surface the shell needs: authenticated projection reads for learner state, plus a dedicated server-rendered subtree only for routes that truly need protected server HTML or form actions.

1. Supabase client surfaces

- Replace the current module-scoped `src/lib/supabase.ts` export with server-only request-scoped helpers.
- Do not create a browser Supabase client for auth initiation, session UI, learner reads, or learner writes in v1.
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

1. Learner-aware home screen

- Define the minimal learner projection the home screen needs, such as resume target, completed lesson state, and top-level progress summary.
- Render that home state from the last-known local snapshot immediately on launch.
- Revalidate in the background when the user is signed in and online.
- Reconcile local and server state conservatively so offline progress is not hidden or lost.

1. Learner sync and server writes

- Keep `learner.lesson_progress` and attempt projection server-owned.
- Do not call private learner-write paths through the public delivery client.
- Pick and document the privileged server caller model for `internal_api.sync_lesson_attempt_batch(...)` before implementing the first sync endpoint.
- Add a small authenticated learner-projection read path for public lesson surfaces so prerendered publication pages can fetch per-user progress without becoming per-user HTML.

1. Offline and caching follow-through

- Keep the app shell and publication-owned lesson content eligible for service-worker caching.
- Keep learner state in a local store that can later evolve beyond localStorage when offline queues and worker coordination become necessary.
- Treat IndexedDB as the likely upgrade path before adding offline sync queues or worker-mediated learner-state reads.

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
- The first sign-in flow should use email OTP code entry only.
  Reason: This keeps v1 auth smaller and avoids magic-link callback edge cases.
- Public signup should be open to anyone for v1.
  Reason: This matches the product goal, provided hosted abuse controls are configured before public launch.
- The local-to-account merge should be monotonic and server-projected.
  Reason: Local data is editable by users, so it can propose progress but cannot become canonical without server validation and projection.
- Learner reads should be strictly server-projected from the app's point of view.
  Reason: The browser should not have direct Supabase database access or contain query code.

## Open Questions

- Which authenticated account or settings surfaces, if any, should live in a dedicated server-rendered subtree while the main learner shell stays client-first.
- Which privileged server caller model should own `internal_api.sync_lesson_attempt_batch(...)`: a dedicated server-only SQL or RPC helper with private credentials, or another reviewed server-only wrapper that preserves the private-schema boundary.
- What the first authenticated learner-projection read path should look like for prerendered public lesson pages: remote function, dedicated endpoint, or another reviewed server-owned surface.
- How the local progress snapshot should map into the active published course version when the published lesson catalog eventually diverges from the static Thai pack.
- When the learner-state store should move from localStorage to IndexedDB to support offline sync queues, service-worker coordination, or richer local projections.
- Which hosted deployment target should own the server-capable SvelteKit runtime now that the app already depends on `@sveltejs/adapter-node` for DB-backed lesson delivery.

## Follow-Up

- Draft the exact `hooks.server.ts`, `App.Locals`, `+layout.server.ts`, and browser-client split before touching auth UI.
- Define the one-time local-to-account merge behavior and conflict rules in detail, including course-version mapping and idempotency.
- Define the learner-aware home projection shape and reconciliation rules before wiring the first authenticated main-screen refresh.
- Decide and document the privileged server caller for learner sync before the first authenticated write endpoint lands.
- Build on the shipped public delivery read path rather than adding another public data surface before the authenticated route work tracked here.
- Use `docs/auth.md` as the durable security reference for common auth mistakes and rollout guardrails.
