# Post-Review Fixes — 2026-04-30

Work items surfaced by the end-of-day code review of commits made on 2026-04-30.

## Status legend

- `[ ]` pending
- `[~]` in progress
- `[x]` done
- `[-]` deferred / out of scope for this task

---

## Bugs

### B1 — Two sources of truth for lesson lists `[-]` DEFERRED

`/learn` and `/learn/[id]` now receive lessons from Supabase delivery, but the progress
store still drives current/locked/done state from `thaiPack.lessons` (static). If the
published lesson set ever drifts from the static pack, unlock badges, `completeLesson`,
`collectKnownLetters`, and `collectKnownWords` all silently misfire.

**Deferred reason**: fixing this correctly requires either (a) injecting the server lesson
catalog into the progress store via layout server data, or (b) removing the static pack
dependency from the progress store entirely. Both are architectural changes that need a
dedicated task with test coverage.

**Mitigation in place**: the seed script (`scripts/generate-thai-seed.mjs`) reads from
`thaiPack`, so the DB and static pack are in sync as long as re-seeding happens after
any static-data edit.

**Follow-up task**: open a dedicated `.ai/` task to inject the lesson catalog from
`+layout.server.ts` and remove the `thaiPack` import from `progress.ts`.

### B2 — Loose route param validation `[x]`

`Number.parseInt("5abc", 10)` returns `5`, passing the `Number.isInteger` guard.
Fixed: strict `^[0-9]+$` regex check in `src/routes/learn/[id]/+page.server.ts`.

### B3 — `anchorWord` duplicated inside `vocabulary` `[x]`

`Lesson.vocabulary` contained an entry with `role: "anchor"` (same data as `anchorWord`).
Fixed:

- `delivery-payload.ts` mapper now skips anchor-role entries from vocabulary
- `src/lib/data/thai.ts` vocabulary arrays only contain support entries
- `StepComplete.svelte` `.filter(role === "support")` guard removed (no longer needed)
- `completeLesson` now also pushes `anchorWord` to `knownWords` when it isn't there yet

### B4 — Dead `isLessonCompleted` function `[x]`

Declared but never exported or called. Deleted from `progress.ts`.

---

## Security

### S1 — Server delivery client used public env vars `[x]`

`delivery-lessons.ts` imported `$env/dynamic/public`. Server delivery now uses
`SUPABASE_DELIVERY_URL` and `SUPABASE_DELIVERY_ANON_KEY` from `$env/dynamic/private`.
The browser `src/lib/supabase.ts` still reads `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`.
See `.env.example` for mapping instructions.

### S2 — RLS posture for `delivery.*` tables `[x]` ALREADY DONE

Confirmed in `supabase/migrations/20260425131000_security_and_sync.sql`:

- `delivery.course_publications` — RLS enabled, `is_active = true` policy for anon + authenticated
- `delivery.course_publication_lessons` — RLS enabled, subquery gate checks active publication

No action required.

### S3 — Caching, performance, and offline strategy `[-]` DEFERRED

See dedicated planning document: `.ai/2026-04-30-caching-offline-performance.md`.

---

## Inefficiencies / DRY

### I1 — Per-request Supabase client + redundant publication lookups `[x]`

`createDeliveryClient()` and `getActivePublicationId()` were called independently in
every helper, producing 4 SQL queries per `/learn/[id]` load. Fixed:

- Module-level lazy singleton client
- In-memory active publication ID cache (60 s TTL)
- New `getPublishedLesson(id)` combines lesson + next-ordinal into a single query
  (`lesson_ordinal >= id ORDER BY ... LIMIT 2`)
- Route updated to call the combined function

### I2 — Full payload parsed for card list `[x]`

`getPublishedLessonCards` called the full `mapPublishedLessonPayload` and discarded 90%
of the result. Added `mapPublishedLessonCard` in `delivery-payload.ts` that only parses
the five fields needed for the lesson list.

### I3 — Six near-identical enum validators `[x]`

`expectWordCategory`, `expectLetterType`, etc. were all the same pattern. Replaced with
a generic `expectEnum<T>(allowed: Set<T>, value, context)` helper.

### I4 — `filter(Boolean).join(" ")` class builder repeated 5× `[x]`

Added `cn()` utility in `src/lib/utils/cn.ts`. Updated `Button`, `RadioButtons`,
`ToggleTiles`, `learn/+page.svelte`, `LessonList.svelte`.

### I5 — `CardLink` thin wrapper `[-]` INTENTIONALLY SKIPPED

Will receive bespoke card styling and locked-overlay behaviour in the future. Leave as-is.

### I6 — Three identical letterSection blocks in alphabet page `[x]`

Replaced with a single `buildSection(type, headingId, title)` helper called from an array.

### I7 — Progress component inline style `[x]`

Moved multi-rule inline `style="…"` into the `.progress` SCSS scope.

### I8 — `Button` size class asymmetry `[x]`

Changed from the special-case `size === "large" ? "btn--large" : ""` to `btn--${size}`
so every size value generates a modifier class. `btn--md` has no SCSS rule (the default
`.btn` styles cover it), which is correct — the class is generated for symmetry only.

### I9 — `completeLesson` duplicated currentLessonId calculation `[x]`

Replaced manual `lessons.find(candidate => candidate.id > lessonId)` + fallback with
`getCurrentLessonIdFromProgress(lessonProgress)` wrapped in `Math.max` for the
no-regression guarantee.

---

## B1 follow-up task checklist (not started)

- [ ] Add `lessons` to `+layout.server.ts` load return
- [ ] Pass lesson catalog into progress store via an init function
- [ ] Remove `thaiPack` import from `progress.ts`
- [ ] Remove static `lessonIds` / `lessonById` / `knownLetterCharacters` / `knownWordThaiMap` from the top of `progress.ts`
- [ ] Re-run pnpm check + manual test
