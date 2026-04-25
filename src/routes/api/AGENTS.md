# API Route Rules

## Scope

- This directory is reserved for future SvelteKit `+server.ts` handlers.
- Do not create endpoints here if a SvelteKit remote function is the cleaner first-party app interface.

## Handler Standards

- Export typed `RequestHandler` methods.
- Parse and validate request params, query strings, headers, and bodies explicitly.
- Reject invalid input with clear `4xx` responses.
- Use `json(...)` responses by default unless a non-JSON response is explicitly required.
- Reserve these handlers for true HTTP surfaces such as public APIs, webhooks, third-party callbacks, binary/file responses, streaming, or other cases where remote functions are not suitable.

## Security And Auth

- Treat every request as untrusted input.
- Perform authentication and authorization on the server before accessing protected data.
- Use private env modules for secrets.
- Never place service-role or admin credentials in public env vars or client code.
- Any new secure endpoint, auth flow, env wiring, or database access path requires current-doc research and explicit sign-off before deployment.
- For DB-backed handlers, start with `docs/db.md` and `docs/database-dto-spec.md` before designing the request or response contract.

## Design Rules

- Keep endpoint contracts small, explicit, and stable.
- Prefer one clear responsibility per endpoint.
- Put shared server-only helpers in server-only modules rather than duplicating logic across handlers.
- Do not expose private `curriculum` or `internal_api` schema details as public HTTP surfaces; handlers should orchestrate allowed server-side reads and writes only.
