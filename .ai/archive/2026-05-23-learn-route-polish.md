# Learn Route Polish

## Scope

- Make the lesson progress tracker skinnier and separate the Lessons back action.
- Keep the mobile lesson flow vertical while improving desktop above-the-fold density.
- Improve drill answer spacing.
- Reset lesson-local state when navigating between lesson IDs.
- Fix confusing Thai drill copy/options and refresh generated delivery artifacts.

## Decisions

- Preserve the canonical lesson step order: intro, breakdown, letters, rules, drills, complete.
- Keep shared UI primitives domain-agnostic; lesson-specific chrome belongs under `src/lib/components/lesson`.
- Treat `src/lib/data/thai.ts` as the curriculum source of truth, then regenerate seed/publication artifacts for runtime parity.

## Progress

- [x] Investigated current learn route, step components, drill UI, progress state, and publication artifact path.
- [x] Split lesson back navigation from lesson progress.
- [x] Reset lesson-local step state on lesson changes.
- [x] Add desktop-responsive lesson step layouts.
- [x] Improve drill answer spacing.
- [x] Fix Thai drill content and generated artifacts.
- [x] Run validation.

## Notes

- The current route reads `.generated` publication artifacts before falling back to delivery reads, so content changes must refresh generated artifacts to appear in the local runtime.
- Validation passed with `pnpm check`, `pnpm stylelint`, `pnpm db:smoke:delivery` using local public Supabase env mapping, and `pnpm build`.
- During the work, unrelated Glyphin/Glyphin naming diffs appeared in other files; they were left untouched.
