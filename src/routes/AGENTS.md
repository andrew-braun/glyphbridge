# Route Rules

## Responsibilities

- Route modules own routing, page composition, route-level data loading, and metadata.
- Keep route files thin: load data, shape it for the page, and compose components.
- Shared rendering logic should move into `src/lib/components`, not stay duplicated across pages.

## Metadata And SEO

- Every user-facing page must set a unique, accurate title.
- Add meta descriptions for pages that should stand on their own in search or social previews.
- Keep one primary `h1` and a clear topical focus per page.
- Use descriptive internal links and human-readable URLs.
- Add canonical handling if the same content can exist at multiple URLs.

## Load Function Rules

- Use `+page.ts` only for public, serializable data safe for browser execution.
- Use `+page.server.ts` or `+layout.server.ts` for private env access, secrets, writes, or privileged data sources.
- Prefer SvelteKit remote functions for first-party app reads and mutations when they simplify typed server communication.
- Use `+server.ts` for webhooks, third-party integrations, public HTTP contracts, streaming, binary/file responses, or when remote functions are not the right abstraction.
- Validate params and query inputs early.
- Return the smallest data shape the page actually needs.
- Transform backend or content payloads before they hit presentation components.

## Layout Rules

- Layouts should provide app shell concerns and cross-route initialization only.
- Do not let layouts silently accumulate unrelated business logic.

## Future API Routes

- Create server endpoints as `+server.ts` files under `src/routes/api/**` or the relevant route segment.
- Validate request input explicitly.
- Handle auth and authorization on the server.
- Return intentional status codes and JSON payloads by default.

## Security Review

- Any route work touching environment variables, auth, sessions, cookies, databases, storage, or secure endpoints is high-risk and requires current-doc research plus human sign-off before deployment.
- Never expose private env data or trust client state for authorization.
