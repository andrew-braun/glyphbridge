# Task: Auth Boundary And Progress Sync

- Start date: 2026-05-05
- Owner: GitHub Copilot
- Status: completed

## Goal

Implement the first secure GlyphBridge account flow with server-owned Supabase auth, email-code sign-in, local-first learner UI, and authenticated progress projection without exposing a browser Supabase client.

## Scope

- Add the request-scoped Supabase auth boundary.
- Add email OTP code request, verification, and sign-out surfaces.
- Keep the root app local-first and prerender-friendly.
- Add app-owned learner projection and sync endpoints.
- Treat local/offline progress as untrusted input and project account progress on the server.
- Update durable docs and env examples for the new auth posture.

## Decisions

- Server runtime target is acceptable on Netlify or a cheaper Docker-capable host, provided SvelteKit server routes/actions are available.
- No browser Supabase client ships in v1.
- Browser code talks only to app-owned SvelteKit routes.
- Email code entry is the only v1 auth method.
- Signup is open to anyone, with production captcha, SMTP, and rate-limit hardening required before public launch.
- Account progress is server-projected. Local progress can seed or hint, but cannot directly become canonical state.

## Implementation Plan

1. Add auth dependency and request-scoped server client.
2. Add dynamic auth routes for email code request, verification, and sign-out.
3. Add server-owned learner projection and sync contracts.
4. Add database wrapper needed for server-side attempt sync.
5. Wire lesson completion and the home/learn overlays to app-owned endpoints.
6. Update docs and env examples.
7. Run focused and repo-level validation.

## Progress

- [x] Reviewed finalized plan and current repo state.
- [x] Added implementation dependencies.
- [x] Added auth boundary.
- [x] Added auth UI and actions.
- [x] Added learner projection.
- [x] Added progress sync.
- [x] Updated docs and env examples.
- [x] Ran validation.

## Validation

- Passed: `pnpm check`
- Passed: `pnpm lint` with one pre-existing warning in `src/lib/components/content/home/HomeStatsOverview.svelte`
- Passed: `pnpm stylelint`
- Passed: `pnpm db:reset`
- Passed: `pnpm db:lint`
- Passed: `pnpm build`
- Passed: `pnpm exec markdownlint-cli2 --config .markdownlint.jsonc .ai/2026-05-05-auth-boundary-progress-sync.md .ai/tasks/supabase-db-foundation/auth-sync-strategy.md docs/auth.md docs/database-dto-spec.md docs/db.md`

## Follow-Up Fixes

- Fixed Supabase lint ambiguity in `20260505120000_auth_projection_wrappers.sql` by targeting the enrollment unique constraint directly in the enrollment upsert.

## Notes

- Current local progress remains `localStorage` backed and static-pack shaped.
- The authenticated server layer must map active publication lessons to curriculum lesson UUIDs before syncing.
- The existing DB projector validates batch shape, lesson membership, time windows, and idempotency, but it is not a high-stakes anti-cheat system.
