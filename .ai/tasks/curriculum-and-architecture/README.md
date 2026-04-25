# Curriculum And Architecture Task Bundle

## Purpose

This directory groups the remaining planning documents for curriculum direction, multi-course product architecture, and Thai pronunciation strategy so they can be read as one connected workstream instead of separate top-level task slices.

## Recommended Reading Order

1. `multi-course-architecture.md`
   - Broad product and technical direction for course-aware architecture.
   - Read first when thinking about course DTOs, route structure, or long-term curriculum boundaries.
2. `thai-curriculum-strategy.md`
   - Thai-specific sequencing and vocabulary strategy.
   - Read when expanding or resequencing Thai lessons.
3. `thai-audio-pronunciation-strategy.md`
   - Audio sourcing, playback, and asset strategy for Thai pronunciation support.
   - Read when starting pronunciation playback or content production.

## Consolidation Assessment

### Kept as distinct

- `multi-course-architecture.md`
  - Completion: medium for planning, low for implementation.
  - Reason to keep: it still contains the main route, DTO, migration, and course-aware product architecture decisions.
  - Overlap: medium overlap with the durable `docs/app-philosophy.md` and the Supabase foundation planning, but it remains the best planning doc for app structure beyond the database layer.

- `thai-curriculum-strategy.md`
  - Completion: partial.
  - Reason to keep: it captures Thai-specific sequencing heuristics and corpus direction that are not replaced by broader architecture docs.
  - Overlap: low to medium overlap with `multi-course-architecture.md`; the latter is structure, this one is content strategy.

- `thai-audio-pronunciation-strategy.md`
  - Completion: partial.
  - Reason to keep: it covers a future audio workstream that is adjacent to curriculum but not redundant with content sequencing or DB planning.
  - Overlap: low overlap with the other docs in this bundle.

### Consolidated into this bundle index

- `2026-04-22-app-philosophy-document.md`
  - Completion: complete.
  - Redundancy: high. Its main output is now the durable product reference in `docs/app-philosophy.md`, and its remaining tracker value is mostly historical rather than actionable.
  - Consolidation choice: keep the durable reference in `docs/`, record the relationship here, and remove the narrow tracker.

## Durable References Outside `.ai`

- `docs/app-philosophy.md` is the canonical product and pedagogy guardrail.
- `docs/concept/approach-thai.md` remains the detailed Thai source concept.
- `.ai/tasks/supabase-db-foundation/foundation-plan.md` carries the database-side architecture that this bundle now feeds.

## Current Resume Point

- Generalize the current Thai-only DTO and route assumptions into course-aware seams before adding more courses.
- Build a small Thai target corpus and use it to score future lesson sequencing choices.
- Decide the first pronunciation asset key scheme and whether the MVP starts with word-level audio only or includes syllable-level clips.