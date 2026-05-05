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

## Current Architectural Read

The current implementation already separates the two concerns that matter here:

- Published lesson content is loaded through the server-owned `delivery` boundary.
- Learner progress and lesson completion state are client-owned and localStorage-backed.

That means a static-first lesson experience is realistic. The published lesson shell and
lesson payloads can become build-time artifacts, while learner-specific state can hydrate
after page load and progressively update badges, locks, scores, and resume positions.

The same split should guide the main screen:

- The learner-aware home shell should render from the last-known local snapshot immediately.
- Signed-in learner data should revalidate in the background instead of blocking first paint.
- Service workers can cache the shell and publication content, but they are not the storage
  model for learner state.

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

A pragmatic host-agnostic path:

1. **Primary direction: static-first published lessons.**
   Treat the active publication as a build input, generate a versioned lesson payload at
   build time, and prerender `/learn` plus `/learn/[id]` from that artifact. Because
   redeploys are acceptable, this is simpler and more portable than trying to recreate
   Next.js-style ISR semantics across different hosts.

2. **Keep the learner shell local-first.**
   The main screen should not wait on SSR to feel personalized. Render last-known learner
   progress, current lesson, and next-lesson cues from the local snapshot first, then
   reconcile against a server-backed learner projection when session and network are
   available.

3. **Keep learner state as a dynamic overlay.**
   Anything auth- or learner-specific should load separately from the published lesson
   content. Today that is localStorage-backed progress; later it can become an auth-backed
   learner projection fetched after hydration. This keeps roughly 80% to 90% of the page
   static while still allowing real-time progress, streak, drill history, resume-state
   updates, and a learner-aware home shell.

4. **Use SSR only where trust boundaries require it.**
   Auth, account management, protected writes, and reviewed server-owned sync surfaces need
   request-scoped server auth. But that does not imply whole-app SSR-first rendering, and it
   should not force the learner shell or public lesson pages into per-user HTML.

5. **Use HTTP caching as a transitional or secondary optimization.**
   If lesson reads remain server-rendered for a while, add `Cache-Control` with
   `stale-while-revalidate` on those responses. But that should be treated as an interim
   performance improvement, not the long-term core architecture.

6. **Use publication ID as the version boundary everywhere.**
   The active `delivery.course_publications.id` should become the cache-bust key for
   generated lesson artifacts, service-worker cache names, ETags, and any future CDN
   invalidation workflow.

7. **Do not pursue realtime curriculum invalidation.**
   A new publication can land on the next deploy or cache refresh window. Supabase
   Realtime is unnecessary for this problem.

## Why Not Full ISR First

SWR behavior is still useful, but the exact Next.js ISR model is not the best first step
here:

- SvelteKit does not provide a single host-agnostic ISR primitive with the same ergonomics.
- Netlify and Cloudflare have different edge-cache and revalidation semantics.
- Redeploy-per-publication is acceptable, which removes most of the value of on-demand page
  regeneration.

If we want the user-visible effect of ISR, the simpler route is:

1. prerender the published lesson pages from a build snapshot
2. version the snapshot by publication ID
3. optionally add SWR headers or a service worker for faster refresh of cached assets

That gets the same practical outcome for this product with less platform-specific behavior.

## Static Plus Dynamic Overlay Feasibility

This is realistic and already matches the current direction of the codebase.

- The prerendered HTML can include the full lesson content, structure, and metadata.
- After hydration, the client can apply learner-specific state such as current lesson,
  completed badges, drill scores, and resume points.
- If a piece of static UI depends on dynamic data, render a neutral initial state and let
  hydration refine it. Examples: lock badges, "current lesson" markers, or personal stats.
- Avoid making SEO-critical text or core lesson copy depend on auth-specific data.

The design rule is simple: published pedagogy stays static; learner projection stays
dynamic.

## Service Worker Primer

A service worker would sit in the browser between the app and the network.

At install time it can pre-cache:

- the app shell and static assets
- the lesson index
- either all published lesson payloads or only a manifest plus visited lessons

At fetch time it can apply different strategies by data type:

- **Cache-first** for versioned static assets
- **Stale-while-revalidate** for published lesson documents or JSON payloads
- **Network-first** for learner-specific reads when freshness matters
- **Network-only with retry/queue later** for writes or sync operations

At update time it can invalidate safely by using the publication ID in the cache name.
When a new publication ships, the next service-worker activation can drop old lesson caches
and warm the new set.

### Complexity Assessment

- **Read-only offline lessons:** medium complexity, addable later
- **Offline learner progress with eventual server sync:** materially higher complexity

One practical consequence follows from that second point: once offline learner sync or
worker-coordinated reads are introduced, the learner snapshot should move beyond localStorage
to IndexedDB or another worker-friendly local store.

So this is not a feature that requires the whole app to be architected around it today.
It becomes architecture-shaping only when offline writes, sync queues, merge rules, and
conflict resolution become product requirements. For the current product shape, a service
worker is an additive enhancement after the static/dynamic split is in place.

## Implemented (2026-05-02)

- Added `pnpm publication:generate` and a `prebuild` hook that writes a versioned lesson
  artifact to `.generated/published-lessons.json` before `pnpm build`.
- Added a `published-lessons` server boundary so the learn routes can read the generated
  artifact instead of depending on runtime delivery queries.
- Added `src/routes/learn/+layout.ts` with `ssr = true` and `prerender = true`, allowing
  the learn subtree to prerender even though the root layout still defaults to SPA mode.
- Added explicit prerender entries for `/learn/[id]` so each lesson page is generated from
  the snapshot.
- Tightened the export script so `pnpm publication:generate` now hard fails when the
  delivery publication cannot be reached. Local and CI builds both require a working
  delivery source.
- Moved learn-index progress badges and lock state behind a post-hydration gate so the
  prerendered `/learn` HTML now contains only publication-owned lesson content.
- Added a fixed publication manifest plus publication-scoped artifact file and cache key so
  the generated lesson snapshot, learn-route page data, and future service-worker cache
  names can all share the same publication version boundary.
- Planned the current lesson-locking overlay to move from localStorage-backed progress to a
  server-backed learner projection once the authenticated route boundary lands.
- Clarified that the main learner shell should stay local-first rather than become SSR-first
  when auth arrives.

---

## Action Items

- [x] Design a build-time publication export step from `delivery.*` into a versioned lesson
      artifact
- [x] Prototype prerendered `/learn` and `/learn/[id]` backed by the generated artifact
- [x] Split learner-specific badges, stats, and progress into a post-hydration overlay path
- [x] Finish cache naming and versioning rules beyond the new `publicationId` field in the
      generated artifact
- [ ] Evaluate Vite PWA or Workbox only after the static/dynamic split lands
- [ ] Keep `Cache-Control` plus `stale-while-revalidate` as the fallback option if a route
      remains server-rendered during the transition
- [ ] Replace the localStorage-backed learn-card overlay with a server-backed learner
      projection once auth-backed learner state is available in the app shell
- [ ] Define when the learner-state store should move from localStorage to IndexedDB for
      offline sync queues or service-worker coordination
