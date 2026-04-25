---
applyTo: "src/routes/**/*"
---

# Route Instructions

- Route files own page composition, metadata, and route-level data loading.
- Every user-facing page needs a unique, accurate title.
- Use `+page.ts` only for public serializable data safe in the browser.
- Use `+page.server.ts`, `+layout.server.ts`, or `+server.ts` for secrets, writes, or privileged data.
- Prefer SvelteKit remote functions for first-party app reads and mutations when they are a better fit than an ad hoc endpoint.
- Use `+server.ts` for webhooks, third-party integrations, public HTTP surfaces, streaming, binary responses, or when remote functions are not appropriate.
- For database-backed route work, start with `docs/db.md` and use `docs/database-dto-spec.md` for the exact schema and DTO contract.
- Validate params and query inputs early.
- Return the smallest page-data shape that the view actually needs.
- Treat auth, env, database, and secure-route changes as high-risk work that requires current-doc research and sign-off before deployment.
- Move reusable rendering into `$lib/components` instead of duplicating it across routes.
- Learner-facing routes should consume published `delivery` content or `learner` data through server-controlled boundaries, not raw `curriculum` tables.
