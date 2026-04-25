---
applyTo: "src/lib/data/**/*,src/lib/stores/**/*,src/lib/supabase.ts"
---

# Data And State Instructions

- Treat `src/lib/data` as canonical curriculum content and `src/lib/stores` as client-state and persistence boundaries.
- Keep data serializable, schema-driven, and free of presentation markup.
- Keep lesson IDs stable and lesson ordering intentional.
- For database-backed state or schema questions, consult `docs/db.md` first and `docs/database-dto-spec.md` for the exact contract.
- For new shared reactive logic, prefer rune-powered `.svelte.ts` modules over classic stores unless the store contract is specifically needed.
- If a classic store is used, keep derived projections and mutation functions centralized and intentional.
- Guard browser-only persistence access.
- If Supabase-backed auth or server data is added, use `@supabase/ssr` and keep privileged logic on the server.
- Treat auth, database, storage, and environment changes as high-risk work that requires current-doc research and sign-off before deployment.
- Do not mirror private `curriculum` or `internal_api` schema shapes directly into client-state APIs.
- If learner progress becomes server-backed, treat lesson attempts as client-written input and lesson progress as a server-owned projection.
