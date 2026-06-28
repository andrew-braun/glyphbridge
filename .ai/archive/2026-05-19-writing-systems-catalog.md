# Task: Writing Systems Catalog

- Start date: 2026-05-19
- Owner: GitHub Copilot
- Status: done

## Goal

Create a durable curriculum catalog of writing systems Glyphin could cover,
grouped by living, historical, and fictional or constructed systems, with each
group ranked by likely appeal to native Anglophone and European learners.

## Scope

- In scope:
  - Broad survey of real, dead, undeciphered, and fictional or constructed scripts.
  - Ranking rubric focused on likely learner demand, cultural visibility, travel use,
    heritage interest, and course feasibility.
  - Documentation in `docs/curriculum/` plus docs index update.
- Out of scope:
  - Full course prospectuses for each candidate.
  - Corpus frequency analysis or source licensing sign-off for any specific course.
  - Runtime data model or UI changes.

## Constraints

- Technical:
  - Keep the document maintainable and scan-friendly rather than pretending the
    long tail is closed forever.
- Product:
  - Rank by likely appeal to native Anglophone and European learners, not by total
    global speaker population alone.
- Security:
  - No security-sensitive changes.

## Decisions

- Decision: Treat “real” as living or actively used scripts, “dead” as historical,
  obsolete, or undeciphered systems, and “fictional/constructed” as invented scripts
  used for fictional worlds, conlangs, pedagogical reforms, technical notation, or
  modern cultural movements.
  Reason: The user asked for real, fictional, and dead; this split keeps living use,
  historical study, and invented-script fandom/product questions separate.

- Decision: Use ranked tiers plus candidate rows rather than an absolute claim of
  exhaustive global finality.
  Reason: New scripts, proposals, and community conventions change over time, while
  a tiered catalog remains useful for roadmap decisions.

## Progress

- [x] Discovery and research
- [x] Implementation
- [x] Validation
- [x] Documentation updates

## Open Questions

- None yet.

## Follow-Up

- Consider a future weighted scoring spreadsheet once product strategy narrows to
  the next five course candidates.
