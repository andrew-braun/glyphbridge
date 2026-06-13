# Task: Deploy to Void (Cloudflare) + Supabase

- Start date: 2026-06-13
- Owner: Andri
- Status: planning → ready to implement
- Primary objective: get a work-in-progress build of Glyphin live on Void ASAP
  so it can be shown to people.

## Goal

Deploy Glyphin publicly on **Void** (Vite/SvelteKit deployment platform running
on Cloudflare's edge / Workers), backed by the existing **Supabase** project for
both content delivery and auth. The production database is NOT locked; we must be
able to fully overwrite/rebuild prod several times before launch without breaking
the host. Get the first deploy up quickly; treat edge-latency tuning as a
fast-follow, not a blocker.

## Architecture decisions

- **Host: Void (Cloudflare edge).** Used primarily as an edge host for the
  SvelteKit app. Void auto-provisions only the Cloudflare resources it detects in
  code; since our code talks to Supabase over HTTP, no Void database binding is
  needed for launch.
- **Auth: stays on Supabase.** Void's built-in auth does not support SvelteKit
  meta-frameworks, and Supabase Auth is the mature choice we already use
  (`@supabase/ssr`, server-only boundary, secure cookies in `hooks.server.ts`).
- **Content: Supabase Postgres** via server-only delivery reads
  (`src/lib/server/delivery-lessons.ts`). Postgres is the right tool for
  structured curriculum; Void's built-in D1 is intentionally unused.
- **User state (progress/profile): stays on Supabase** (`learner` schema + RLS,
  existing progress sync). Do not migrate to D1/KV speculatively.
- **Cloudflare primitives (KV, Queues, Cron, Durable Objects): adopt lazily**,
  only when a concrete need appears. Void's auto-provisioning makes incremental
  adoption cheap, which is the argument against committing up front.

## Key findings / constraints

1. **Edge-compat blocker — `src/lib/server/published-lessons.ts`.** Reads
   pre-built artifacts from a `.generated/` dir at runtime via `node:fs`
   (`existsSync`/`readFileSync`) + `process.cwd()`. Cloudflare Workers has no
   runtime filesystem. Nothing in the repo currently writes `.generated`, so the
   fs fast-path is dormant and the code already falls back to the Supabase
   delivery path (`./delivery-lessons`). Fix is low-risk: drop/guard the fs path
   so the edge runtime relies on Supabase delivery only.
2. **Adapter swap required.** Project is on `@sveltejs/adapter-node`. Cloudflare
   Workers needs `@sveltejs/adapter-cloudflare`. For SvelteKit (an adapter-based
   framework) Void lets the SvelteKit Cloudflare adapter own the worker build and
   syncs bindings into `wrangler.jsonc`, which becomes the source of truth.
3. **`nodejs_compat` needed.** `@supabase/supabase-js` / `@supabase/ssr` rely on
   some Node APIs; the `nodejs_compat` compatibility flag must be set in
   `wrangler.jsonc` (Void also ensures `nodejs_als`).
4. **Per-request auth round-trip (latency, not a blocker).** `hooks.server.ts`
   calls `supabase.auth.getUser()` on every request → a network hop to the Auth
   server on every navigation. Fixable post-launch via asymmetric JWT signing
   keys + `supabase.auth.getClaims()` (local JWKS verification, no round-trip).
   See Phase 1.
5. **Env access is adapter-agnostic.** All Supabase reads use
   `$env/dynamic/private`, which resolves from the Worker's runtime vars/secrets
   on the Cloudflare adapter — no code change to env access needed.

## Void command reference (verified against void.cloud/guide/quickstart)

- Install CLI as a **dev dependency** (global install is discouraged — CLI must
  match the runtime version): `pnpm add -D void`
- Vite plugin in `vite.config.ts`: `import { voidPlugin } from "void"` →
  `plugins: [voidPlugin()]`
- Initialize: `pnpm exec void init` (interactive: pick Svelte; for the DB starter
  we do NOT need Void's DB — we use external Supabase)
- Authenticate: `pnpm exec void auth login`
- Local dev: `pnpm dev` (Vite runs server code in the production Workers runtime)
- Set deploy secrets: `pnpm exec void secret put KEY=value`
- Deploy: `pnpm exec void deploy`
- Note: `.env` is auto-loaded locally via Vite `loadEnv` and merged into worker
  `vars`; deploy-time secrets go through `void secret put`.

---

## PHASE 0 — Critical path to first live deploy (do this to get up ASAP)

> Security-sensitive steps (Supabase project, secrets, auth) require human
> sign-off per AGENTS.md. Steps 1–3 are local, reversible code changes that can
> proceed immediately.

### A. Make the app edge-ready (local, reversible)

1. [ ] **Fix `published-lessons.ts` edge-compat.** Remove the `node:fs` /
       `process.cwd()` `.generated` fast-path and delegate directly to
       `./delivery-lessons` (the existing fallback). Keep the public function
       signatures (`getPublishedLessonVersion/Cards/Lesson/Entries`) unchanged so
       `routes/learn/+page.server.ts` and `routes/learn/[id]/+page.server.ts`
       are untouched. Verify no other `node:fs` usage exists (grep already shows
       this is the only file).
2. [ ] **Swap adapter.** `pnpm add -D @sveltejs/adapter-cloudflare` and remove
       `@sveltejs/adapter-node`. In `svelte.config.js` replace the import and
       `adapter: adapter()` accordingly.
3. [ ] **Add Void + Vite plugin.** `pnpm add -D void`; add `voidPlugin()` to
       `vite.config.ts`.
4. [ ] **Create `wrangler.jsonc`** with `compatibility_date` (today's date) and
       `compatibility_flags: ["nodejs_compat"]`. No resource bindings needed for
       launch (Supabase is external).
5. [ ] **Local verify (pre-cloud):** `pnpm check` then `pnpm build` against the
       Cloudflare adapter. Resolve any bundling/edge errors here before touching
       the cloud. Optionally `pnpm dev` to smoke-test under the Workers runtime.

### B. Provision Supabase production (sign-off required)

1. [ ] **Create the prod Supabase project** in the dashboard. Capture the project
       ref, API URL, and publishable/anon key.
2. [ ] **Link the CLI:** `pnpm exec supabase link --project-ref <ref>`.
3. [ ] **Build prod schema + seed:** `pnpm exec supabase db push` (additive) or,
       for a clean rebuild, `pnpm exec supabase db reset --linked`. See Database
       lifecycle below.
4. [ ] **Sanity-check** with `list_tables` / advisors that `delivery` + `learner`
       schemas and RLS landed as expected.

### C. Wire up Void + deploy (sign-off required)

1. [ ] **Init + auth:** `pnpm exec void init` (select Svelte), then
       `pnpm exec void auth login`.
2. [ ] **Set the 4 secrets** (never commit these):
   - `pnpm exec void secret put SUPABASE_DELIVERY_URL=...`
   - `pnpm exec void secret put SUPABASE_DELIVERY_ANON_KEY=...`
   - `pnpm exec void secret put SUPABASE_AUTH_URL=...`
   - `pnpm exec void secret put SUPABASE_AUTH_PUBLISHABLE_KEY=...`
     (Delivery + Auth URLs/keys point at the same prod project unless we
     deliberately split projects later.)
3. [ ] **Deploy:** `pnpm exec void deploy`.
4. [ ] **Post-deploy smoke test** (see Validation): `/learn` loads via Supabase
       delivery; a lesson opens; sign-in sets secure cookies and persists across
       navigation.

---

## PHASE 1 — Edge-latency optimizations (fast-follow, NOT blocking launch)

Supabase stays the source of truth. Goal: stop round-tripping past the edge for
the most frequent operations. Ranked by leverage.

1. [ ] **Auth verification (biggest win).** Switch the Supabase project to
       **asymmetric JWT signing keys (ES256/RS256)**, then replace
       `supabase.auth.getUser()` in `hooks.server.ts`'s `safeGetSession` with
       `supabase.auth.getClaims()`, which verifies the JWT locally against the
       cached JWKS (`/.well-known/jwks.json`) — no round-trip. Optionally cache
       the JWKS in Cloudflare KV and pass via `getClaims({ jwks })` so cold Worker
       isolates stay edge-local. Security-sensitive → sign-off required.
       Docs: supabase.com/docs/reference/javascript/auth-getclaims,
       supabase.com/docs/guides/auth/signing-keys
2. [ ] **Content edge-caching.** Cache lesson content keyed by
       `publicationCacheKey` (Workers Cache API or KV), long TTL, invalidate on
       publish. Reuses the existing publication-versioning design (the same idea
       the dormant `.generated` artifacts reached for). Optional: a Cron Trigger
       refreshes edge content from Supabase on publish so the hot read path never
       hits Postgres.
3. [ ] **Per-user progress: defer.** Caching mutable per-user state is the hard
       invalidation problem; KV is globally eventually consistent (~60s) and
       writes here are infrequent, so the payoff is small and the staleness risk
       is real ("I finished it, why isn't it marked?"). Leave on Supabase. If
       measured latency later justifies it, use a **Durable Object per user**
       (strongly consistent, edge-located, async write-behind to Supabase) rather
       than KV caching.

---

## Database lifecycle (pre-launch, structure not locked)

- Iterate migrations + `seed.sql` locally; test with `pnpm db:reset` (local
  Docker).
- Wipe + rebuild prod from local migrations: `supabase db reset --linked`
  (drops everything, replays migrations + seed against the linked project).
- This **preserves the same project ref/URL/keys**, so Void secrets never change
  between rebuilds — do NOT delete/recreate the project (that rotates keys and
  forces a secret update).
- While iterating, **squash throwaway migrations** so the history stays clean and
  `reset --linked` stays reliable.
- Once schema stabilizes and real learner data exists, switch to additive
  `supabase db push` only (no more destructive resets against prod).

## Environment variables (all private; server-only)

| Variable                        | Purpose                               | Where set                  |
| ------------------------------- | ------------------------------------- | -------------------------- |
| `SUPABASE_DELIVERY_URL`         | Content delivery reads                | Void secret + local `.env` |
| `SUPABASE_DELIVERY_ANON_KEY`    | Content delivery anon/publishable key | Void secret + local `.env` |
| `SUPABASE_AUTH_URL`             | Supabase Auth endpoint                | Void secret + local `.env` |
| `SUPABASE_AUTH_PUBLISHABLE_KEY` | Supabase Auth publishable key         | Void secret + local `.env` |

All consumed via `$env/dynamic/private`. Never expose to the client; never commit.

## Open questions / verify at execution time

- `void init` DB-starter selection: confirm we can proceed without provisioning a
  Void DB (we rely on external Supabase). If init forces a DB choice, pick the
  lightest and leave it unused, or use the Cloudflare-adapter + `wrangler deploy`
  path directly.
- Confirm `@supabase/ssr` cookie set/get works under the Workers runtime with the
  secure-cookie path in `hooks.server.ts` (https → `secure: true`). Smoke-test in
  Phase 0 step C4.
- Confirm whether `void deploy` or `vite build && wrangler deploy` is the
  preferred path for adapter-based SvelteKit on current Void.
- Decide later whether to revive the `.generated` publication pipeline (build
  step emitting artifacts into the bundle) or keep always-on Supabase delivery +
  Phase 1 content caching.
- Note: a `/void` Claude Code skill exists; only use it if it is actually
  installed in this environment — do not assume.

## Validation checklist

- [ ] `pnpm check` clean.
- [ ] `pnpm build` succeeds with `@sveltejs/adapter-cloudflare`.
- [ ] Local `pnpm dev` smoke test under Workers runtime (optional but useful).
- [ ] Deployed `/learn` lists lessons via Supabase delivery.
- [ ] Deployed lesson route renders a lesson and its next-lesson link.
- [ ] Sign-in works; secure cookies set on https; session persists across nav.
- [ ] No secrets present in the client bundle or logs.

## Rollback / safety

- Phase 0 A (steps 1–5) is local and git-reversible; commit on a branch.
- The adapter swap is the only structural change; reverting to `adapter-node`
  restores the prior (Node-host) deploy posture if Void proves unsuitable.
- Prod Supabase data is disposable pre-launch (reset workflow above), so a bad
  schema push is recoverable via `supabase db reset --linked`.
