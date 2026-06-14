---
id: run-game-credits-016
scope: single
work_items:
  - id: header-feedback-movie-labels
    intent: call-sheet-board-redesign
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-14T02:54:46.568Z
completed: 2026-06-14T02:58:22.776Z
---

# Run: run-game-credits-016

## Scope
single (1 work item)

## Work Items
1. **header-feedback-movie-labels** (autopilot) — completed


## Current Item
(all completed)

## Files Created
(none)

## Files Modified
- `src/components/call-sheet-board.js`: Folded per-group progress into column headers; renamed Group→Movie; solved header shows movie title + tick; headers are the aria-live region; removed separate progress line/_renderProgress and its styles
- `tests/component/call-sheet-board.test.js`: Assert Movie labels, header-based n/total counts, title+tick on solve, no count before first submit
- `tests/e2e/play.spec.js`: Group 1 → Movie 1
- `tests/e2e/archive.spec.js`: Group 1 → Movie 1
- `tests/e2e/dark-mode.spec.js`: Target .head surface filtered by Movie 2

## Decisions
(none)


## Summary

- Work items completed: 1
- Files created: 0
- Files modified: 5
- Tests added: 3
- Coverage: 97.3%
- Completed: 2026-06-14T02:58:22.776Z
