# Curriculum Trackers

This directory is the central `.ai` home for per-language and per-glyph-system
curriculum progress, coverage status, and next authoring work.

## Use This Directory For

- One markdown file per language or script system, named `<language>.md`
- Current curriculum status for that language
- Coverage summaries for what is already authored
- Concrete follow-up authoring work and open curriculum questions
- Practical status wording that other task trackers can reuse without drifting

## Do Not Use This Directory For

- Session-specific implementation notes for a single coding task
- Broader DB architecture or auth rollout planning
- Durable concept docs that should live in `docs/`

Keep those in:

- `.ai/<dated-task>.md` for non-minor task trackers
- `.ai/tasks/<task-slug>/` for multi-file implementation workstreams
- `docs/` for durable product, pedagogy, and architecture reference docs

## File Expectations

Each `<language>.md` file should usually cover:

- goal and authority
- current summary
- current source hierarchy
- implemented curriculum capabilities
- coverage status by concept level or release slice
- open to-dos and explicit not-yet-in-scope work

## Current Trackers

- `thai.md`
