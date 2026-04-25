# GlyphBridge

GlyphBridge is a Thai reading app built around a simple idea: learners remember script faster when it is tied to real words they would actually encounter.

Instead of dumping an alphabet chart on day one, GlyphBridge starts with useful Thai words from signs, roads, food, and daily life. Each lesson breaks a word into readable pieces, teaches only the letters and rules needed for that word, and then reinforces the pattern with short drills.

## Why It Exists

Many beginner resources make Thai script feel abstract, dense, or disconnected from the real world. GlyphBridge is designed to feel practical from the first lesson.

- Real-world anchor words instead of isolated symbol memorization
- Tight, step-based lessons that keep cognitive load manageable
- Mobile-friendly drills that reward pattern recognition, not brute force
- A product structure that is intentionally built to scale into richer curriculum, progress, and auth features without turning into a mess

## Current Product Shape

The current app focuses on the early Thai reading journey.

- Home page with product framing and lesson entry points
- Lesson flow built around intro, breakdown, letters, rules, drills, and completion
- Static curriculum data in TypeScript
- Client-side progress persistence using localStorage
- Optional future backend path through Supabase

## Tech Stack

- SvelteKit 2
- Svelte 5 runes mode
- TypeScript
- SCSS
- `pnpm` with Node `24.15.0`
- `@supabase/supabase-js` today, with `@supabase/ssr` planned for any real auth or server-backed data work

The project is intentionally component-centric. Routes own page orchestration and metadata. Reusable UI lives in `src/lib/components`. Canonical curriculum data lives in `src/lib/data`. Client-state and persistence boundaries live in `src/lib/stores`.

## Development

Install dependencies:

```sh
pnpm install
```

Start the dev server:

```sh
pnpm dev
```

Run project checks:

```sh
pnpm check
```

Run the full formatting and linting suite:

```sh
pnpm check:all
```

Run the targeted lint commands:

```sh
pnpm lint
pnpm stylelint
```

Build for production verification:

```sh
pnpm build
```

## Working Conventions

- Non-minor work gets a dated task/spec tracker in `.ai/`
- Durable reference documentation lives in `docs/`
- Repo-wide standards live in `AGENTS.md`
- Claude compatibility lives in `CLAUDE.md`
- Copilot guidance lives in `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`
- Instruction files must be updated whenever architecture, tooling, environment, or workflow assumptions change

## Security Posture

GlyphBridge is still early, but the security bar is already strict.

- Anything involving auth, databases, environment variables, sessions, cookies, storage, or secure routes is treated as high-risk work
- High-risk changes require current-doc research and explicit sign-off before deployment
- Secrets must never be committed, logged, or exposed to the client
- If Supabase-backed auth or database features are added, server-side verification and least-privilege access are mandatory

## Roadmap Direction

The codebase is being set up to move fast without losing structure.

- Expand the Thai curriculum while keeping lesson data canonical and reusable
- Introduce richer progress and review systems without leaking business logic into UI primitives
- Adopt modern SvelteKit patterns such as remote functions where they improve developer speed and product quality
- Add secure server-backed features only behind researched and reviewed boundaries
