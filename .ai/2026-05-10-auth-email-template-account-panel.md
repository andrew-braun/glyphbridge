# Task: Auth Email Template And Account Panel

- Start date: 2026-05-10
- Owner: GitHub Copilot
- Status: completed

## Goal

Clean up the remaining auth-related warning, replace the default local Supabase magic-link email copy with a GlyphBridge code-first template, and add a first account management panel for signed-in learners.

## Scope

- Remove the existing unused-variable warning in the home stats component.
- Configure a local Supabase magic-link email template that matches the code-entry product flow.
- Add the first account panel for signed-in learners using the existing auth and learner projection boundaries.
- Validate the touched UI, config, and documentation.

## Decisions

- Keep the account panel inside the existing `/auth` route for the first pass instead of creating a separate account route.
- Treat the learner projection as the account panel's source of truth for synced progress status.
- Prefer OTP-first email copy and leave magic-link behavior de-emphasized to avoid local and production confusion.

## Progress

- Removed the unused home stats derivation that was leaving the last ESLint warning behind.
- Added a committed OTP-first local auth email template at `supabase/templates/magic-link.html`.
- Wired the custom template in `supabase/config.toml` with a GlyphBridge-specific subject line.
- Expanded `/auth` so signed-in learners now see an account panel with sync status, synced lesson count, resume link, manual projection refresh, and sign-out.
- Updated the safe redirect allow-list so sign-in from `/auth` returns to the account panel by default.

## Validation

- `pnpm lint`
- `pnpm check`
- `pnpm build`
- Restarted local Supabase with `supabase stop && supabase start`
- Triggered a real local OTP email via `/auth?/requestCode`
- Verified the rendered subject and body in Mailpit for `template-check@example.com`

## Remaining Follow-up

- Mirror the committed local email template in hosted Supabase dashboard settings before production rollout.
