# Store Rules

## Responsibility Boundary

- Stores own client-side state, derived state, and persistence mechanics.
- Stores do not own canonical curriculum content.
- Stores should expose a small, intentional API of readable stores and mutation functions.
- For new shared reactive logic, first consider whether a rune-powered `.svelte.ts` module is the better fit than a classic store.
- For backend persistence or sync work, start with `docs/db.md` and `docs/database-dto-spec.md` before changing store ownership or persistence boundaries.

## Reactivity Standards

- Prefer Svelte 5 runes and universal reactivity for new extracted state logic.
- Use classic Svelte stores only when the store contract is specifically useful for subscriptions, interop, or existing boundaries.
- Prefer derived projections over manually synchronized state.
- Keep mutations centralized in exported functions rather than scattered inline updates across the app.
- Avoid subscriptions with hidden side effects unless lifecycle and duplication risks are fully controlled.

## Persistence Standards

- Guard all browser-only persistence access.
- Keep storage keys stable and explicit.
- Persist only the minimum durable state required to restore user progress.
- Data loaded from stores should stay serializable and migration-friendly.
- Client stores may queue learner activity, but they must not bypass the server-owned attempt-to-progress projection contract.

## Scope Control

- Do not put route-only view state in global stores.
- Do not put network orchestration in stores unless that boundary is clearly intentional and shared.
