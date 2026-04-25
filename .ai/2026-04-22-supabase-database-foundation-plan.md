# Task: Supabase database foundation plan

- Start date: 2026-04-22
- Owner: GitHub Copilot
- Status: in-progress

## Latest Decision Snapshot

- Resolved projector mechanism: use a batch `SECURITY DEFINER` SQL function in `internal_api`, invoked from a thin server-side SvelteKit boundary.
- Resolved canonical curriculum naming: use `anchor_targets` and `anchor_segments`.
- Resolved enum discipline: keep PostgreSQL enums for truly closed sets only; use text keys for categories and script-specific pedagogy labels.
- Resolved instrumentation scope: store `time_spent_ms` on lesson attempts only in v1.
- Output added: `docs/database-dto-spec.md`.

## Goal

Define the database foundation for GlyphBridge so curriculum content, lesson structures, and learner progress can move from static TypeScript data into a scalable Supabase-backed PostgreSQL model without breaking the app's teaching philosophy or creating avoidable technical debt.

## Scope

- In scope:
  - Canonical PostgreSQL schema direction for courses, lessons, graphemes, rules, drills, and learner progress
  - Supabase architecture guidance for auth-adjacent database boundaries and RLS posture
  - Offline and sync strategy assessment for web and future mobile support
  - ORM assessment, especially Drizzle
  - Migration direction from the current Thai-only static curriculum
- Out of scope:
  - Supabase project provisioning
  - Database implementation or migrations
  - Auth UI and account flows
  - Admin CMS implementation

## Constraints

- Technical:
  - Preserve the fixed six-step lesson flow unless a real course requires a different contract.
  - Keep curriculum content canonical, serializable, and free of presentation markup.
  - Keep learner state minimal and derive known graphemes, words, unlock state, and current lesson where practical.
  - Design for multiple courses and script systems without baking Thai-specific assumptions into the schema.
- Product:
  - The public-facing unit is a course, not a raw script chart.
  - Courses should stay structurally consistent while allowing bounded script-specific metadata.
  - Content will initially be developer-managed through migrations and seeds.
  - The app should support broad offline-first behavior over time, especially for future mobile use.
- Security:
  - Learner-owned data must remain behind authenticated, server-verified boundaries.
  - Exposed Supabase tables must be designed RLS-first.
  - Privileged publishing, projection, or maintenance paths must stay out of exposed schemas and client code.

## Research Basis

This plan is grounded in:

- Product and curriculum rules in `docs/app-philosophy.md`, `docs/concept/approach-thai.md`, and the repo instruction files.
- Current runtime contracts in `src/lib/data/types.ts`, `src/lib/data/thai.ts`, and `src/lib/stores/progress.ts`.
- Official Supabase guidance for SvelteKit SSR and RLS.
- Official PostgreSQL guidance for relational constraints, `jsonb`, and indexing.
- Official Drizzle guidance for PostgreSQL schema and query ergonomics.
- Official TanStack Query and Zero documentation for persistence and sync tradeoffs.

## Summary Recommendation

Use a hybrid architecture:

- Normalized PostgreSQL tables are the canonical source of truth for curriculum and learner state.
- Immutable published course bundles are generated from that canonical model for fast runtime delivery, caching, and offline/mobile use.
- Supabase provides Postgres, auth, and server-facing APIs.
- Drizzle is recommended for schema definition, generated types, and ergonomic server queries, but advanced RLS, publication logic, views, and specialized indexes should remain in explicit SQL migrations.
- TanStack Query is useful later as a client cache and mutation orchestration layer, not as the canonical sync model.
- Zero should not be the foundation. Its own docs state it is not local-first, does not support offline writes or long offline periods, and is not suited to native mobile clients.

## Why This Direction

GlyphBridge's current model already implies the right separation of concerns:

- Curriculum data is canonical.
- Rendering is separate from content.
- Progress is course-scoped.
- Known graphemes, known words, and current lesson are derived from lesson completion.

That makes a relational source of truth the safest long-term choice. At the same time, a pure server-read model would be a bad fit for the product's desired offline and mobile posture. The answer is not to make the canonical schema document-heavy or sync-engine-specific. The answer is to keep canonical data relational, then publish compact immutable delivery bundles from it.

## Core Decisions

- Decision: Treat `course` as the primary product abstraction.
  Reason: The app teaches reading through language-specific real words and ordered curricula, not through isolated script metadata.

- Decision: Pin learner progress to `course_version`, not just `course`.
  Reason: Content edits should become release events instead of silently mutating active learner state.

- Decision: Keep the six-step lesson flow fixed in v1.
  Reason: The product and current components assume a stable lesson contract, and there is not yet a second real format that justifies a generic lesson-builder system.

- Decision: Use generic names such as `grapheme`, `text_target`, and `text_segment` instead of Thai- or alphabet-specific names.
  Reason: This preserves script-agnostic modeling while allowing course-specific nuance through bounded metadata.

- Decision: Store only minimal canonical learner facts.
  Reason: The current app philosophy and progress store already show that known graphemes, known words, unlock state, and current position should be derived.

- Decision: Use immutable publication artifacts for delivery.
  Reason: Runtime clients, especially future mobile clients, should not depend on a live relational session to render course content.

- Decision: Treat learner upgrades to a newer `course_version` as explicit opt-in events, not silent reassignment.
  Reason: Pedagogical changes can alter ordering, wording, and review expectations; the learner needs a clear choice and a trustworthy summary of impact.

- Decision: Every learner-facing course release for an existing course must define a migration path from supported prior versions.
  Reason: Version pinning only works operationally if upgrades are explainable, previewable, and implementable without ad hoc manual intervention.

## Proposed Canonical Schema

### 1. Course and script metadata

- `languages`
  - Language code and display metadata.
- `script_systems`
  - Writing-system metadata such as direction, rendering hints, and grouping metadata.
- `courses`
  - Public learning unit with slug, title, language, script system, status, lesson flow template key, and `current_published_version_id` materialised for O(1) version resolution. `UNIQUE (slug)`.
- `course_versions`
  - Immutable published curriculum releases. Columns: `course_id`, `version_ordinal int` (monotonic, the operational versioning hinge), `display_version text` (semver-style decoration for humans, not used in queries), `released_at`, `is_published`, `hash text`, `created_by` (audit lineage for future CMS), publication metadata. `UNIQUE (course_id, version_ordinal)`. Decision committed: monotonic ordinals are the source of truth; `display_version` is decoration only.

### 2. Curriculum entities

- `graphemes`
  - Script registry of immutable identity only: stable key, codepoint or glyph text, kind (`consonant`, `vowel`, `tone_mark`, `diacritic`, `syllabic`, etc.), and rendering hints inherent to the script. Carries no pedagogy.
- `course_version_graphemes`
  - Carries all pedagogy. One row per `(course_version_id, grapheme_id)`, always present, never an "override." Columns include `mnemonic`, `pronunciation_hint`, `romanization`, `class` (low/mid/high — typed enum, nullable for non-Thai-style scripts), `position` (left/right/above/below/around/standalone — typed enum), and a bounded `metadata jsonb` for script-specific nuance that does not warrant a column. `UNIQUE (course_version_id, grapheme_id)`. Replaces the earlier `course_grapheme_overrides` proposal — the overrides pattern was rejected because it forced every read to merge two rows and let the table grow unbounded; the strong projection is symmetric, simpler, and matches the rest of the version-scoped model.
- `text_targets`
  - Anchor words or tightly related reading targets, scoped to a course version. Columns: `display_text`, `normalized_text`, `meaning`, `pronunciation`, `category` (typed enum: `place`, `food`, `transport`, `daily`, `sign` — queryable, not buried in metadata), `context_note`, and bounded `metadata jsonb`. 1:1 with `lessons` enforced via `UNIQUE (lesson_id)` on the FK side.
- `text_segments`
  - Ordered breakdown rows for each text target with segment kind, visible text, sound/value, and optional metadata.
- `orthography_rules`
  - Stable rule definitions with key, name, short description, explanation, and metadata.
- `orthography_rule_examples`
  - Ordered examples for each rule.
- `lessons`
  - Ordered lesson records scoped to a course version with stable key, ordinal, stage, title, anchor text target, and bounded extra payload.
- `lesson_graphemes`
  - Ordered join table linking lessons to graphemes with `role` enum (`new`, `review`) and per-role ordinal. Pedagogy fields are read from `course_version_graphemes`, not duplicated here. Review-role rows reference graphemes introduced by earlier lessons in the same course version.
- `lesson_rules`
  - Ordered join table linking lessons to rules.
- `drills`
  - Deterministic drill definitions with stable key, `type` enum (currently `recognize`, `match`, `sound`, `spot`; future-extensible), prompt, hint, and a typed `payload jsonb`. The `payload` carries type-specific structure that is not common to all drill types and is constrained per-type via a `CHECK` constraint validating against a JSON Schema. This pattern keeps the schema honest about extensibility: future drill types (typing, audio recording, drag-to-order) add a new payload schema variant without table sprawl, and the choice-family tables stay focused on choices.
- `drill_options`
  - Used only by choice-family drill types (`recognize`, `match`, `sound`, `spot`). Ordered answer choices with correctness and optional rationale. Exactly one correct option per drill enforced by a partial unique index: `CREATE UNIQUE INDEX ON drill_options(drill_id) WHERE is_correct;`.
- `lesson_drills`
  - Ordered join table linking lessons to drills.
- `media_assets`
  - Optional future-proof table for audio, images, or other lesson-linked assets.

### 3. Publication and delivery

- `course_publications`
  - Release records for immutable learner-facing content bundles, one per (course_version, publish event). Carries `manifest_hash text` for content-addressed client caching.
- `course_publication_lessons`
  - One row per published lesson. Columns: `publication_id`, `lesson_ordinal`, `payload jsonb` (the fully assembled lesson bundle including its graphemes, rules, drills, and anchor segments resolved from canonical), `payload_hash text`. Lessons are the unit of caching; the client downloads and caches them individually keyed by hash, supporting partial offline coverage and `If-None-Match`-style revalidation.

Decision committed: bundles are chunked per lesson, not per course. The runtime client always keeps the current lesson plus the next three lessons cached for offline continuity. This avoids both the "fat all-at-once download" failure mode on cellular and the "no offline at all" failure mode of pure on-demand fetching.

Normalized tables remain canonical. Publication artifacts are immutable delivery payloads.

## Read Path Boundary

The hybrid model has two read paths into curriculum data and they must not bleed:

- **Authoring/maintenance path** — admins, snapshot generators, internal tooling. Reads normalized curriculum tables (`graphemes`, `course_version_graphemes`, `text_targets`, `lessons`, etc.) directly. Writes are tightly scoped and kept out of exposed schemas.
- **Learner runtime path** — the app the user actually sees. Reads only from publication artifacts (`course_publications`, `course_publication_lessons`).

Without this rule stated as a hard invariant, any "small one-off query" against a normalized curriculum table from a Svelte route or remote function will eventually produce drift between what the relational model says and what published bundles deliver. Enforce structurally rather than by convention:

- Normalized curriculum tables live in a schema that is not exposed via PostgREST/Supabase, or have RLS policies that deny `anon` and `authenticated` roles outright.
- Publication tables are the only curriculum-side surface that is exposed to the runtime path.
- The app's client-bundled and runtime-server code has no Drizzle queries against normalized curriculum tables. Only the publication generator and admin tooling touch them.

Treat any PR that violates this boundary as a structural regression, not a stylistic one.

## Proposed Learner Schema

Every learner-owned table carries `user_id uuid not null references auth.users(id) on delete cascade` directly so RLS policies are simple `auth.uid() = user_id` index-only checks rather than `EXISTS` subqueries through `course_enrollments`. This is the canonical Supabase pattern and the right tradeoff: one denormalised column per table in exchange for predictable, fast policies. The integrity invariant — that a row's `user_id` matches its enrollment's `user_id` — is enforced via composite FK or trigger.

- `profiles`
  - One row per user, linked to `auth.users` via `user_id`. Cascade-deletes on user deletion (GDPR/CCPA hard-delete path).
- `learner_devices`
  - Device or installation identities used for offline queues, diagnostics, and eventual mobile support. Carries `user_id`.
- `course_enrollments`
  - Links a learner to a course and pins them to a `course_version_id`, with resume position and activity timestamps. Carries `user_id`.
- `lesson_progress`
  - Canonical learner fact table keyed by enrollment and lesson, with status, completion timestamp, best score, latest score, attempt count, and updated timestamp. Carries `user_id` (denormalised for RLS). `UNIQUE (enrollment_id, lesson_id)`. Clients have no direct write access — only the projector writes here (see "Attempt → Progress Projection" below).
- `lesson_attempts`
  - Append-only, client-generated, idempotent sync units representing lesson completions or graded drill runs. Carries `user_id`. Idempotency: `UNIQUE (enrollment_id, client_attempt_id)`, scoped per enrollment rather than globally unique. Includes a `processed_at timestamptz` column so unprocessed attempts can be picked up after a crash without rescanning history.
- `learner_preferences`
  - Optional user settings such as transliteration visibility or audio preferences. Carries `user_id`.

Do not create canonical tables for known graphemes, known words, or unlock state unless a later performance bottleneck proves the need for projections.

## Attempt → Progress Projection (Resolved)

`lesson_progress` is canonical learner state. `lesson_attempts` is the append-only event log written by clients (often offline-batched). Something has to read attempts and produce `lesson_progress`. The plan does not yet commit to _what_, and this gap must be closed before the schema spec phase begins.

### Why this matters

- Multiple offline-queued attempts for the same lesson can arrive in a single sync transaction. The projector must process them in order and produce one consistent `lesson_progress` row.
- Lesson completion must be monotonic: once completed, stays completed. Best score should be `MAX` across attempts. Latest score is the most recent attempt by `completed_at`. Attempt count is monotonic. These rules need a single owner.
- Without a clear projector, two code paths will eventually start writing `lesson_progress` directly and the canonical fact will drift from the event log.

### Chosen mechanism

Use one batch `SECURITY DEFINER` SQL function in `internal_api`, called by a thin server-side SvelteKit boundary after authentication has been verified.

### Fixed contract

- Function: `internal_api.sync_lesson_attempt_batch(p_user_id uuid, p_enrollment_id uuid, p_device_id uuid, p_attempts jsonb)`
- Transaction scope: one enrollment and one authenticated user per call
- Idempotency key: `(enrollment_id, client_attempt_id)`
- Ordering: `completed_at asc`, then `client_attempt_id asc`
- Projection target: `learner.lesson_progress` plus `learner.course_enrollments.current_lesson_id`
- Process marker: `processed_at` is set inside the same transaction as the progress upsert
- Failure mode: no partial processed state; retries are safe

### Merge semantics

- `best_score = MAX(existing.best_score, incoming.score)`
- `latest_score = newest processed attempt score`
- `attempt_count` increases by newly inserted attempts only
- `completed` is sticky once true
- `first_completed_at` is the earliest completion timestamp ever observed
- `last_attempt_at` is the latest processed attempt timestamp

The exact runtime and DTO contract is captured in `docs/database-dto-spec.md`.

## Sync and Offline Direction

### Recommended v1-v2 posture

- Course content should be downloaded as immutable, versioned bundles and cached locally.
- Bundle delivery is chunked per-lesson, not per-course. The client always keeps the current lesson plus the next three lessons cached for offline continuity, without committing to a fat all-at-once download. New lessons are prefetched as the learner advances.
- Learner progress should be written locally first as queued attempt records with client-generated IDs.
- Sync should upload attempts and project them server-side into canonical lesson progress.
- Resume pointers can use last-write-wins.
- Lesson completion should be monotonic.
- Merges should preserve earliest completion timestamps and best scores where relevant.

### Assessment of candidate tools

- `TanStack Query`
  - Good fit later for request caching, background refetch, optimistic UI, and mutation retry orchestration.
  - Not a full sync model and not the canonical offline architecture.

- `Zero`
  - Not recommended as the foundation.
  - Official docs explicitly say it is not local-first, does not support offline writes or long offline periods, and is not intended for native mobile.
  - It also adds a replica/cache service plus dedicated query and mutate endpoints that are harder to justify for GlyphBridge's current shape.

## Course Version Upgrade And Change Communication

### Recommended learner-facing model

- Keep every active enrollment pinned to one `course_version_id` until the learner explicitly switches.
- Publish each new version with learner-facing release metadata: title, summary, release notes, upgrade kind, and a machine-readable impact summary.
- Require an explicit migration plan before a release is offered to learners already enrolled in an older version.
- Surface upgrade offers in-app on safe boundaries such as the dashboard, lesson list, or lesson completion screen rather than interrupting a drill in progress.
- When the learner chooses to upgrade, generate a preview that explains exactly what carries over, what is newly unlocked, and what is recommended for review.

### Migration path requirement

- No release should be presented as an upgrade option unless a supported path exists from the learner's pinned source version.
- Each supported path should declare:
  - source version range
  - target version
  - migration type such as `direct`, `preview_required`, or `manual_support_only`
  - lesson mapping coverage
  - learner-facing copy for carry-forward rules, review recommendations, and breaking curriculum shifts
- If no safe mapping exists, the system should keep the learner on their current version and present the newer course as a separate restart path rather than forcing an unsafe upgrade.
- Migration previews should be deterministic so the learner sees the same result before and after accepting the upgrade.

### Data model additions worth planning for

- `course_releases` or release metadata on `course_versions`
  - Learner-visible version label
  - Upgrade kind such as `patch`, `content_update`, or `curriculum_shift`
  - Summary and structured release notes
  - Recommended flag and support window
- `course_version_upgrade_paths`
  - Allowed source and target version pairs
  - Whether upgrade is self-serve or requires special handling
  - Copy and warnings for the preview screen
- `lesson_version_mappings`
  - Maps stable lesson keys from one version to another
  - Supports outcomes such as `carry_forward`, `review_again`, `split`, `merged`, or `retired`
- `course_upgrade_decisions`
  - Records when a learner saw, dismissed, accepted, or postponed an offer
  - Stores the source version, target version, and timestamps

### Upgrade UX recommendation

- Show a version badge such as `Thai Foundations 1.2 available`.
- Provide a short human summary:
  - `2 new lessons added before food vocabulary`
  - `3 pronunciation explanations rewritten`
  - `Your completed lessons will stay completed`
  - `1 lesson is recommended for review`
- Offer explicit actions:
  - `Stay on current version`
  - `Preview changes`
  - `Switch to new version`
- After switching, show a post-upgrade summary and keep a reversible audit trail even if the product does not expose self-serve rollback immediately.

### Progress migration rule of thumb

- Carry forward completion only through stable lesson keys, not numeric ordinals.
- If a lesson only changes copy, drills, or examples, preserve completion and scores.
- If a lesson is materially rewritten or split, preserve the old completion in history but mark the target lesson as `review recommended` instead of silently completed.
- If new prerequisite lessons are inserted before the learner's current point, unlock them and clearly label them as new rather than forcing a confusing rewind.
- Keep the source enrollment history so the migration can be explained and audited later.
- Treat migration computation as a publish-time validation target, not only a runtime concern. A release is incomplete until its supported upgrade outcomes can be generated and inspected.

### Notification recommendation

- Default to in-app notifications first.
- Add email or push later only for authenticated learners who have opted in to product updates.
- Notify at most once per release until the learner dismisses or acts.
- Keep the message about learner impact, not internal version numbers.

## Supabase and Security Direction

- Use Supabase as the Postgres and auth platform.
- Use `@supabase/ssr` when the app moves to a server-capable SvelteKit posture.
- Use request-scoped Supabase clients and server-validated sessions.
- Enable RLS on any exposed learner-owned tables from day one.
- Index columns referenced by RLS policies.
- Keep policy logic explicit and role-scoped.
- Keep privileged publishing and maintenance functions out of exposed schemas.

## ORM Assessment

`Drizzle` is recommended with clear boundaries.

### Use Drizzle for

- Table definitions and relations
- Generated types
- Routine server queries
- Migration scaffolding

### Keep raw SQL for

- RLS policies
- Security-definer functions
- Publication or projection functions
- Views and materialized views
- Specialized indexes and search setup

This gives the project typed ergonomics without hiding the database features that matter most for Supabase correctness and long-term maintainability.

## Migration Direction From Current App

The first backend parity target should be the existing Thai curriculum in `src/lib/data/thai.ts` and the current progress semantics in `src/lib/stores/progress.ts`.

Before implementation, prove that the schema can represent without loss:

- `LanguagePack`
- `Lesson`
- `Word`
- `SyllableBreakdown`
- `Rule`
- `DrillQuestion`
- Current linear progress derivations

If the schema requires dumping the core teaching entities into opaque JSON to get Thai to fit, the schema is too weak.

## Progress

- [x] Discovery and research
- [x] Schema spec with exact tables, columns, constraints, and indexes
- [ ] Supabase RLS plan
- [x] Publication and sync design spec
- [ ] Migration plan from static Thai content
- [ ] Validation and implementation planning

## Open Questions

- ~~How should course versioning be expressed operationally?~~ Resolved: monotonic `version_ordinal int` is the operational hinge; `display_version text` is decoration only.
- ~~Should publication snapshots be a single bundle or chunked?~~ Resolved: chunked per lesson; runtime client prefetches the current lesson plus the next three.
- ~~How does the projector resolve attempts → progress in detail?~~ Resolved in `docs/database-dto-spec.md`.
- At what point does review or spaced repetition become important enough to warrant dedicated projection tables?
- Which local persistence layer should the eventual mobile clients standardize on for immutable content bundles and queued attempts?

## Smaller Items to Revisit at Schema-Design Step

These were flagged during the audit as worth committing to before migrations are written, but do not change the direction of the plan. Revisit each during the schema spec phase:

- **Soft-delete vs hard-delete policy.** Curriculum content tied to any published version is never hard-deleted; mark `course_versions.is_archived` instead. Learner data hard-deletes via `auth.users → profiles → enrollments → progress/attempts` cascade for GDPR/CCPA. Spell out cascade chains in the schema.
- **Audit lineage.** Add `created_by uuid` to `course_versions` and `course_publications` now, even though authoring is migration/seed-only in v1. Cheap to add; expensive to backfill once a CMS arrives.
- **Naming.** Consider `anchors` / `anchor_segments` instead of `text_targets` / `text_segments` to match the philosophy doc's existing vocabulary ("anchor word"). Decide before tables are created.
- **Instrumentation.** Decide whether to include `time_spent_ms` (or similar) on `lesson_progress` / `lesson_attempts` now or defer. Either is acceptable, but commit explicitly.
- **Migration ordering discipline.** State the canonical order in the schema spec: create tables → add RLS + policies → add indexes → seed. Drizzle migrations don't enforce this order; humans do.
- **First-sync backfill from localStorage.** Define the path for existing learners: on first auth, the client posts its localStorage snapshot as a stream of synthetic `lesson_attempts`, server-side projection rebuilds `lesson_progress`. One-shot but easy to forget.
- **i18n boundary.** Lesson titles, mnemonics, and context notes are currently in English. The schema does not yet model translation locale separately from the target script language. Acceptable for v1; flag explicitly so future locale support does not become a destructive migration.

## Follow-Up

- Draft the exact table-by-table schema next, including keys, foreign keys, uniqueness rules, and index strategy.
- Draft the RLS model for learner-owned tables before any implementation begins.
- Define publication generation and client sync semantics before writing migrations.
- Define the supported course-version upgrade matrix and the publish-time validation needed to guarantee migration previews.
- Map the current Thai pack one-to-one into the proposed schema as a parity check.
- Keep this file updated as decisions harden.
