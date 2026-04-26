# Task: Thai curriculum strategy

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: in-progress

## Related Docs

- `README.md` for the bundle index and redundancy assessment
- `multi-course-architecture.md` for the broader course-aware architecture
- `../../../docs/app-philosophy.md` for the durable pedagogy guardrail
- `../../../docs/concept/approach-thai.md` for the durable Thai sequencing concept and lesson-expansion source

## Goal

Define a real-world-first Thai reading curriculum strategy that helps learners decode useful words as quickly as possible instead of memorizing the alphabet in traditional order.

## Scope

- In scope:
  - Curriculum sequencing principles
  - High-frequency letter, vowel, and final-sound prioritization
  - Early anchor vocabulary themes
  - Ongoing corpus-driven validation approach
- Out of scope:
  - Writing new lesson data files
  - Audio implementation
  - Auth or persistence work

## Constraints

- Technical:
  - Keep lesson data canonical in `src/lib/data`.
  - Avoid sequencing decisions that depend on backend features.
- Product:
  - Optimize for practical reading payoff on signs, menus, labels, roads, and common daily-life text.
  - Keep cognitive load low for absolute beginners.
- Security:
  - No security-sensitive work in scope.

## Decisions

- Decision: Optimize for unseen-word decoding coverage rather than academic alphabet order.
  Reason: Learners need practical reading wins early, and Thai becomes more usable when orthographic chunks unlock many visible words at once.
- Decision: Prioritize high-yield vowels, finals, and common orthographic chunks before low-payoff consonant completeness.
  Reason: Thai reading speed improves faster when the learner can decode frequent patterns such as long vowels, hidden vowels, final-stop families, and leading-`ห` combinations.
- Decision: Validate future sequencing against real-world text samples from menus, storefronts, transit signs, packaging, and appliance labels.
  Reason: General language frequency and on-the-ground reading frequency are not the same.

## Progress

- [x] Discovery and research
- [x] Strategy recommendation captured
- [x] Implementation planning
- [x] Curriculum updates

## Current Recommendation

- Start with high-payoff units such as `า`, `น`, `ม`, `ก`, `ง`, the `ต/ด` final family, the `ป/บ` final family, `ร`, `ส`, `อ`, `ไ◌`, `เ◌`, `ำ`, and common leading-`ห` chunks.
- Use early anchor vocabulary themes built around money, movement, survival utilities, food, drinks, bars, streets, and common labels.
- Measure progress by useful text coverage: how many common real-world words can be decoded after each lesson.
- The current runtime rewrite in `src/lib/data/thai.ts` now encodes a 13-lesson sequence spanning approach levels 1 through 5 and should be treated as the current implementation baseline.

## Open Questions

- Whether the first content expansion should optimize for tourist survival vocabulary or for the most commonly seen orthographic chunks regardless of meaning.
- Whether lesson IDs should eventually move from numeric order to stable slugs when the curriculum expands.

## Follow-Up

- Build a small target corpus from menus, signs, packaging, and interface labels.
- Score candidate lessons by frequency coverage and decoding payoff before expanding the curriculum.
- Use `../../../docs/concept/approach-thai.md` to scope the remaining level 6 loanword and complex-vowel lessons that are not yet encoded in `src/lib/data/thai.ts`.
