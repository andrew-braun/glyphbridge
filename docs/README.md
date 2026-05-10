# Docs Directory

This directory is for durable project documentation that should stay useful beyond a single implementation task.

Use `docs/` for:

- Security review checklists
- Architecture notes
- Operational runbooks
- Workflow guides
- Durable design decisions that should be easy to find later

Do not use `docs/` for task-by-task implementation tracking. Task specs, in-progress notes, and backlog items belong in `.ai/`.

## Current Documents

- `auth.md` — durable auth architecture and security guide for request-scoped Supabase auth, learner sync boundaries, and rollout pitfalls.
- `app-philosophy.md` — authoritative product guide covering the app model, lesson contract, progress path, and technical guardrails.
- `db.md` — README-style database guide covering schema roles, table responsibilities, common SQL queries, local and linked Supabase CLI workflow, and remote deployment guidance.
- `database-dto-spec.md` — build-ready PostgreSQL, Supabase, and runtime DTO specification for curriculum delivery and learner progress.
- `pre-rollout-tasks.md` — shared list of concrete follow-up work that must land before production rollout.
- `concept/approach-thai.md` — detailed source concept for the initial curriculum approach that informed the generalized app philosophy.
- `security-review-checklist.md` — deployment gate and review checklist for high-risk security-sensitive changes
