# Backlog

## Database Foundation Next Steps

- Seed the current Thai course into `curriculum.*` and validate parity against `src/lib/data/thai.ts`.
- Publish the first learner-facing lesson bundles into `delivery.*`.
- Add the first server-side SvelteKit boundary for published lesson reads and `internal_api.sync_lesson_attempt_batch(...)`.
- Decide whether to add Drizzle now or defer it until after the first DB-backed runtime path is working.

## Route Metadata And SEO

- Add a shared route metadata helper and SEO conventions in code so page-level titles, descriptions, and future canonical handling are easier to keep consistent.
