# Task: Supabase auth and progress sync strategy

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: planned

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
  - Keep the current anonymous local progress path useful until account features are ready.
- Product:
  - Users should be able to start learning anonymously and attach progress to an account later.
  - The solution should scale from early traffic without expensive per-user SaaS pricing.
- Security:
  - Any implementation must use server-side session verification, clear public/private env separation, and least-privilege data access.

## Decisions

- Decision: Prefer Supabase Auth with `@supabase/ssr` and a small Postgres-backed progress model.
  Reason: It provides the cleanest combined path for auth and progress syncing with a realistic free or low-cost entry point.
- Decision: Keep anonymous localStorage progress and merge it into the authenticated record on first sign-in.
  Reason: The app remains useful before login, and users do not lose early progress when accounts are introduced.
- Decision: Start with email OTP or magic-link authentication before adding more providers.
  Reason: It minimizes surface area and support burden for the first secure rollout.

## Progress

- [x] Discovery and research
- [x] Strategy recommendation captured
- [ ] Architecture spec
- [ ] Implementation planning

## Current Recommendation

- Move to a server-capable SvelteKit deployment posture when auth work begins.
- Add request-scoped Supabase clients via `@supabase/ssr`, validate sessions server-side, and expose only the minimum session data to the app shell.
- Store per-user progress in a small relational model and merge anonymous local progress into that model on first authenticated session.

## Next-Phase Security Gates

These items are intentionally deferred until the authenticated SvelteKit boundary work starts. They should ship as part of that next phase, not as optional cleanup after it.

- Replace the module-scoped client in `src/lib/supabase.ts` with request-scoped `@supabase/ssr` clients and add the matching `hooks.server.ts` session flow. Covers `H5` and `L5` from the DB audit.
- Keep anonymous auth disabled until the anon-to-account merge flow, captcha posture, and rate limits are designed together. Covers `M11`.
- Keep authenticated writes server-owned by default, then add column-level grants only for any learner table that is intentionally exposed for direct client writes. Covers the deferred portion of `H8`.
- Treat the current local auth config as non-production. Before hosted rollout, harden password policy, email confirmation, secure password change, captcha, and MFA settings. Covers `H4`.
- Add production deployment requirements for SSL enforcement and network restrictions alongside the deployment target decision. Covers `M8`.
- Add `pnpm exec supabase db lint` and advisor review to the DB change workflow before more authenticated DB work lands. Covers `L6`.

## Open Questions

- Whether the first authenticated persistence shape should be a JSON snapshot table or fully normalized lesson-progress rows.
- Which deployment target should own the server-capable SvelteKit runtime when auth work starts.

## Follow-Up

- Draft the route, schema, and RLS plan before touching auth code.
- Define the one-time local-to-account merge behavior and conflict rules in detail.
- Land the DB hardening and input-bounds remediation phases before starting the authenticated route work tracked here.
