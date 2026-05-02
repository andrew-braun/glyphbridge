# Task: Auth Security Rollout Review

- Start date: 2026-05-02
- Owner: GitHub Copilot
- Status: in-progress

## Goal

Review and update the current GlyphBridge auth rollout plan so it matches the
actual SvelteKit and Supabase architecture, with security-first guidance for the
first authenticated release.

## Scope

- Review the existing auth and sync strategy against the current repo state.
- Verify the plan against current Supabase and SvelteKit documentation.
- Separate already-remediated DB findings from still-open app, auth, and deploy
  work.
- Produce a durable security guide covering common auth mistakes and concrete
  mitigations.

## Constraints

- Treat auth, sessions, cookies, databases, environment variables, and secure
  routes as high-risk work.
- Favor maximum security over convenience when tradeoffs are required.
- Keep learner writes server-owned by default and preserve the existing
  `delivery` versus `learner` versus private-schema boundary.
- Keep anonymous local progress as the pre-login path; do not introduce hosted
  anonymous auth unless it is explicitly designed and approved.

## Discovery Snapshot

- The app now runs with `@sveltejs/adapter-node` and already has server-owned
  delivery reads for `/learn`.
- DB hardening for the learner sync function, mutable search paths, and direct
  learner write shrinkage has already landed in the migration chain.
- The current root route config still exports `prerender = true` and
  `ssr = false`, so the auth plan must explicitly address how authenticated
  routes and session-bearing layout data will run.
- `src/lib/supabase.ts` is still a module-scoped browser-style client and must
  not be reused for authenticated server work.
- `src/app.d.ts` does not yet define `App.Locals` for a request-scoped Supabase
  client or verified session helpers.

## Planned Outputs

- Update `.ai/tasks/supabase-db-foundation/auth-sync-strategy.md`.
- Add a durable auth security reference under `docs/`.
- Validate the touched markdown and repo checks relevant to the change.
