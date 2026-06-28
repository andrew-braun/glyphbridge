# Cloudflare Alpha Deployment Plan

## Summary

Deploy Glyphin as a Cloudflare Pages Git deployment backed by a fresh production
Supabase project. Use a custom domain for the first shared alpha URL. Keep
Supabase as the runtime backend and make the SvelteKit app edge-compatible by
removing Node runtime filesystem dependencies and build-time Supabase artifact
generation from the deploy path.

Reference docs:

- [SvelteKit Cloudflare adapter](https://svelte.dev/docs/kit/adapter-cloudflare)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers secrets/config](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Supabase SvelteKit auth](https://supabase.com/docs/guides/auth/server-side/sveltekit)

## Implementation Steps

### 1. Prepare A Deployment Branch And Tracker

- Work on `deploy/cloudflare-alpha`.
- Platform research context lives in `.ai/archive/2026-06-27-deployment-platform-research.md`.
- Treat Supabase project creation, auth, env vars, DNS, and production deploy as
  security-sensitive sign-off gates.

### 2. Make The SvelteKit App Cloudflare-Compatible

- Replace `@sveltejs/adapter-node` with `@sveltejs/adapter-cloudflare`.
- Remove unused `@sveltejs/adapter-static` if still unused after the adapter
  swap.
- Update `svelte.config.js` to import and use the Cloudflare adapter.
- Add `wrangler` as a dev dependency for local Cloudflare Pages simulation.
- Add `wrangler.jsonc` with the Pages project name,
  `compatibility_date: "2026-06-27"`, and
  `compatibility_flags: ["nodejs_compat"]`.
- Keep `vite.config.ts` unchanged unless Cloudflare-specific local dev support
  proves necessary.

### 3. Remove Runtime Filesystem And Build-Time DB Coupling

- Change `src/lib/server/published-lessons.ts` so production lesson reads always
  delegate to `delivery-lessons.ts`.
- Remove the runtime `.generated` manifest/artifact read path from SvelteKit
  server code.
- Remove the `prebuild` script from `package.json` so Cloudflare Git builds do
  not require Supabase access at build time.
- Keep `publication:generate` as a manual authoring/diagnostic script unless it
  becomes unused later.

### 4. Update Durable Docs And Instructions

- Update `AGENTS.md` and `.github/copilot-instructions.md` to say the deployment
  target is Cloudflare Pages with a server-capable SvelteKit runtime.
- Update `docs/auth.md` to replace the stale `adapter-node` wording with
  Cloudflare Pages/SvelteKit server runtime wording.
- Add a short `docs/deployment-cloudflare.md` runbook covering build settings,
  env vars, deploy flow, custom domain, rollback, and smoke tests.

### 5. Create The Production Supabase Project

- Create a fresh Supabase project for alpha.
- Default region: Southeast Asia/Singapore, because the product is Thai-focused
  and the local environment timezone is Bangkok.
- Capture project ref, API URL, and publishable/anon key.
- Link locally with `pnpm exec supabase link --project-ref <ref>`.
- For this fresh alpha only, run `pnpm exec supabase db reset --linked` after
  explicit confirmation that the remote project has no real user data.
- After real alpha users exist, stop using remote reset and switch to
  migration-only `pnpm exec supabase db push`.

### 6. Configure Cloudflare Pages Git Deployment

- Create a Cloudflare Pages project connected to the Git repository.
- Production branch: the branch that will receive the deploy work, then later
  `main` once merged.
- Build command: `pnpm build`.
- Build output directory: `.svelte-kit/cloudflare`.
- Set build/runtime version env vars: `NODE_VERSION=24.15.0` and
  `PNPM_VERSION=11.6.0`.
- Set production and preview runtime env vars:
  - `SUPABASE_DELIVERY_URL`
  - `SUPABASE_DELIVERY_ANON_KEY`
  - `SUPABASE_AUTH_URL`
  - `SUPABASE_AUTH_PUBLISHABLE_KEY`
- Configure the same compatibility date and `nodejs_compat` flag in the Pages
  project if the dashboard does not inherit `wrangler.jsonc`.

### 7. Attach The Custom Domain

- Add the custom domain in Cloudflare Pages.
- If the domain is not already on Cloudflare DNS, add the zone or configure the
  required CNAME.
- Wait for SSL provisioning to complete.
- Configure Supabase Auth URL settings:
  - Site URL: the custom domain.
  - Redirect allow list: the custom domain and the Cloudflare preview domain if
    preview auth testing is needed.
- Confirm email OTP templates still send the six-digit code flow expected by the
  current `/auth` page.

### 8. Deploy And Smoke Test

- Push the deployment branch and let Cloudflare Pages build from Git.
- Verify the Pages deployment logs for adapter output, env availability, and no
  build-time Supabase artifact generation.
- Test on the custom domain:
  - `/` renders.
  - `/learn` loads published lessons from Supabase.
  - `/learn/1` and `/learn/1/practice` render.
  - `/api/learner/projection` returns unauthenticated projection for signed-out
    users.
  - Email OTP sign-in works.
  - Completing a lesson syncs progress and survives refresh/navigation.
  - Sign-out clears the session.
- Confirm secure cookies are `HttpOnly`, `Secure`, and `SameSite=Lax`.
- Confirm Supabase keys are not serialized into client bundles or page data.

### 9. Rollout And Rollback

- Share the custom domain only after smoke tests pass.
- Keep Cloudflare Pages preview deployments enabled for future QA.
- Roll back web issues using Cloudflare Pages deployment rollback.
- Roll back code issues by reverting the Cloudflare adapter/config commit.
- Do not delete/recreate the Supabase project during alpha unless rotating all
  Cloudflare env vars is acceptable.

## Public Interfaces And Config Changes

- No learner-facing route or API shape should change in phase 1.
- Existing server-only env var names remain unchanged.
- Build behavior changes: `pnpm build` must no longer run
  `publication:generate`.
- Deployment target changes from Node adapter output to Cloudflare Pages adapter
  output.
- Runtime lesson delivery source becomes Supabase `delivery.*` only.

## Test Plan

- Local checks: `pnpm install`, `pnpm check`, `pnpm check:all`, `pnpm build`.
- Cloudflare local simulation: `pnpm exec wrangler pages dev .svelte-kit/cloudflare`
  after a successful build.
- Database checks: `pnpm db:lint`, then verify remote `delivery` and `learner`
  schemas exist after the linked reset.
- Deployed smoke tests: public lessons, lesson page, practice page, auth OTP,
  progress sync, sign-out, refresh persistence.
- Security checks: no service-role key in Cloudflare, no env values in client
  bundle, auth cookies secure, Supabase Auth redirect URLs limited to alpha
  domains.

## Assumptions

- First deploy path is Cloudflare Pages Git integration, not Wrangler direct
  deploy.
- First shared URL is a custom domain, with Pages preview URLs kept for QA.
- Supabase production project is fresh and can be destructively rebuilt before
  real alpha data exists.
- Supabase region defaults to Southeast Asia/Singapore unless the known tester
  base is mostly elsewhere.
- Phase 2 will move reusable learner sync/projection backend contracts toward
  Supabase RPC or Edge Functions for mobile compatibility.
