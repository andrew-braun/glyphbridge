# Task: Deploy to Void (Cloudflare) + Supabase

- Start date: 2026-06-13
- Owner: Andri
- Status: planning

## Goal

Get a work-in-progress build of Glyphin deployed publicly so it can be shown to
others. Hosting target: Void (deploys to Cloudflare's edge / Workers). Database:
existing Supabase project (server-only delivery + auth boundary). The production
database structure and content are NOT locked; we must be able to fully
overwrite/rebuild prod several times before launch without breaking the host.

## Decisions

- Host: **Void** (Cloudflare). Used as an edge host only; Glyphin keeps Supabase
  for delivery reads and auth (Void's built-in D1/KV/auth are intentionally
  unused).
- DB lifecycle pre-launch: iterate migrations locally, then
  `supabase db reset --linked` to wipe+rebuild the linked prod project from local
  migrations + seed. Same project ref/URL/keys are preserved, so host env vars
  never change between rebuilds. Switch to additive `supabase db push` once the
  schema stabilizes and real learner data exists.

## Critical blocker (edge compatibility)

- `src/lib/server/published-lessons.ts` reads pre-built artifacts from a
  `.generated/` dir at runtime via `node:fs` (`existsSync`/`readFileSync`) +
  `process.cwd()`. Cloudflare Workers has no runtime filesystem, so this path is
  invalid on the edge.
- Nothing in the repo currently writes `.generated`, so the fs fast-path is
  dormant and the code already falls back to the Supabase delivery path
  (`./delivery-lessons`). Fix is low-risk: guard/remove the fs path for the edge
  build so the runtime relies on Supabase delivery only.

## Plan / Steps

1. [ ] Edge-compat fix for `published-lessons.ts` (remove/guard `node:fs` path).
2. [ ] Swap `@sveltejs/adapter-node` -> `@sveltejs/adapter-cloudflare` in
       `svelte.config.js`; install dep; remove adapter-node if unused.
3. [ ] Add/commit `wrangler.jsonc` (compatibility_date, `nodejs_compat` flag).
       Void syncs missing bindings into this file; it is the source of truth.
4. [ ] Create Supabase prod project; `supabase link --project-ref <ref>`.
5. [ ] `supabase db push` (or `db reset --linked`) to build prod schema + seed.
6. [ ] Set the 4 private env vars as Cloudflare/Void secrets (never committed):
       SUPABASE_DELIVERY_URL, SUPABASE_DELIVERY_ANON_KEY, SUPABASE_AUTH_URL,
       SUPABASE_AUTH_PUBLISHABLE_KEY.
7. [ ] `pnpm build` locally against the Cloudflare adapter; fix any bundling/edge
       issues. Run `pnpm check`.
8. [ ] `void deploy`; verify auth (secure cookies on https) + lesson delivery.

## Open questions / follow-ups

- Confirm exact Void CLI install + auth + project-init commands against current
  Void docs at execution time (Void is new; do not assume commands).
- Confirm `@supabase/ssr` cookie handling works under Workers runtime with the
  secure-cookie path in `hooks.server.ts`.
- Decide whether the `.generated` publication pipeline is revived later (build
  step that emits artifacts into the bundle) or dropped in favor of always-on
  Supabase delivery.

## Validation

- `pnpm check` clean; `pnpm build` succeeds with the Cloudflare adapter.
- Deployed site loads `/learn` and a lesson via Supabase delivery.
- Auth sign-in sets secure cookies and persists across navigation.
