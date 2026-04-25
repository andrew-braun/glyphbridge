# Engineering Quality Task Bundle

## Purpose

This directory groups the broader engineering cleanup and tooling audit documents so the team can distinguish between the evergreen quality roadmap and the narrower tooling implementation slice.

## Recommended Reading Order

1. `scaling-plan.md`
   - Broad engineering audit and prioritized cleanup roadmap.
   - Read first when deciding overall quality and scalability work.
2. `dev-tooling-setup.md`
   - Concrete tooling implementation slice for linting, formatting, aliases, and editor ergonomics.
   - Read when inspecting what already landed or extending the tooling baseline.

## Consolidation Assessment

### Kept as distinct

- `scaling-plan.md`
  - Completion: low as implementation, high as audit coverage.
  - Reason to keep: it is the broadest engineering punch list in the repo and includes non-tooling items that should not be squeezed into a narrow setup tracker.
  - Overlap: medium to high overlap with `dev-tooling-setup.md` on linting, formatting, CI, and environment hygiene.

- `dev-tooling-setup.md`
  - Completion: high.
  - Reason to keep: it records the concrete tooling slice that already landed, including outputs and validation, and is still the clearest record of that implementation.
  - Overlap: high with sections 1.1 and 1.2 of `scaling-plan.md`, but it remains the better document for the exact implementation pass that shipped.

### Consolidated into this bundle index

- `2026-04-21-docs-dir-and-convention-cleanup.md`
  - Completion: medium to high.
  - Redundancy: medium to high. Its durable outputs already exist (`docs/`, `docs/security-review-checklist.md`, `.ai/todo.md`), and its remaining convention-cleanup concerns are now tracked more explicitly in `scaling-plan.md` and `dev-tooling-setup.md`.
  - Consolidation choice: keep the durable outputs and fold the tracker context into this bundle instead of carrying a separate partially completed file.

## Durable References Outside `.ai`

- `docs/security-review-checklist.md` is the durable security checklist produced from the earlier cleanup work.
- `.ai/README.md` defines how task bundles and trackers should be maintained.

## Current Resume Point

- Use `scaling-plan.md` as the broad priority order for engineering cleanup.
- Treat `dev-tooling-setup.md` as the record of the tooling baseline that already shipped.
- Fold any remaining docs- or convention-cleanup work into this engineering-quality stream rather than reopening a standalone tracker.
