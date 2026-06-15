---
id: run-game-credits-026
scope: wide
work_items:
  - id: fix-preview-dark-mode
    intent: archive-preview-fixes
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
  - id: block-future-puzzles
    intent: archive-preview-fixes
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-14T20:54:21.895Z
completed: 2026-06-15T08:42:09.743Z
---

# Run: run-game-credits-026

## Scope
wide (2 work items)

## Work Items
1. **fix-preview-dark-mode** (autopilot) — completed
2. **block-future-puzzles** (autopilot) — completed


## Current Item
(all completed)

## Files Created
(none)

## Files Modified
- `src/components/call-sheet-archive.js`: preview bg uses flipping --cs-card
- `src/lib/puzzle-schedule.js`: no future fallback (return null)
- `src/components/call-sheet-app.js`: guard id > today in _load
- `tests/unit/puzzle-schedule.test.js`: no-future-fallback assertion
- `tests/e2e/archive.spec.js`: future-puzzle unavailable e2e
- `tests/e2e/dark-mode.spec.js`: archive teaser dark-surface e2e

## Decisions
(none)


## Summary

- Work items completed: 2
- Files created: 0
- Files modified: 6
- Tests added: 3
- Coverage: 97%
- Completed: 2026-06-15T08:42:09.743Z
