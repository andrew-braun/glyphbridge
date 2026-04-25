# GlyphBridge Instructions

## Purpose

- GlyphBridge is a SvelteKit app for learning to read Thai through real words, structured lesson flows, and progressive drills.
- Optimize for clarity, pedagogy, accessibility, and long-term maintainability.
- Favor strong conventions and small, obvious abstractions over cleverness.

## Source Of Truth

- This file is the canonical repo-wide instruction set.
- When working inside a subdirectory, also follow the nearest `AGENTS.md`.
- Keep `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` aligned with the relevant `AGENTS.md` files.
- When architecture, tech choices, configuration, environment variables, deployment assumptions, or workflow expectations change, update every relevant instruction file in the same change.
- Do not leave stale instruction files behind. If guidance no longer reflects the codebase, fix or delete it immediately.

## Stack And Runtime

- Package manager: `pnpm`
- Runtime: Node `24.15.0`
- Framework: SvelteKit 2, Svelte 5 runes, TypeScript, SCSS
- Runtime lesson content today: static lesson data plus localStorage-backed progress
- Local backend foundation: `supabase/` now contains the baseline SQL schema, RLS, seed entry point, and privileged sync helpers for future server-backed curriculum and learner state
- Optional backend path: Supabase

## Validation Workflow

- Install with `pnpm install`.
- Run `pnpm check` before finishing any non-trivial change.
- Use `pnpm check:all` when a change affects formatting, linting, or SCSS styling conventions.
- Use `pnpm lint` and `pnpm stylelint` directly when tightening a focused TypeScript, Svelte, or style slice.
- Run `pnpm build` whenever a change affects routes, metadata, environment variables, bundling, or deploy behavior.
- Use `pnpm dev` for manual UI verification.

## Task Tracking

- Every non-minor task must get a dedicated markdown spec and tracker file in `.ai/`.
- Name task files as `YYYY-MM-DD-short-description.md` using the date the task starts.
- Create the task file before or at the start of implementation, then keep it updated with scope, decisions, progress, blockers, and follow-up work.
- Treat the `.ai` file as the durable handoff artifact for resuming work later.

## Durable Documentation

- Use `docs/` for durable project documents that should outlive a single task, such as security checklists, architecture notes, workflow guides, and operational references.
- Use `.ai/` for task-scoped specs, trackers, and backlog notes rather than long-lived reference documentation.
- When a durable project fact is worth keeping beyond a task, move or summarize it into `docs/`.
- For database and Supabase work, start with `docs/db.md` and use `docs/database-dto-spec.md` for the exact schema and DTO contract.

## Architecture Map

- `docs`: durable reference docs, review checklists, and long-lived workflow guides
- `supabase`: local Supabase config, migrations, seed entry point, and privileged SQL functions
- `src/routes`: route composition, data loading, metadata, and page-level orchestration
- `src/lib/components`: reusable rendering building blocks
- `src/lib/data`: canonical curriculum content and shared types
- `src/lib/stores`: client state and persistence boundaries
- `src/lib/supabase.ts`: browser-safe Supabase entry point only

## Quality Bar

- Extend existing structures before creating parallel ones.
- Extract shared code only after a second concrete use or when a stable boundary is clear.
- Do not build mini-frameworks around tiny variations.
- Keep business rules out of generic UI primitives.
- Do not duplicate canonical lesson content across routes, components, stores, and utilities.
- Favor explicit, typed APIs over dynamic option bags.
- Preserve local formatting in touched files; do not mass-reformat unrelated code.

## Svelte 5 Standards

- Use `$state` for local mutable state.
- Use `$derived` for computed values.
- Use `$effect` only for real side effects, never as a substitute for derived state.
- Treat props as read-only inputs.
- Prefer callback props for child-to-parent communication.
- Use `$bindable` only when true two-way binding is part of the intended public API.
- Prefer snippet-based composition when children are rich or structured.
- Prefer render tags and snippets over legacy slot patterns in new code.
- Avoid legacy Svelte patterns when a current runes-mode equivalent exists.
- For new extracted shared state or reusable reactive logic, prefer rune-powered `.svelte.ts` or `.svelte.js` modules over classic Svelte stores unless a store contract is specifically needed for interop or subscriptions.

## Modern SvelteKit Standards

- Prefer SvelteKit remote functions in `.remote.ts` files for first-party app reads and mutations when they materially simplify typed client-server communication and fit the current framework support level.
- Reserve `+server.ts` endpoints for true HTTP surfaces such as webhooks, third-party integrations, public APIs, non-JSON responses, streaming, or cases where remote functions are not a good fit.
- Use progressive enhancement and server-driven mutations for forms wherever practical.
- Before adopting newly stabilized or beta Svelte/SvelteKit capabilities, verify current documentation and confirm the feature improves delivery speed rather than adding churn.

## Frontend Standards

- Use semantic HTML first. Reach for ARIA only when native semantics do not cover the interaction.
- Prefer Bits UI for reusable interactive primitives and composite controls wherever possible so focus, keyboard, and open-state behavior stay consistent across the site.
- Interactive behavior must use real interactive elements such as `button`, `a`, form controls, or accessible headless primitives.
- All images need meaningful `alt` text unless they are purely decorative.
- Reuse design tokens from `$lib/styles` instead of hardcoding new colors, spacing, or radii in components.
- Keep copy concise, concrete, and learner-focused.

## Routing And Data Loading

- Use `+page.ts` only for public, serializable data that is safe to run during client navigation.
- Use `+page.server.ts`, `+layout.server.ts`, or `+server.ts` for private environment access, writes, privileged fetches, or secrets.
- Validate route params early and throw `error(status, message)` for invalid states.
- Keep load return values minimal and shaped for the page, not as raw backend payloads.
- Each route owns its metadata. When metadata patterns repeat, extract a shared helper instead of copy-pasting head blocks everywhere.
- Keep URLs descriptive and content-oriented.

## SEO And Content Standards

- Every indexable page should have a unique, specific title.
- Add a concise meta description when the page has search-facing intent or share-card value.
- Keep one clear primary topic per page with a single strong `h1`.
- Avoid duplicate content under multiple URLs; add canonical handling when duplication becomes possible.
- Prefer descriptive internal link text and human-readable URLs.
- Write people-first content. Do not stuff keywords or add SEO-only filler copy.

## Client And Server Boundaries

- Do not touch `window`, `document`, `localStorage`, or browser-only APIs at module scope.
- Guard browser-only code or run it inside lifecycle hooks.
- Never import private environment modules into universal page code or client components.
- Server authorization decisions must happen on the server.

## Security And Deployment Governance

- Treat any change involving environment variables, authentication, authorization, session handling, cookies, databases, storage, secrets, encryption, secure API routes, or production integrations as high-risk work.
- High-risk work requires current-doc research, explicit threat review, least-privilege design, and human sign-off before deployment.
- Never guess on security-sensitive implementation details. Research the exact framework and provider guidance first.
- Secrets must stay in private environment variables, server-only modules, or managed secret stores. Never commit, log, serialize, expose, or echo them back to clients.
- Verify public versus private environment variable boundaries every time. Do not assume a variable is safe to expose just because similar variables are public.
- Perform authentication and authorization checks on the server using verified user identity, not optimistic client state.
- Validate and sanitize all untrusted input at trust boundaries.
- Prefer deny-by-default, minimal surface area, and least privilege for every new secure capability.
- If security posture is uncertain, stop and escalate rather than shipping.

## Supabase Standards

- Public anon credentials may appear in public env vars. Service-role or admin credentials must never reach client bundles.
- If auth or database-backed server features are introduced, use `@supabase/ssr` with server setup in `hooks.server.*` and server load functions or endpoints.
- Use browser Supabase clients only for public or session-scoped client interactions.
- Authorization must rely on verified server-side user lookups, not unverified client session assumptions.
- Use row-level security and least-privilege database access patterns when database-backed features are introduced.
- Treat Supabase auth, storage, and database schema changes as sign-off-required security-sensitive work.
- For schema, SQL, RLS, sync, or publication work, read `docs/db.md` first and `docs/database-dto-spec.md` before editing migrations or server-side DB access.
- Preserve the current schema boundaries: `curriculum` and `internal_api` are private implementation schemas; learner-facing runtime reads should go through `delivery` and `learner` server-controlled paths.

## Change Discipline

- Make the smallest coherent change that solves the actual problem.
- If a new pattern is warranted, document it in the nearest `AGENTS.md` and the matching Copilot instruction file.
- Update `docs/`, `.ai` task files, README, env examples, and relevant instruction files when project facts change.
- Leave the touched area more regular than you found it, but do not widen scope into unrelated refactors.
