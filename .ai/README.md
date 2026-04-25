# `.ai` Task Files

This directory holds durable task specs and progress trackers for non-minor work.

If a document should live beyond a single task, put it in `docs/` instead.

## Naming

- Create one markdown file per non-minor task.
- Name files as `YYYY-MM-DD-short-description.md` using the task start date.

## When To Create One

- Any task with multiple steps, meaningful decisions, architectural impact, security implications, or likely follow-up work.
- If in doubt, create the file.

## What To Track

- Goal and scope
- Relevant constraints
- Decisions made and why
- Progress checklist
- Open questions or blockers
- Follow-up work

## Workflow

- Create the file before or at the start of implementation.
- Update it as the work evolves.
- Keep it accurate enough that someone can resume the task later without reconstructing the context from chat history.
- For larger workstreams that naturally split into multiple related task files, group them under `.ai/tasks/<task-slug>/` and add a local `README.md` that explains the document roles and reading order.
- Inside `.ai/tasks/<task-slug>/`, prefer semantic filenames and use the bundle `README.md` to record overlap, completion, and consolidation decisions.

## Archive

- Move dated task files to `archive/` once they are complete.
- If multiple completed task slices are mostly status duplicates, consolidate them into fewer files inside the relevant `.ai/tasks/<task-slug>/` bundle before archiving or deleting the redundant slices.
- Treat a task as complete when its status is `done` and its progress checklist is fully checked.
- Keep active, planned, blocked, backlog, and evergreen planning docs at the root of `.ai/` unless they are part of a dedicated multi-document task bundle under `.ai/tasks/`.
- When a narrow tracker mainly points at a durable doc in `docs/`, prefer consolidating that tracker into the bundle `README.md` instead of keeping a separate file.
