# GlyphBridge Claude Instructions

@AGENTS.md

## Claude Code

- Treat `AGENTS.md` as the canonical project instruction source.
- When a subdirectory has its own `AGENTS.md`, follow the nearest one in addition to the repo-wide rules.
- If you discover a repeatable project convention that is missing, update the relevant `AGENTS.md` instead of relying on chat-only memory.
- For database, schema, Supabase, RLS, or sync work, start with `docs/db.md` and use `docs/database-dto-spec.md` for the exact contract before editing migrations, server boundaries, or instruction files.
