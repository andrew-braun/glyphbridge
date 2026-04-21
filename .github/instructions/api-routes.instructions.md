---
applyTo: "src/routes/**/+server.ts,src/routes/api/**/*"
---

# API Route Instructions

- Prefer SvelteKit remote functions over ad hoc internal API endpoints for first-party app communication when they fit the use case.
- API handlers must live in `+server.ts` files.
- Use `+server.ts` for public HTTP APIs, webhooks, third-party callbacks, integrations, streaming, file responses, or when remote functions are not a fit.
- Validate request input explicitly and reject invalid requests with clear `4xx` responses.
- Handle auth and authorization on the server.
- Use private env modules for secrets.
- Any secure route, auth, env, or database change is high-risk work and must be researched against current docs and signed off on before deployment.
- Return intentional status codes and JSON payloads by default.
- Keep endpoint contracts small, explicit, and stable.
