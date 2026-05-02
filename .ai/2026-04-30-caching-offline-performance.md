# Caching, Offline, and Performance Strategy — Planning Doc

Created: 2026-04-30
Triggered by: S3 finding from the post-review. Adapter switched from `adapter-static` to
`adapter-node`, making all lesson routes dynamic server requests with no caching or
offline story.

## Problem Statement

The switch to `adapter-node` is necessary because delivery reads require a server runtime.
But it removes two things that `adapter-static` gave for free:

1. **Zero-latency repeat visits** — static files are served from CDN edge
2. **Offline / PWA capability** — pre-cached static assets kept the app usable without a
   connection

Lesson content (published curriculum) changes rarely. Learner progress lives in localStorage.
So there is a large gap between "how often does lesson content actually change?" (monthly
at most) and "how often do we refetch it?" (every navigation).

## Decision Points to Analyse

### 1. HTTP cache headers on lesson routes

The simplest win: add `Cache-Control` in `+page.server.ts` via `setHeaders()`.

```ts
// +layout.server.ts or individual load functions
setHeaders({ "cache-control": "public, max-age=60, s-maxage=300" });
```

Questions to answer:

- What TTL is acceptable? After a curriculum update, how long can users see stale content?
- Can we use `stale-while-revalidate`?
- Do we need a cache-bust mechanism (e.g., publication ID in URL or ETag)?

### 2. SvelteKit prerendering with dynamic content

SvelteKit supports `prerender = true` per route even with a node adapter, if the route
can be pre-rendered at build time.

Could `/learn` and `/learn/[id]` be pre-rendered? They require Supabase at build time.
This is feasible (CI fetches lessons during build) but adds build complexity and removes
real-time curriculum updates without a redeploy.

Questions:

- Is a deploy-per-curriculum-update acceptable? Or do we need hot-swap without redeploys?
- Could we pre-render the lesson shell and hydrate content from a JSON endpoint?

### 3. Edge CDN caching (Vercel / Fly / Cloudflare)

With the node adapter, the server response can be cached at the CDN layer with
`Cache-Control: s-maxage` or Vercel's `x-vercel-cache` headers.

Questions:

- What hosting target is planned? (Vercel / Fly / Cloudflare Workers / self-hosted?)
- Does the target support stale-while-revalidate at the edge?

### 4. Service Worker / PWA offline support

For offline capability similar to the old static adapter, a service worker can cache:

- The pre-fetched lesson list
- Each lesson page once visited
- Static assets

SvelteKit has `@sveltejs/enhanced-img` and Vite-PWA integration. Workbox is the common
approach.

Questions:

- Is offline support a hard requirement or a nice-to-have?
- Should the service worker pre-cache all published lessons or only visited ones?
- How do we handle cache invalidation when the curriculum is updated?

### 5. Publication ID as cache key

The `delivery.course_publications.id` changes when a new curriculum publication is created.
This UUID could be used as a cache-bust suffix on lesson URLs:

```sql
/learn?pub=<uuid>
```

Or embedded in a response header for CDN purge rules.

### 6. Supabase Realtime for cache invalidation

If curriculum updates should be reflected within seconds, Supabase Realtime can push a
`course_publications` change notification to connected browsers, triggering a refetch.
This is complex and probably overkill for a curriculum that changes monthly.

---

## Recommended Approach (to be confirmed)

A pragmatic three-step path:

1. **Immediate** (low effort, high value): Add `setHeaders` with `Cache-Control: public,
max-age=60, s-maxage=600, stale-while-revalidate=86400` on the lesson load functions.
   Eliminates most redundant DB hits with no architecture change.

2. **Short-term** (medium effort): Decide on hosting target and configure CDN-level caching.
   Add a publication-ID-based ETag so CDN can serve stale while checking for freshness.

3. **Long-term**: Evaluate PWA/service-worker approach once hosting target and offline
   requirements are clearer.

---

## Action Items

- [ ] Confirm hosting target (Vercel / Fly / other)
- [ ] Confirm whether offline is a requirement for MVP
- [ ] Prototype `setHeaders` Cache-Control in a branch and measure latency improvement
- [ ] Draft a curriculum-update runbook: what happens when a new publication is created?
- [ ] Decide acceptable staleness window for curriculum content
