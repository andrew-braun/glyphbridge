# Auth Guide

This document is the durable reference for adding authentication and authenticated
learner sync to GlyphBridge.

Use it together with `docs/security-review-checklist.md`, `docs/db.md`, and
`docs/database-dto-spec.md` whenever auth, sessions, cookies, secure routes, or
learner-owned data are being changed.

## Current Architecture Snapshot

- GlyphBridge now has a real server runtime via `@sveltejs/adapter-node`.
- `/learn` now renders through a dedicated `ssr = true` and `prerender = true`
  route branch that reads published lesson bundles from `delivery.*` into a
  build-time lesson artifact.
- The published lesson artifact now carries a `publicationId` and
  `publicationCacheKey`, which define the cache and version boundary for public
  lesson content.
- Local anonymous progress still lives in `src/lib/stores/progress.ts` and uses
  localStorage.
- The learn index now applies learner-specific lesson badges and locking after
  hydration, which means public lesson HTML is publication-owned while learner
  state is already treated as an overlay.
- The learner schema and sync projector already exist in Supabase, and the
  DB-side hardening for direct attempt writes, mutable search paths, and input
  bounds has landed.
- The app shell still defaults to `prerender = true` and `ssr = false` at the
  root layout, so auth work must intentionally establish a server-rendered auth
  boundary instead of assuming the current client-only shell is sufficient.

## Security-First Decisions

- Use Supabase Auth with `@supabase/ssr` for request-scoped server clients.
- Keep anonymous local progress as the pre-login path. Do not enable Supabase
  anonymous auth in v1.
- Prefer email OTP for the first auth release. Keep password auth and social
  providers out of scope unless a separate review approves them.
- Use email OTP code entry only in v1. Do not enable magic-link click handling
  until callback redirects and email-link scanner behavior are reviewed end to
  end.
- Keep the learner-aware home screen local-first. It should render from the
  last-known learner snapshot immediately and revalidate from the server only as
  an enhancement.
- Keep learner reads and writes server-owned. Do not ship a browser Supabase
  client in v1; browser code talks only to app-owned SvelteKit routes.
- Authorize from verified server-side user lookups such as `getUser()`, not from
  cookie-derived session payloads alone.
- Keep any service-role or other privileged credential in a dedicated server-only
  module. Never import it into universal or browser code.
- Use SSR for trust boundaries and protected operations, not as the primary way
  to personalize every learner-facing page.
- Server-only Supabase auth works with local-first public UX.

## Current Auth Surface

- `/auth` now acts as both the email-code sign-in screen and the first account
  management panel for signed-in learners.
- When sign-in starts from `/auth` without an explicit safe `next` override, OTP
  verification returns the learner to `/auth` so the account panel can render
  immediately.
- Local Supabase development uses a committed OTP-first mail template at
  `supabase/templates/magic-link.html` and wires it through
  `supabase/config.toml`.
- The local email template intentionally emphasizes `{{ .Token }}` and a link
  back to `/auth` instead of relying on one-click magic-link sign-in, which
  avoids email-link scanner issues and matches GlyphBridge's current product
  flow.

## Required App Boundary

Before the first authenticated route or sync endpoint ships:

- Add `src/hooks.server.ts` and create a request-scoped Supabase server client.
- Define `App.Locals` in `src/app.d.ts` for the request-scoped client and the
  minimal verified auth state exposed to routes.
- Add the authenticated projection read path the learner shell needs.
- Add a dedicated server-rendered subtree only for account or sync surfaces that
  truly need protected server HTML or server form actions.
- Replace the current module-scoped `src/lib/supabase.ts` singleton with a
  server-only auth boundary. Keep Supabase URL and publishable key in server-only
  environment variables for v1.

The public lesson branch does not need to lose prerendering for auth to work,
and the main screen does not need to become SSR-first to feel learner-aware.
Treat published lesson routes, the learner shell, and protected server-owned
surfaces as separate concerns.

## Learner-Aware Home Screen

The desired main-screen behavior is:

- render the last-known learner snapshot immediately
- show the next lesson or resume target without waiting on a server response
- revalidate against a small authenticated learner projection when the user is
  signed in and online
- keep working when the network is down

This means the main screen should stay local-first even after auth lands.
Authenticated server data improves correctness and cross-device sync, but it
should not be required for the first render of the learner shell.

## Interaction With Prerendering

The current direction should be preserved:

- Public curriculum content stays prerendered and publication-versioned.
- The learner-aware home shell can stay client-first and still feel personalized.
- Authenticated learner state arrives through a server-owned learner projection.
- Per-user data should overlay prerendered lesson pages instead of forcing those
  pages back to fully dynamic per-user HTML.

This means the first auth rollout should not treat `/learn` and `/learn/[id]` as
authenticated routes. They are public publication routes with optional
authenticated enhancement.

## Offline Direction

- Service workers should cache the app shell and publication-versioned lesson
  content.
- The local learner snapshot remains the immediate offline source for home-screen
  status, completion badges, and resume cues.
- LocalStorage is acceptable for the current lightweight snapshot, but it is not
  the long-term home for offline sync queues or worker-coordinated learner
  state.
- Before offline sync queues or worker-mediated learner reads are added, move the
  learner-state store to IndexedDB or another worker-friendly local store.

## Recommended Flow Shape

1. The user starts anonymously with local progress in localStorage.
2. Sign-in is initiated through an email OTP code flow.
3. `hooks.server.ts` refreshes cookies and provides a request-scoped client.
4. The learner-aware home screen renders from the last-known local snapshot
   immediately.
5. Server routes or actions verify the user with `getUser()` before any learner
   read or write.
6. A server-owned merge path converts the local snapshot into the learner schema
   for the active published course version.
7. The app fetches a small authenticated learner projection and reconciles the
   home screen plus any public lesson overlays.
8. Public lesson pages fetch or receive a small learner projection keyed to that
   published course version and apply it as an overlay.
9. Future learner progress sync stays server-owned and uses the hardened learner
   projection boundary.

## Common Mistakes And How To Avoid Them

- Using a module-scoped Supabase client on the server. Avoid it by creating the
  server client per request in `hooks.server.ts`.
- Authorizing from `getSession()` on the server. Avoid it by treating
  `getSession()` as cookie refresh state only and using `getUser()` for any trust
  decision.
- Adding `PUBLIC_` Supabase env vars or browser-oriented helpers without a
  deliberate product decision. Avoid it by keeping the v1 Supabase surface
  server-only.
- Importing a service-role key into universal code, `+page.ts`, or any browser
  bundle. Avoid it by isolating privileged credentials in server-only modules and
  never re-exporting them.
- Letting the browser write learner progress directly because RLS exists. Avoid it
  by keeping learner writes behind server-owned routes or actions and treating RLS
  as a last line of defense rather than the primary application contract.
- Trusting raw local progress after sign-in. Avoid it by treating local progress
  as untrusted input and accepting account progress only through validated server
  projection paths.
- Trusting any user-supplied redirect target after sign-in or sign-out. Avoid it
  by using an exact allow-list and normalizing redirects server-side.
- Copying local Supabase auth settings into production assumptions. Avoid it by
  treating `supabase/config.toml` as local-dev posture only and documenting hosted
  settings separately.
- Enabling password auth by default when the product does not need it yet. Avoid
  it by starting with email OTP and reviewing password auth as a separate feature.
- Allowing magic-link redirects without thinking about email link scanners,
  cross-device flows, or stale redirect state. Avoid it by preferring OTP code
  entry first and reviewing magic-link behavior end to end before enabling it.
- Logging tokens, cookies, session payloads, or raw auth errors. Avoid it by
  scrubbing logs and returning minimal error messages from secure routes.
- Mixing the public delivery-read client with privileged learner-write code. Avoid
  it by keeping delivery reads and authenticated writes as separate client
  surfaces.
- Mixing publication cache keys with learner-specific state. Avoid it by keeping
  `publicationId` and `publicationCacheKey` scoped to shared lesson content while
  learner projection data remains authenticated and user-owned.
- Assuming SSR is the only way to make the main screen learner-aware. Avoid it
  by rendering the shell from local state first and treating server revalidation
  as an enhancement.
- Forgetting that the local progress store still derives from the static lesson
  pack. Avoid it by making the merge path course-version-aware and mapping local
  progress onto the active published lesson catalog intentionally.
- Making prerendered lesson pages depend on server-only auth state for their HTML.
  Avoid it by keeping the page body publication-owned and applying learner state
  through a separate authenticated read path.
- Assuming a service worker can rely on localStorage for learner-state access.
  Avoid it by treating localStorage as a temporary shell snapshot only and moving
  to IndexedDB before adding worker-coordinated offline sync behavior.
- Running the first merge more than once or without idempotency. Avoid it by
  tracking whether the local snapshot has already been merged and making the merge
  logic safe to retry.
- Assuming that a private SQL function is automatically callable from the app
  server through the existing delivery client. Avoid it by explicitly choosing and
  documenting the privileged server caller model for learner sync.
- Using the service role for ordinary authenticated reads. Avoid it by reserving
  privileged credentials for narrowly scoped server-only operations and using the
  request-scoped user client for normal session-aware reads.

## Deployment Shape

The auth rollout requires a host that can run the SvelteKit server. Netlify server
functions or a Docker-capable host are both compatible directions. A static-only
host is not enough because email-code verification, cookies, learner projections,
and sync routes all require server execution.

## Hosted Rollout Checklist

- Set the production site URL and redirect allow-list exactly. Avoid wildcards.
- Enable captcha for signup or OTP initiation before exposing the feature publicly.
- Tune auth rate limits for sign-in, signup, token verification, and token refresh.
- Wire a real SMTP provider and verify email delivery behavior.
- Keep refresh token rotation enabled.
- If password auth is enabled later, require stronger password policy, email
  confirmation, and secure password change.
- Require MFA for any privileged staff or admin accounts.
- Enforce SSL and plan database or network restrictions for the hosted project.
- Confirm that secrets, tokens, and cookies are absent from client bundles,
  rendered HTML, and logs.
- Re-run the security review checklist before deployment.

## Related References

- `docs/security-review-checklist.md`
- `docs/db.md`
- `docs/database-dto-spec.md`
- `.ai/tasks/supabase-db-foundation/auth-sync-strategy.md`
