# Task: Database security audit

- Start date: 2026-04-25
- Owner: Security review pass
- Status: findings captured, remediation pending

## Goal

Audit the current Supabase / PostgreSQL foundation against best practices for PostgreSQL, Supabase Auth, RLS, server-side data access, and SvelteKit boundaries. Capture every concrete issue, its severity, and a recommended fix so the team can decide what to address before the first server-backed route lands.

## Sources Reviewed

- [docs/db.md](../docs/db.md)
- [docs/database-dto-spec.md](../docs/database-dto-spec.md)
- [docs/security-review-checklist.md](../docs/security-review-checklist.md)
- [supabase/config.toml](../supabase/config.toml)
- [supabase/seed.sql](../supabase/seed.sql)
- [supabase/migrations/20260425130000_schema_foundation.sql](../supabase/migrations/20260425130000_schema_foundation.sql)
- [supabase/migrations/20260425131000_security_and_sync.sql](../supabase/migrations/20260425131000_security_and_sync.sql)
- [src/lib/supabase.ts](../src/lib/supabase.ts)
- [.env.example](../.env.example)
- `.ai/tasks/supabase-db-foundation/*`
- Repo-wide `AGENTS.md` security guidance

## Severity Legend

- **Critical** — exploitable now or as soon as the first server route lands.
- **High** — meaningful security weakness; address before first authenticated rollout.
- **Medium** — defense-in-depth or correctness gap; should be fixed before public launch.
- **Low** — hygiene, lint, or documentation issue.

---

## Critical

### C1. Architectural mismatch: clients can directly INSERT into `learner.lesson_attempts`, but the projection function only processes attempts it inserts itself

- Where: [supabase/migrations/20260425131000_security_and_sync.sql](../supabase/migrations/20260425131000_security_and_sync.sql) lines 330, 418-422 vs. function body lines 134-191.
- The grant `grant select, insert on learner.lesson_attempts to authenticated` plus the policy `learner_lesson_attempts_insert_own` lets the client write attempts directly through PostgREST.
- The projection function `internal_api.sync_lesson_attempt_batch(...)` reads attempts only from its `p_attempts jsonb` argument and inserts them itself with `on conflict do nothing`. It **never reads pre-existing rows from `learner.lesson_attempts`**, so any direct client INSERT becomes orphan data: it is stored, but it never updates `learner.lesson_progress` or `current_lesson_id`.
- Two real risks fall out of this:
  1. Storage abuse: an authenticated user can flood `lesson_attempts` with arbitrary rows (size, count, payload) since RLS only checks `user_id` and there is no length / count constraint.
  2. Spec drift: future code that assumes "every attempt is projected" will silently miss client-direct rows. A junior developer is also likely to add a "process unprocessed attempts" path that picks up forged rows the user pre-inserted with crafted scores.
- Fix options (pick one):
  1. **Preferred**: revoke direct INSERT. Drop the `learner_lesson_attempts_insert_own` policy and remove `insert` from the grant. Make `internal_api.sync_lesson_attempt_batch` the only write path, called from a SvelteKit server action.
  2. Or have a single AFTER INSERT trigger on `learner.lesson_attempts` that runs projection inline. Riskier — write amplification, harder to validate inputs.
- Update [docs/database-dto-spec.md](../docs/database-dto-spec.md) "RLS Boundary" so the bullet "Clients may select and insert into learner.lesson_attempts" reflects the new model.

### C2. `internal_api.sync_lesson_attempt_batch` trusts caller-supplied `p_user_id`

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:29-34](../supabase/migrations/20260425131000_security_and_sync.sql#L29-L34).
- The function is `SECURITY DEFINER` and validates that the enrollment row matches `(p_enrollment_id, p_user_id)`. Defense-in-depth is good, but the function still relies on the caller to pass the **right** user id. A server bug that passes the wrong identity (e.g., from query string, route param, body, or stale session) becomes a horizontal privilege escalation.
- Fix: derive identity inside the function. Use `auth.uid()` when callable from PostgREST with a JWT, or require the server caller to set `request.jwt.claim.sub` / a signed context. Concretely:
  - Drop the `p_user_id` parameter.
  - Inside the function: `select coalesce(auth.uid(), (current_setting('request.jwt.claim.sub', true))::uuid) into v_user_id;` then `if v_user_id is null then raise exception 'unauthenticated'; end if;`
  - Continue to validate the enrollment belongs to `v_user_id` for defense-in-depth.
- Update the DTO spec's "Projection Contract" signature to drop `p_user_id`.

### C3. SECURITY DEFINER function search_path includes mutable / public-writable schemas

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:44](../supabase/migrations/20260425131000_security_and_sync.sql#L44) — `set search_path = pg_catalog, public, curriculum, learner, delivery, internal_api`.
- `public` is the canonical Supabase footgun: anything created there can shadow operators, casts, or function names. Including `public` in a `SECURITY DEFINER` search_path is exactly the pattern the Supabase database linter (`function_search_path_mutable`) warns against.
- The function only references `public.lesson_progress_status` (cast) and `learner.*` / `curriculum.*` tables.
- Fix:
  1. Move the enums out of `public` into a private schema (`curriculum` or a new `enums` schema). They are domain types, not runtime-API surface, and putting them in `public` exposes them to the PostgREST schema list (see L4).
  2. Then set `set search_path = ''` and fully qualify every reference (the function already does for tables; only the enum cast needs updating).
  3. If you keep enums in `public` for now, at minimum drop `delivery` and `learner` from the search_path because the function already qualifies those — every unqualified resolution risk should be removed.
- Apply the same fix to `internal_api.handle_new_user()` ([supabase/migrations/20260425131000_security_and_sync.sql:7](../supabase/migrations/20260425131000_security_and_sync.sql#L7)) — currently `pg_catalog, learner`, which is acceptable, but `set search_path = ''` plus full qualification is the gold standard.
- Apply the same fix to `internal_api.set_updated_at()` ([supabase/migrations/20260425130000_schema_foundation.sql:16-24](../supabase/migrations/20260425130000_schema_foundation.sql#L16-L24)) — it has no `set search_path`, so the linter will flag it.

---

## High

### H1. Client-supplied `completed_at` is stored verbatim with no bounds

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:107-191](../supabase/migrations/20260425131000_security_and_sync.sql#L107-L191) and table column [20260425130000_schema_foundation.sql:289](../supabase/migrations/20260425130000_schema_foundation.sql#L289).
- Clients can submit `completed_at` years in the past (faking a long streak) or far in the future (poisoning leaderboards / progress merges). Because the projection uses `min/max(completed_at)` to compute `first_completed_at` and `last_attempt_at`, and `latest_score` is decided by ordering on `completed_at desc`, a single forged timestamp can permanently corrupt a learner's progress record.
- Fix: clamp inside the validation CTE, or reject the batch:
  - `where completed_at <= now() + interval '1 minute' and completed_at >= now() - interval '30 days'` (or whatever business window is reasonable).
  - Alternatively, drop client-supplied `completed_at` and use `now()` server-side. Submission timestamps drift from completion timestamps, but the audit value is higher.

### H2. No upper bound on `p_attempts` array size, payload size, or string lengths

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:29-191](../supabase/migrations/20260425131000_security_and_sync.sql).
- A single call could pass 100k attempts or 100MB of `attempt_payload` JSON. Even with PostgREST's generic body limits, the function has no defense.
- Fix: at the top of the function, after the `jsonb_typeof` check, add:
  - `if jsonb_array_length(p_attempts) > 200 then raise exception 'too many attempts in batch'; end if;`
  - Validate `length(client_attempt_id) between 1 and 64`, `octet_length(attempt_payload::text) <= 32768` (or similar), and that `score`, `time_spent_ms` fall in expected ranges before insert.

### H3. `learner.lesson_attempts.device_id` is not constrained to belong to the inserting user (when client-direct INSERT remains)

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:283](../supabase/migrations/20260425130000_schema_foundation.sql#L283), policy [20260425131000_security_and_sync.sql:418-422](../supabase/migrations/20260425131000_security_and_sync.sql#L418-L422).
- The INSERT policy only checks `user_id = auth.uid()`. A user can set `device_id` to any other user's device id (information disclosure / cross-correlation if devices end up in shared analytics).
- Fix: either remove direct INSERT (preferred per C1), or extend the policy to also assert `device_id is null or exists (select 1 from learner.devices d where d.id = device_id and d.user_id = auth.uid())`.

### H4. Auth configuration is too permissive for any production rollout

- Where: [supabase/config.toml](../supabase/config.toml).
- Current values that need to harden before public launch:
  - `minimum_password_length = 6` (line 175): raise to **at least 12**, ideally with `password_requirements = "lower_upper_letters_digits"` or stronger.
  - `password_requirements = ""` (line 178): set to a real complexity profile.
  - `[auth.email] enable_confirmations = false` (line 219): set to `true` so unverified emails cannot sign in.
  - `[auth.email] secure_password_change = false` (line 221): set to `true` to require reauthentication for password changes.
  - `[auth.captcha]` (lines 207-210): remains commented out. Enable hCaptcha or Turnstile before production sign-up traffic.
  - `[auth.mfa.totp] enroll_enabled / verify_enabled = false` (lines 296-297): plan TOTP enablement before any administrative or paid features.
  - `additional_redirect_urls = ["https://127.0.0.1:3000"]` (line 156): the URL is `https://` for a local port that runs HTTP. Likely a typo. If kept, it has no effect locally but should be reviewed before adding production redirects so the production allow-list is exact (no wildcards, exact origins only).
  - `[auth.email.smtp]` (lines 230-237): production deploys must wire a real SMTP provider via env-var secrets. Document this before launch.
  - `email_sent = 2` per hour (line 192): fine for local, but make sure this is overridden / removed in the hosted project.

### H5. SvelteKit Supabase client is module-scoped and uses `import.meta.env` instead of typed env modules

- Where: [src/lib/supabase.ts](../src/lib/supabase.ts).
- Two issues:
  1. The exported `supabase` is created at module scope. The same instance is reused across requests on the server. Once auth lands, this leaks session state between users (anyone hitting an SSR route can hijack whichever session was last set). This is the canonical anti-pattern Supabase warns against in the SvelteKit guide.
  2. `import.meta.env.PUBLIC_SUPABASE_URL` works because Vite injects it, but SvelteKit's typed `$env/static/public` (or `$env/dynamic/public`) is the correct surface. It surfaces missing env vars at build time and lets server-only counterparts (`$env/static/private`) be tracked separately.
- Fix (do this **before** any auth or DB-backed route lands):
  1. Add `@supabase/ssr` (already part of the planned migration in `auth-sync-strategy.md`).
  2. Create `hooks.server.ts` with `createServerClient(...)` per request, attaching to `event.locals.supabase` and `event.locals.safeGetSession`.
  3. In `+layout.server.ts`, use the request-scoped client and never the module-scoped one.
  4. For any browser interactions, use `createBrowserClient` once per page load (not at module scope) or via SvelteKit's recommended `$lib/supabase/client.ts` factory pattern.
  5. Replace `import.meta.env.PUBLIC_*` with `import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'`.
  6. Remove the `null`-fallback pattern (`supabase ?? null`); failing fast at startup is better than silent no-ops.
- Add `PRIVATE_SUPABASE_SERVICE_ROLE_KEY` to `.env.example` only with a comment that it is server-only and never imported into universal modules.

### H6. `course_versions` is treated as immutable in spec but UPDATE / DELETE are not blocked at the row level

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:62-78](../supabase/migrations/20260425130000_schema_foundation.sql#L62-L78).
- The DTO spec calls course versions "immutable curriculum releases". Today, any role with UPDATE on `curriculum.course_versions` (which is currently only `postgres` / `service_role`, since RLS is not even enabled on `curriculum.*`) can mutate a published version. RLS is the wrong tool here because `curriculum` is private; the right tool is a trigger.
- Fix: add a `BEFORE UPDATE` trigger that raises if `OLD.status = 'published'` and any non-allowlisted column changes. Same for DELETE with `OLD.status` in `('published','archived')`. This is "publish means immutable" enforced in the database.

### H7. RLS is not enabled on `curriculum.*` tables

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:334-341](../supabase/migrations/20260425131000_security_and_sync.sql#L334-L341).
- Only `delivery.*` and `learner.*` have RLS enabled. `curriculum.*` does not. The Supabase database linter (`rls_disabled_in_public`-style checks) treats every table as needing RLS by policy.
- Today nothing is granted to anon/authenticated on `curriculum`, so this is safe in practice. But two failure modes are easy:
  1. A future migration grants something to `authenticated` on `curriculum.*` (e.g., via `grant select on all tables in schema curriculum to ...`) and immediately exposes the whole authoring corpus.
  2. A future migration adds `curriculum` to the API `schemas` list. Without RLS on, every row is exposed.
- Fix: enable RLS on every `curriculum.*` table with no policies (deny-all by default). It's a single-line change per table and removes the footgun:
  ```sql
  alter table curriculum.languages enable row level security;
  -- ... and so on for every curriculum table
  ```
  Same applies to `internal_api` (no tables, but apply to any future table).

### H8. RLS policies do not restrict which columns the user can write

- Where: e.g., [supabase/migrations/20260425131000_security_and_sync.sql:374-379](../supabase/migrations/20260425131000_security_and_sync.sql#L374-L379) (`learner_profiles_update_own`).
- Today `learner_profiles_update_own` lets a user UPDATE their row, which means they can also touch `created_at`, `updated_at` (overridden by trigger, fine), and `user_id` itself (the `with check` re-validates `auth.uid() = user_id` so they cannot reassign — good). Across the system though, INSERT policies on `learner.devices`, `learner.preferences`, etc. accept any column the grant allows.
- Fix: use column-level grants for the columns the user is actually allowed to write, e.g.:
  ```sql
  revoke insert, update on learner.profiles from authenticated;
  grant select on learner.profiles to authenticated;
  grant update (display_name) on learner.profiles to authenticated;
  ```
  Apply per table. This is the standard pattern in mature Supabase deployments and removes whole categories of "user can pretend their account was created in 1970" issues.

---

## Medium

### M1. Public schema is exposed via the API and used for cross-cutting types

- Where: [supabase/config.toml:13](../supabase/config.toml#L13) — `schemas = ["public", "graphql_public", "delivery", "learner"]`. PostgreSQL enums are created in `public`.
- `public` is exposed to PostgREST and graphql_public. While bare enums are not table endpoints, anything that drifts into `public` later (a view, a temp table) becomes auto-exposed. Enums also become introspectable through GraphQL.
- Fix: drop `public` from `schemas` in `config.toml` if no app code reads from it (the codebase does not). Move enums into `curriculum` or a dedicated `enums` schema.

### M2. `extra_search_path` includes `learner`

- Where: [supabase/config.toml:15](../supabase/config.toml#L15).
- PostgREST will resolve unqualified table names against `learner` (and `delivery`, `public`, `extensions`). This is convenient but means a future migration that creates an unintentionally-named table in any of these schemas could be auto-exposed under an unqualified name.
- Fix: tighten to `extra_search_path = ["public", "extensions"]` and force callers to qualify `delivery.X` / `learner.X` explicitly. Update any planned `.from()` calls to use schema-qualified names via `client.schema('delivery').from(...)`.

### M3. `course.current_published_version_id` does not enforce same-course relationship

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:80-84](../supabase/migrations/20260425130000_schema_foundation.sql#L80-L84).
- The FK only requires the version to exist, not that `version.course_id = course.id`. An admin bug could point Course A's "current published version" at Course B's version.
- Fix: add a composite FK using the existing unique constraint on `(course_id, id)`:
  ```sql
  alter table curriculum.courses
    add constraint courses_current_published_version_same_course_fkey
    foreign key (id, current_published_version_id)
    references curriculum.course_versions(course_id, id)
    on delete set null;
  ```
  Then drop the existing `courses_current_published_version_fkey`.

### M4. `learner.devices.last_seen_at` is fully client-controlled

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:249-257](../supabase/migrations/20260425130000_schema_foundation.sql#L249-L257), update policy [20260425131000_security_and_sync.sql:393-398](../supabase/migrations/20260425131000_security_and_sync.sql#L393-L398).
- A user can set `last_seen_at` to any value, breaking telemetry and any "active devices" features.
- Fix: use a `BEFORE INSERT/UPDATE` trigger to force `last_seen_at = now()`, or revoke update on that column.

### M5. No length / shape constraints on text columns

- Where: many. Examples: `learner.profiles.display_name`, `learner.devices.client_device_id`, `learner.devices.platform`, `learner.lesson_attempts.client_attempt_id`, `curriculum.anchor_targets.meaning`.
- An authenticated user can store arbitrarily long text. Even with PostgREST's body limits, repeated writes can fill disk. Some columns are exposed in UI (`display_name`) so very long values are also a UX/abuse vector.
- Fix: add reasonable `check (length(col) <= N)` constraints. Suggestions:
  - `display_name`: `<= 64`, also `length(trim(...)) > 0` if non-null.
  - `client_device_id`: `<= 128`.
  - `platform`: `<= 64`.
  - `client_attempt_id`: `<= 64`.
  - JSON columns: cap with `octet_length(col::text) <= ...`.

### M6. `course_publications.created_by` and `course_versions.created_by` are uuid with no FK to `auth.users`

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:74](../supabase/migrations/20260425130000_schema_foundation.sql#L74), [20260425130000_schema_foundation.sql:225](../supabase/migrations/20260425130000_schema_foundation.sql#L225).
- Auditability suffers: orphan ids accumulate when users are deleted, and there is nothing to prevent storing a non-existent uuid.
- Fix: add FK with `on delete set null`:
  ```sql
  alter table curriculum.course_versions
    add constraint course_versions_created_by_fkey
    foreign key (created_by) references auth.users(id) on delete set null;
  ```
  Same for `delivery.course_publications`.

### M7. Realtime and Storage S3 protocol enabled by default

- Where: [supabase/config.toml:81-86, 122-123](../supabase/config.toml).
- Realtime is enabled. If any realtime channel is opened in code without an RLS policy that's appropriate for streaming, a misconfiguration leaks data continuously (not request-by-request).
- S3 protocol is enabled. If never used, it adds an extra protocol surface.
- Fix: disable both until needed (`enabled = false`). Re-enable explicitly when adding a feature that uses them, paired with an RLS / policy review.

### M8. Database SSL / network restrictions are not enforced in config

- Where: [supabase/config.toml:67-79](../supabase/config.toml).
- These are local-only knobs in `config.toml`, but the file is what the team will copy into production deploy planning. `[db.ssl_enforcement] enabled = true` should be the default for any production project. `db.network_restrictions` should be planned (allow-list) before exposing the project.
- Fix: not a code change — add a docs note in `docs/db.md` or a deploy checklist that captures these as production-required.

### M9. `learner.devices` allows unbounded device count per user

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:249-257](../supabase/migrations/20260425130000_schema_foundation.sql#L249-L257).
- Unique on `(user_id, client_device_id)` prevents duplicates with the same id, but a malicious client can rotate `client_device_id` and create unlimited rows.
- Fix: enforce a per-user cap via a trigger (e.g., 50 devices per user) or via `internal_api.upsert_device(...)` plus revoking direct INSERT.

### M10. `learner.lesson_attempts.attempt_payload` jsonb has no shape validation

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:288](../supabase/migrations/20260425130000_schema_foundation.sql#L288).
- Free-form jsonb is a write-amplification target and a XSS / future-rendering risk if any field is later surfaced in UI.
- Fix: at minimum cap size (M5). Optionally validate shape using a CHECK constraint with `jsonb_matches_schema` (pg_jsonschema extension) when the payload contract stabilizes.

### M11. Email signup rate limiting plus anonymous flow is not yet planned

- Where: [supabase/config.toml:190-204](../supabase/config.toml#L190-L204) and `auth-sync-strategy.md`.
- The strategy doc plans an "anon then link" flow, but `enable_anonymous_sign_ins = false` and there is no captcha or aggressive rate limit configured. If anonymous sign-ins are turned on without captcha, automated traffic can mint sessions.
- Fix: when anon sign-ins are enabled, also enable `[auth.captcha]` and tune `[auth.rate_limit] anonymous_users` and `sign_in_sign_ups`. Require this combination via the security checklist for anon-related work.

---

## Low

### L1. `internal_api.set_updated_at()` has no `set search_path`

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:16-24](../supabase/migrations/20260425130000_schema_foundation.sql#L16-L24).
- Function body only references `now()` and `new`, so this is safe in practice, but the Supabase linter will flag every function without a pinned search_path.
- Fix: add `set search_path = pg_catalog` (or `''`).

### L2. Migrations create types in `public` schema by default

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:10-14](../supabase/migrations/20260425130000_schema_foundation.sql#L10-L14).
- Covered under C3 / M1. Calling out separately for the migration changelog.

### L3. `learner.preferences` and `learner.profiles` have user-INSERT policies, but rows are auto-created by `handle_new_user`

- Where: [supabase/migrations/20260425131000_security_and_sync.sql:368-372, 436-440](../supabase/migrations/20260425131000_security_and_sync.sql#L368-L372).
- The INSERT policies are defensible (idempotent recovery) but unused in normal flow. Consider dropping them to shrink the policy surface, or document the intent.
- Fix: either remove the INSERT policies and rely on the trigger, or add a code comment in the migration noting the recovery scenario these policies cover.

### L4. `seed.sql` is empty

- Where: [supabase/seed.sql](../supabase/seed.sql).
- Not a security issue but worth noting for the audit: the only protection that sits in front of curriculum data is the migration scripts themselves. When seeding lands, treat it as data-trust work — never put real secrets in a checked-in seed.

### L5. Documentation does not warn future contributors about the module-scoped client

- Where: [src/lib/AGENTS.md](../src/lib) (no AGENTS file in lib root), [src/lib/stores/AGENTS.md](../src/lib/stores/AGENTS.md), root `AGENTS.md`.
- The `AGENTS.md` files describe `src/lib/supabase.ts` as a "browser-safe Supabase entry point only" but do not flag that the current module-scoped pattern is a placeholder. New contributors could add server imports to it.
- Fix: add a banner comment in `src/lib/supabase.ts` and a one-line note in the relevant `AGENTS.md` until `@supabase/ssr` is integrated.

### L6. No automated linter / advisor invocation in the workflow

- The Supabase platform offers `get_advisors` (security and performance lints) and the local CLI exposes `supabase db lint`. Today the team validates with `supabase db reset --yes` and `pnpm check` only, neither of which catches the `function_search_path_mutable`, `security_definer_view`, `rls_disabled_in_public` style issues called out above.
- Fix: add a pre-PR step that runs the Supabase advisors / linter against the local DB, and capture findings as pass/fail.

### L7. `additional_redirect_urls` value is `https://127.0.0.1:3000`

- Where: [supabase/config.toml:156](../supabase/config.toml#L156).
- Likely a typo for `http://127.0.0.1:3000`. Locally this means the listed URL never matches the real dev origin, so any auth-redirect tests will silently fail.
- Fix: correct the scheme. When production is added, list explicit `https://...` origins with no wildcards.

### L8. `course_enrollments.course_version_id` does not enforce membership in the same course

- Where: [supabase/migrations/20260425130000_schema_foundation.sql:259-276](../supabase/migrations/20260425130000_schema_foundation.sql#L259-L276).
- There is a composite FK `(course_id, course_version_id)` to `course_versions(course_id, id)`. Good. This appears already enforced — verifying as a positive finding.
- No change required. Listed for the audit completeness ledger.

---

## Positive Findings (no change required)

- Schema separation (`curriculum` / `delivery` / `learner` / `internal_api`) is a strong baseline and matches the principle of least exposure.
- `pgcrypto` is created in `extensions`, not `public`. ✓
- Composite FK from `learner.lesson_attempts` and `learner.lesson_progress` to `(course_enrollments.id, user_id)` is excellent defense-in-depth and prevents the most common RLS-bypass mistakes.
- `drill_options` partial-unique index `where is_correct = true` correctly enforces "exactly one correct answer".
- Idempotency on `lesson_attempts(enrollment_id, client_attempt_id)` is correct for retry-safety.
- `handle_new_user` uses `on conflict do nothing` and runs as `SECURITY DEFINER` with a minimal `pg_catalog, learner` search_path (good direction; tighten further per C3).
- `delivery.*` policies correctly gate runtime reads on `is_active = true` and have no write policies.
- `enable_anonymous_sign_ins = false` is a safe default until anon flow is designed.
- Refresh-token rotation enabled (`enable_refresh_token_rotation = true`).
- The repo's `AGENTS.md`, `docs/security-review-checklist.md`, and `docs/db.md` already encode the right "stop and review at boundaries" cultural rules.

---

## Recommended Remediation Order

Fix in this order so each step closes the highest exposure first and the smaller hygiene work batches into one migration:

1. **Single migration to fix C1, C2, C3, H6, H7, H8, M1, M3, M6, L1**
   - Move enums out of `public`.
   - Tighten every `SECURITY DEFINER` function's `search_path = ''`.
   - Drop `p_user_id` parameter from `sync_lesson_attempt_batch`; resolve identity inside.
   - Remove direct INSERT on `learner.lesson_attempts`; make projection function the only path.
   - Enable RLS on every `curriculum.*` table (deny-all).
   - Replace blanket UPDATE/INSERT grants on `learner.*` with column-level grants.
   - Add immutability trigger on `curriculum.course_versions`.
   - Add same-course FK on `courses.current_published_version_id`.
   - Add FKs on `created_by` columns.
   - Add `set search_path` to `set_updated_at()`.

2. **Second migration to add input bounds (H1, H2, H3, M5, M9, M10)**
   - Length checks, batch caps, completion-time bounds, payload size caps, device-count cap.

3. **Config and SvelteKit boundary work (H4, H5, M2, M7, M8, L5, L7)**
   - Switch `src/lib/supabase.ts` to `@supabase/ssr` request-scoped clients.
   - Use `$env/static/public` and `$env/static/private`.
   - Tighten `config.toml` auth settings before any production deploy.
   - Drop `public` and `learner` from `extra_search_path`.
   - Disable Realtime / S3 protocol until needed.

4. **Process and lint (L6, L4, L3, M11)**
   - Add Supabase advisor / linter step before merging DB migrations.
   - Plan anonymous sign-in + captcha rollout together.

## Validation Strategy

For each remediated item, verify:

- `pnpm exec supabase db reset --yes` still succeeds.
- `pnpm exec supabase db lint` (or the hosted advisors) shows no new findings.
- Add a pgTAP / SQL smoke test for the highest-value invariants:
  - "Authenticated user cannot insert into `learner.lesson_attempts` directly" (after C1).
  - "Authenticated user cannot UPDATE another user's row" via `set_config('request.jwt.claim.sub', ...)`.
  - "`sync_lesson_attempt_batch` rejects mismatched user vs enrollment".
  - "`course_versions` row with `status = 'published'` cannot be UPDATEd by a non-superuser".

## Out Of Scope For This Audit

- Drizzle adoption (not yet decided; not touched).
- Real curriculum seed safety (separate task; mention only as L4).
- Production deployment posture (DNS, CDN, WAF, log retention) — separate operational checklist.
- App-side input validation on the SvelteKit boundary — will be re-audited when the first `+page.server.ts` / `*.remote.ts` lands.
