# Deployment Platform Research

## Scope

- Recommend an alpha deployment path for the SvelteKit/Supabase Glyphin app.
- Prioritize mobile-app compatibility, scalability, simplicity, low initial cost, and minimized lock-in.
- Include architecture adjustments needed to keep web and future mobile clients aligned.

## Context

- Current app uses SvelteKit 2/Svelte 5 with `@sveltejs/adapter-node`.
- Repo guidance says DB-backed lesson delivery requires a server-capable SvelteKit runtime.
- Supabase is already the planned backend foundation.

## Progress

- Created tracker on 2026-06-27.
- Inspected current project runtime and route shape.
- Researched current hosting, mobile, and Supabase platform guidance from official sources.

## Decisions

- Recommended alpha web host: Cloudflare Workers/Pages with `@sveltejs/adapter-cloudflare`, backed by Supabase Auth/Postgres.
- Recommended backend boundary: keep durable app logic in Supabase Postgres/RLS/RPC and Supabase Edge Functions so the future mobile app can call the same backend as the web app.
- Recommended mobile path: Capacitor/PWA-style mobile shell using shared Svelte UI where practical, not a second backend.

## Follow-Ups

- Convert accepted deployment direction into implementation tasks.
- Fix `src/lib/server/published-lessons.ts` runtime `node:fs` use before Cloudflare deployment.
- Move learner sync/projection API semantics toward Supabase Edge Functions or Postgres RPC before native mobile launch.
