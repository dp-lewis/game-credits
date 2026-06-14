---
id: run-game-credits-015
scope: single
work_items:
  - id: per-group-progress
    intent: call-sheet-board-redesign
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-14T02:36:54.058Z
completed: 2026-06-14T02:40:46.000Z
---

# Run: run-game-credits-015

## Scope
single (1 work item)

## Work Items
1. **per-group-progress** (autopilot) — completed


## Current Item
(all completed)

## Files Created
(none)

## Files Modified
- `src/lib/group-logic.js`: Added additive correctCount (modal-film count) to each group result
- `src/components/call-sheet-board.js`: Replaced One away hint with per-group progress: _progress state set on submit from correctCount; rendered as Grp n n/total (with ✓ when solved) in a role=status aria-live line; removed _oneAway/_renderHint
- `tests/unit/group-logic.test.js`: Assert correctCount across solved/partial/under-filled buckets
- `tests/component/call-sheet-board.test.js`: Replaced One away test with per-group progress assertions; added no-line-before-first-submit case

## Decisions
(none)


## Summary

- Work items completed: 1
- Files created: 0
- Files modified: 4
- Tests added: 4
- Coverage: 97.3%
- Completed: 2026-06-14T02:40:46.000Z
