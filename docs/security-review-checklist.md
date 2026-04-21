# Security Review Checklist

Use this checklist for any change that touches environment variables, authentication, authorization, sessions, cookies, databases, storage, secure routes, secrets, encryption, or production integrations.

If a change falls into one of those categories, it is high-risk work and must not be deployed without explicit human sign-off.

## 1. Scope The Risk

- What sensitive asset or trust boundary is being changed?
- Which users, roles, systems, or secrets are affected?
- Is this introducing a new attack surface, integration, or persistence path?
- Is the feature really needed now, or can it be deferred until the design is better understood?

## 2. Research The Exact Stack

- Read the current first-party framework and provider docs for the exact feature being added.
- Confirm whether the work belongs in a server-only module, a server load function, a remote function, a form action, or a `+server.ts` endpoint.
- Confirm how environment variables, cookies, sessions, and auth state are expected to flow in the current version of the stack.
- Verify that any example being followed matches the current SvelteKit and provider guidance rather than legacy helpers.

## 3. Environment Variable Safety

- Confirm every new variable is classified correctly as public or private.
- Verify that no private value is imported into universal or client code.
- Confirm that secrets are never logged, serialized, or embedded in HTML responses.
- Update env examples and docs without exposing secret values.

## 4. Auth And Session Review

- Authentication checks happen on the server, not only in the client UI.
- Authorization rules are based on verified user identity and role data.
- Session handling uses the current recommended provider and framework integration.
- Cookies use secure settings appropriate to the environment and flow.
- No trust decision relies on unverified client session data.

## 5. Database And Storage Review

- Access is least-privilege by default.
- Service-role or admin credentials remain server-only.
- Database reads and writes are scoped to the minimum required data.
- Row-level security or equivalent access controls are in place when user data is involved.
- Uploaded files, object paths, and storage permissions are validated and not guessable by default.

## 6. Route And API Surface Review

- First-party app communication uses the smallest appropriate server abstraction.
- `+server.ts` is only used when a real HTTP surface is needed.
- All request params, query values, headers, and bodies are validated explicitly.
- Error responses avoid leaking secrets, internals, or privileged identifiers.
- New endpoints are deny-by-default and only expose the fields actually needed.

## 7. Input, Output, And Logging Review

- All untrusted input is validated at the trust boundary.
- User-controlled content is escaped or sanitized appropriately for its output context.
- Logs contain enough information for debugging without leaking secrets or sensitive personal data.
- Analytics, monitoring, and error tools do not capture credentials, secret tokens, or secure payload contents.

## 8. Validation Before Sign-Off

- Relevant checks pass locally.
- Happy-path behavior is verified manually.
- Failure-path behavior is verified manually.
- Unauthorized and malformed requests are tested.
- Secrets and private values are confirmed absent from client bundles, rendered HTML, and logs.

## 9. Deployment Gate

- The implementation has been reviewed by a human with awareness of the security implications.
- Remaining risks, assumptions, and follow-up work are documented.
- No unresolved uncertainty remains around public/private boundaries, authorization, or secret handling.

If any of the above cannot be answered confidently, stop and resolve that uncertainty before deployment.
