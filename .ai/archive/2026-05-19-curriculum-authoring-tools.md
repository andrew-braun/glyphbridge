# Task: Curriculum Authoring Tools

- Start date: 2026-05-19
- Owner: GitHub Copilot
- Status: done

## Goal

Add the first lightweight authoring tools needed before new curriculum authoring:
manifest validation, starter workspace scaffolding, manual candidate scoring,
review packet generation, and a database-ingestion strategy starter.

## Scope

- In scope:
  - Create dependency-free Node tooling under `scripts/`.
  - Add package scripts for scaffold, validate, score, and review workflows.
  - Scaffold a DB ingestion strategy starter file for each future course.
  - Document corpus-analysis tooling options and when to use existing resources.
  - Update durable docs index and framework links.
- Out of scope:
  - Unicode inventory probing.
  - Corpus downloading or heavy corpus analysis adapters.
  - Language-specific tokenizer integration.
  - Writing data into Supabase.
  - Authoring a new course.

## Constraints

- Technical:
  - Use `pnpm` and Node `24.15.0`.
  - Keep tooling offline and review-oriented.
  - Avoid new dependencies until a real corpus adapter needs them.
- Product:
  - Support the real-word-first lesson model and review gates from the framework.
  - Keep generated files understandable by curriculum authors and reviewers.
- Security:
  - Do not touch secrets, auth, environment variables, or live DB writes.
  - Treat license and source-use fields as mandatory manifest concerns.

## Decisions

- Decision: Build one dependency-free CLI at `scripts/curriculum-authoring-tools.mjs`.
  Reason: The first tooling slice is file-oriented and does not need package
  churn.
- Decision: Use JSON for machine-validated manifests in v1.
  Reason: The repo has no YAML parser dependency; JSON keeps validation simple
  until a richer format is justified.
- Decision: Generate DB ingestion strategy as a Markdown starter inside each
  scaffolded course workspace.
  Reason: The strategy needs human decisions before any SQL or seed generator is
  written.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Validation

- `node scripts/curriculum-authoring-tools.mjs --help` passed.
- Temporary scaffold/validate/score/review workflow passed under
  `/tmp/glyphbridge-authoring-tool-test`.
- Focused Prettier check passed for touched files.
- Focused markdownlint passed for touched Markdown files.
- `pnpm lint` passed.
- `pnpm stylelint` passed.
- `pnpm check` passed with 0 errors and 0 warnings.
- `pnpm check:all` is now wired to `pnpm quality:check`, but still stops at
  `format:check` because of pre-existing unrelated formatting warnings in older
  `.ai`, `.kilo`, and `docs/database-dto-spec.md` files.

## Open Questions

- Should future manifests move to JSON Schema once the shape stabilizes?
- Should course workspaces eventually live under `.ai/curriculum/<course-id>/` or
  a dedicated non-runtime authoring directory?

## Follow-Up

- Add a Unicode inventory probe when corpus analysis starts.
- Add language-specific corpus adapters only after a pilot course identifies the
  first script family.
- Convert reviewed authoring artifacts into a real seed/publication generator
  once a second course reaches implementation.
