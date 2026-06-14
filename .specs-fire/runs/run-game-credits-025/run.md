---
id: run-game-credits-025
scope: wide
work_items:
  - id: archive-theme-index
    intent: archive-themes-preview
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
  - id: archive-themes-and-preview
    intent: archive-themes-preview
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-14T14:24:01.013Z
completed: 2026-06-14T14:29:23.473Z
---

# Run: run-game-credits-025

## Scope
wide (2 work items)

## Work Items
1. **archive-theme-index** (autopilot) — completed
2. **archive-themes-and-preview** (autopilot) — completed


## Current Item
(all completed)

## Files Created
- `public/puzzles/index.json`: Date→theme index for archive
- `scripts/build-archive-index.js`: CLI to rebuild index.json from manifest
- `tests/unit/archive-index.test.js`: Guard: every manifest date in index with non-empty theme
- `tests/unit/archive-tomorrow.test.js`: Unit tests for nextDateKey, tomorrowEntry, enrichWithThemes

## Files Modified
- `scripts/build-puzzles.js`: Added upsertArchiveIndex to keep index.json in sync on write
- `src/lib/date-key.js`: Added nextDateKey helper
- `src/lib/archive.js`: Added enrichWithThemes and tomorrowEntry helpers
- `src/archive-main.js`: Fetch index.json, enrich entries with theme, compute tomorrow preview
- `src/components/call-sheet-archive.js`: Added preview property, theme rendering on rows, locked tomorrow teaser
- `tests/e2e/archive.spec.js`: Added 2 new e2e tests for theme label and locked teaser

## Decisions
(none)


## Summary

- Work items completed: 2
- Files created: 4
- Files modified: 6
- Tests added: 13
- Coverage: 97%
- Completed: 2026-06-14T14:29:23.473Z
