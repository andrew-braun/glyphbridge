# DB as Single Source of Truth for Lesson Content

Created: 2026-04-30
Status: Planning — not started

Triggered by: B1 from post-review. The progress store and three other runtime paths still
read from `src/lib/data/thai.ts` (static bundle) instead of the DB-delivered lesson catalog.

---

## Problem

Four files import `thaiPack` at runtime, meaning the static bundle remains a parallel
source of curriculum truth alongside the DB:

| File                                                  | What it reads                                                                                  | Fields needed                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `src/lib/stores/progress.ts`                          | All lessons; builds 5 module-level lookup structures for normalization and progress derivation | `id`, `anchorWord`, `newLetters`, `vocabulary`     |
| `src/lib/components/content/lesson/LessonList.svelte` | Renders the full lesson list in the sidebar                                                    | `id`, `stage`, `title`, `anchorWord`, `newLetters` |
| `src/routes/alphabet/+page.svelte`                    | Flat list of every letter across all lessons                                                   | `newLetters` (full `Letter` objects)               |
| `src/routes/practice/+page.svelte`                    | Drills from completed lessons, filtered client-side                                            | `id`, `drills`                                     |

The seed script at `scripts/generate-thai-seed.mjs` intentionally reads `thaiPack` and
**must keep doing so** — it is not a runtime path.

---

## Constraints and Pre-existing Tensions

### 1. `prerender = true` + `ssr = false` in `src/routes/+layout.ts`

These settings predate the `adapter-node` migration. They conflict with adding a
`+layout.server.ts` that performs live DB reads:

- `prerender = true` makes SvelteKit attempt a build-time static export. A layout server
  load that calls Supabase will run (and fail, or produce stale data) at build time.
- `ssr = false` disables server-side rendering of layout markup, though `+page.server.ts`
  load functions on child routes still run server-side.

**Resolution**: Remove `prerender = true` from `+layout.ts` as part of this task. Leave
`ssr = false` in place for now (it controls initial-render behaviour, not data loading).
Individual routes that still support static prerendering can declare their own
`export const prerender = true`.

### 2. Progress store self-initializes at module scope

`progress.ts` builds all catalog lookup structures synchronously at import time from
`thaiPack.lessons`. The store also calls `ensureProgressInitialized()` at module scope
to load localStorage. This two-step startup means the catalog must be injected before
any component that uses the store can render correctly.

The fix is to split initialization into two phases:

1. **Structural init** — called at module scope with a placeholder (empty array) so the
   store has valid initial state before the catalog arrives.
2. **Catalog injection** — called by `+layout.svelte` inside `onMount` once the layout
   server data is available. The store then re-normalizes the persisted localStorage
   snapshot against the real catalog.

### 3. Practice page drills are filtered by client-side progress

The practice page derives `availableDrills` reactively from `$progress.lessonProgress`.
It cannot use a server load to filter drills because the set of completed lessons lives
in localStorage, not on the server. Options:

- **Include `drills` in the layout catalog** — one round trip, simple, but loads all
  drill content on every page (can be a few KB per lesson).
- **Separate `GET /api/drills` endpoint** — client sends completed lesson IDs, server
  returns drills. Clean separation but adds a client-side fetch per practice session.

**Recommended**: Include `drills` in the catalog for the first implementation. This
stays simple and avoids a new HTTP surface. If the payload grows, the per-lesson approach
can be revisited then.

---

## New Delivery Layer Type: `PublishedLessonCatalogEntry`

A new type in `src/lib/server/delivery-payload.ts` that covers all four consumer use
cases:

```ts
export type PublishedLessonCatalogEntry = Pick<
 Lesson,
 "id" | "stage" | "title" | "anchorWord" | "newLetters" | "vocabulary" | "drills"
>;
```

- `stage`, `title`, `anchorWord`, `newLetters` — already covered by `PublishedLessonCard`
- `vocabulary` — needed by progress store for `collectKnownWords` and `normalizeKnownWords`
- `drills` — needed by practice page

`rulesIntroduced` and `reviewLetters` are intentionally excluded: they are only needed
on the full lesson detail page and are already loaded by `getPublishedLesson(id)`.

### New mapper: `mapPublishedLessonCatalogEntry`

Add alongside the existing `mapPublishedLessonCard` and `mapPublishedLessonPayload` in
`delivery-payload.ts`. It re-uses `readLessonCore`, `mapWord`, `mapLetter`, and
`mapDrill` already present in that module.

### New delivery function: `getPublishedLessonCatalog`

Add to `src/lib/server/delivery-lessons.ts`:

```ts
export async function getPublishedLessonCatalog(): Promise<PublishedLessonCatalogEntry[]>;
```

It follows the same pattern as `getPublishedLessonCards` (same SQL query, one row per
lesson, ordered by `lesson_ordinal`) but calls the new mapper. The existing in-memory
publication ID cache applies.

Export `PublishedLessonCatalogEntry` from `delivery-lessons.ts` via re-export.

---

## Implementation Steps

### Step 1 — Update `src/routes/+layout.ts`

Remove `prerender = true`. Keep `ssr = false` for now.

```ts
// Before
export const prerender = true;
export const ssr = false;

// After
export const ssr = false;
```

Any route that is truly static and needs prerendering should declare its own
`export const prerender = true`. Audit routes after making this change.

### Step 2 — Add `PublishedLessonCatalogEntry` type and mapper

In `src/lib/server/delivery-payload.ts`:

1. Add the `PublishedLessonCatalogEntry` type.
2. Add `mapPublishedLessonCatalogEntry(payload: unknown): PublishedLessonCatalogEntry`
   that parses `id`, `stage`, `title`, `anchor`, `newGraphemes`, `vocabulary` (excluding
   anchor entries, same as `mapPublishedLessonPayload`), and `drills`.

### Step 3 — Add `getPublishedLessonCatalog` delivery function

In `src/lib/server/delivery-lessons.ts`:

1. Re-export `PublishedLessonCatalogEntry`.
2. Add `getPublishedLessonCatalog()` following the same pattern as
   `getPublishedLessonCards`, with the new mapper.

### Step 4 — Add `src/routes/+layout.server.ts`

```ts
import { getPublishedLessonCatalog } from "$lib/server/delivery-lessons";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
 return { lessons: await getPublishedLessonCatalog() };
};
```

The `lessons` array flows to all routes as part of `$page.data`.

### Step 5 — Refactor `src/lib/stores/progress.ts`

Replace all five module-level `thaiPack`-derived constants with empty placeholders, and
add an `initProgress(catalog)` function that populates them and re-runs normalization.

**Key changes:**

1. Remove `import { thaiPack } from "$lib/data/thai"`.
2. Move catalog structures to module-level variables initialized to empty:

   ```ts
   let lessons: Lesson[] = [];
   let firstLessonId = 1;
   let lessonIds: number[] = [];
   let lastLessonId = 1;
   let lessonById = new Map<number, Lesson>();
   let knownLetterCharacters = new Set<string>();
   let knownWordThaiMap = new Map<string, Word>();
   ```

3. Add `initProgress(catalog: PublishedLessonCatalogEntry[])`:
   - Rebuilds all the above structures from the catalog.
   - Reloads and re-normalizes the persisted snapshot from localStorage.
   - Sets `progress` to the result.
4. Export `PublishedLessonCatalogEntry` import from `delivery-lessons` — but wait, that
   would create a server-module import in a client store. **Instead**, define a minimal
   `LessonCatalogEntry` interface in `$lib/data/types.ts` (client-safe) that mirrors the
   fields the progress store needs (`id`, `anchorWord`, `newLetters`, `vocabulary`).
   The server type `PublishedLessonCatalogEntry` satisfies it structurally.

**Minimal client-safe catalog type** (add to `src/lib/data/types.ts`):

```ts
/** Minimal lesson descriptor used for client-side progress normalization. */
export interface LessonCatalogEntry {
 id: number;
 anchorWord: Word;
 newLetters: Letter[];
 vocabulary: LessonVocabularyEntry[];
}
```

The progress store accepts `LessonCatalogEntry[]`. `PublishedLessonCatalogEntry` (which
has all these fields plus `stage`, `title`, `drills`) is structurally compatible.

### Step 6 — Update `src/routes/+layout.svelte`

Call `initProgress(data.lessons)` in `onMount` after the layout server data is available:

```ts
import { onMount } from "svelte";
import { initProgress } from "$lib/stores/progress";
import type { LayoutData } from "./$types";

let { data, children }: { data: LayoutData; children: Snippet } = $props();

onMount(() => {
 initProgress(data.lessons);
});
```

This ensures the progress store is seeded with the real catalog on every initial page
load, before any user interaction.

### Step 7 — Update `src/lib/components/content/lesson/LessonList.svelte`

Remove the `thaiPack` import. Accept `lessons` as a typed prop:

```ts
interface Props {
 lessons: PublishedLessonCatalogEntry[]; // or the structural equivalent
 currentLessonId: number;
 knownWords: Word[];
}
```

The caller (`src/routes/+page.svelte` or the learn index) passes `data.lessons` from the
layout server data.

### Step 8 — Update `src/routes/alphabet/+page.svelte`

Remove the `thaiPack` import. Read letters from the layout data:

```ts
import type { PageData } from "./$types"; // or LayoutData via $page.data

// allLetters derived from layout data
const allLetters = $derived(data.lessons.flatMap((l) => l.newLetters));
```

The page component receives `data` as a prop via `+page.ts` passing through layout data,
or via `$page.data` store.

### Step 9 — Update `src/routes/practice/+page.svelte`

Remove the `thaiPack` import. Receive the catalog via page/layout data:

```ts
// Before
const availableDrills = $derived.by(() => {
    const completedIds = ...;
    return thaiPack.lessons.filter((l) => completedIds.includes(l.id)).flatMap((l) => l.drills);
});

// After
const availableDrills = $derived.by(() => {
    const completedIds = ...;
    return data.lessons.filter((l) => completedIds.includes(l.id)).flatMap((l) => l.drills);
});
```

`data.lessons` flows from the layout server load as it does to all other routes.

### Step 10 — Restrict `src/lib/data/thai.ts`

After all runtime imports are removed:

1. Add a comment at the top of `thai.ts` marking it as seed-script-only:

   ```ts
   // Curriculum source of truth for seed generation. Not for runtime imports.
   ```

2. Optionally enforce this with an ESLint `no-restricted-imports` rule pointing to
   `$lib/data/thai` with message "Import lesson content from server delivery instead".

---

## Testing Plan

- [ ] `pnpm check` passes with no TypeScript errors
- [ ] `pnpm check:all` passes (lint, stylelint)
- [ ] `pnpm build` succeeds
- [ ] Manual: `/learn` loads lesson list from DB (verify in network tab)
- [ ] Manual: `/alphabet` shows all letters, progress matches known lessons
- [ ] Manual: `/practice` shows drills for completed lessons after completing lesson 1
- [ ] Manual: Refresh after completing a lesson — progress persists and normalizes correctly
- [ ] Manual: Clear localStorage, reload — progress resets to initial state, catalog still loads

---

## What Stays the Same

- `src/lib/data/thai.ts` — not deleted, still used by `scripts/generate-thai-seed.mjs`
- `src/lib/data/types.ts` — extended with `LessonCatalogEntry`, no removals
- `src/lib/server/delivery-lessons.ts` — additive only (`getPublishedLessonCatalog`)
- `src/lib/server/delivery-payload.ts` — additive only (`mapPublishedLessonCatalogEntry`)
- Existing `PublishedLessonCard` and `getPublishedLessonCards` — kept for lesson list fast
  path if needed; may be superseded by the catalog in a follow-up cleanup
- Existing `getPublishedLesson(id)` — unchanged, still used by `/learn/[id]`

---

## Follow-up Tasks (out of scope here)

- Remove `PublishedLessonCard` / `getPublishedLessonCards` if superseded by catalog
- Add caching headers to the layout server load (see caching planning doc)
- Evaluate prerendering the catalog as a build artifact (see caching planning doc)
- Add `no-restricted-imports` ESLint rule for `$lib/data/thai` in runtime code
