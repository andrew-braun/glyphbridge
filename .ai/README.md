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
