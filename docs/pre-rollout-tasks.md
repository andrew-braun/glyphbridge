# Pre-Rollout Tasks

Use this document for concrete tasks that still need to land before a production rollout.

Broader guidance and gates still live in `docs/auth.md`, `docs/db.md`, and `docs/security-review-checklist.md`.

## Open Tasks

| Area                 | Task                                                                                                                                                                     | Why it matters                                                                                                                                           | Source                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Authentication email | Mirror the committed local auth email template in hosted Supabase dashboard settings and verify the delivered hosted email matches the local GlyphBridge OTP-first copy. | Local development now uses a custom code-first template, but production will still send the default Supabase email until the hosted template is updated. | `.ai/2026-05-10-auth-email-template-account-panel.md` |
