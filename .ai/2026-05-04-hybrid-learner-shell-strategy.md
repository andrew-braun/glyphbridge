# Task: Hybrid Learner Shell Strategy

- Start date: 2026-05-04
- Owner: GitHub Copilot
- Status: completed

## Goal

Update the auth and offline planning docs so GlyphBridge explicitly targets a
hybrid architecture: publication-owned lesson content stays prerendered and
cacheable, while the learner-aware main screen and progress state are local-first
with authenticated server revalidation when available.

## Scope

- Refresh the auth rollout plan to reject whole-app SSR-first personalization.
- Document the learner-aware home screen as a local-first shell.
- Clarify the role of service workers versus local learner storage.
- Keep the existing security and server-owned learner-write boundaries intact.

## Decisions

- The learner-aware main screen should render immediately from last-known local
  state, not wait on SSR.
- Published lesson content should remain prerendered and publication-versioned.
- SSR remains necessary for trusted auth, protected operations, and reviewed
  server-owned routes, but it is not the primary rendering mode for the whole app.
- Service workers are an additive caching layer for the app shell and published
  content, not a replacement for local learner state.

## Planned Outputs

- Update `.ai/tasks/supabase-db-foundation/auth-sync-strategy.md`.
- Update `docs/auth.md`.
- Update `.ai/2026-04-30-caching-offline-performance.md`.
- Validate the touched markdown and required repo checks.

## Implemented

- Updated `.ai/tasks/supabase-db-foundation/auth-sync-strategy.md` so the auth
  plan now explicitly prefers a local-first learner-aware main screen instead of
  whole-app SSR-first personalization.
- Updated `docs/auth.md` so the durable auth guide now separates the learner
  shell, prerendered publication content, and protected server-owned auth or
  sync surfaces.
- Updated `.ai/2026-04-30-caching-offline-performance.md` so the offline plan
  now treats service workers as a cache layer and the home screen as a
  local-first learner shell with background revalidation.

## Validation

- Passed: `pnpm exec markdownlint-cli2 .ai/2026-05-04-hybrid-learner-shell-strategy.md .ai/tasks/supabase-db-foundation/auth-sync-strategy.md docs/auth.md .ai/2026-04-30-caching-offline-performance.md`
- Planned: `pnpm check`
