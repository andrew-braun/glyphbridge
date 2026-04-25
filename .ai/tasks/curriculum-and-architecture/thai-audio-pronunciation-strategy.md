# Task: Thai audio pronunciation strategy

- Start date: 2026-04-21
- Owner: GitHub Copilot
- Status: planned

## Related Docs

- `README.md` for the bundle index and redundancy assessment
- `thai-curriculum-strategy.md` for the Thai content path this audio layer would support
- `multi-course-architecture.md` for the broader course-aware app direction

## Goal

Define the lowest-cost, highest-quality path for adding Thai pronunciation support to the app, with a clean MVP and an upgrade path for future content expansion.

## Scope

- In scope:
  - MVP audio source strategy
  - Asset model and playback direction
  - Cost and operational tradeoffs
  - Upgrade path for broader content coverage
- Out of scope:
  - Audio UI implementation
  - Recording sessions
  - Cloud provider setup

## Constraints

- Technical:
  - Keep the MVP simple enough to fit the current static-content architecture.
  - Avoid introducing a fragile live synthesis dependency for core learning flows.
- Product:
  - Pronunciation should be accurate enough for a beginner literacy app, especially for letters, syllables, and high-value words.
  - Playback should be learner-triggered, not noisy or automatic.
- Security:
  - Any later cloud integration or storage provider setup will need explicit review.

## Decisions

- Decision: Prefer a small native-speaker recorded static corpus for the taught inventory.
  Reason: Thai pronunciation quality matters more than synthesis convenience for letters, syllables, and anchor words, and a small fixed library keeps recurring cost near zero.
- Decision: Treat browser or device TTS as fallback or internal tooling, not the primary learner-facing pronunciation layer.
  Reason: Pronunciation consistency varies too much across browsers and operating systems.
- Decision: Keep cloud TTS as a backfill path for future expansion rather than the MVP foundation.
  Reason: Batch generation is cheap later, but a curated starter corpus gives better pedagogical quality now.

## Progress

- [x] Discovery and research
- [x] Strategy recommendation captured
- [ ] Implementation planning
- [ ] Asset schema definition

## Current Recommendation

- Record human audio for taught letters, anchor words, syllable breakdowns, and other explicitly surfaced examples.
- Store clips as static assets with stable content IDs, then preload only the current lesson’s relevant files.
- Use user-triggered playback on words and syllables, with a fallback chain of recorded clip, cached generated clip, then no playback.

## Open Questions

- Whether to store audio under `static/` directly or plan immediately for object storage plus CDN.
- Whether the first implementation should include syllable-level audio or start with words only.

## Follow-Up

- Define an audio key schema that maps cleanly onto lesson data.
- Draft the minimal UI and asset-loading plan for lesson and known-word playback.
