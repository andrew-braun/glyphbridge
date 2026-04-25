# Docs Rules

## Purpose

- `docs/` contains durable reference documentation for the repository.
- Documents here should remain useful after the original task is complete.

## What Belongs Here

- Security checklists
- Architecture and workflow guides
- Long-lived operational references
- Durable decision records when a separate ADR system is not in use
- Database reference docs such as `db.md` and `database-dto-spec.md`

## What Does Not Belong Here

- Transient task trackers
- One-off scratch notes
- Chat-history summaries that only matter to a single implementation pass

## Maintenance

- Keep docs concise, factual, and easy to scan.
- Update docs when the implementation or policy they describe changes.
- Delete or rewrite stale guidance immediately.
- Keep `db.md` as the README-style entry point for database layout and inspection, and keep `database-dto-spec.md` as the exact schema contract.
