---
id: run-game-credits-014
scope: single
work_items:
  - id: column-board-redesign
    intent: call-sheet-board-redesign
    mode: confirm
    status: completed
    current_phase: review
    checkpoint_state: approved
    current_checkpoint: plan
current_item: null
status: completed
started: 2026-06-13T22:08:44.953Z
completed: 2026-06-14T02:03:22.498Z
---

# Run: run-game-credits-014

## Scope
single (1 work item)

## Work Items
1. **column-board-redesign** (confirm) — completed


## Current Item
(all completed)

## Files Created
(none)

## Files Modified
- `src/components/call-sheet-board.js`: Rewrote as N-column always-full grid; select-then-swap with FLIP (Web Animations API) + reduced-motion guard; column headers reveal films on solve; aria-live selection announce; grades columns via gradeGroups unchanged
- `src/components/call-sheet-actor.js`: Added selected prop (ring + aria-pressed); chips always carry their column colour
- `tests/component/call-sheet-board.test.js`: Rewrote for column model; added select-then-swap, deselect, locked-immovable tests
- `tests/e2e/play.spec.js`: Solve via select-then-swap, reading live placement and selection-sorting into columns (shuffle-independent)
- `tests/e2e/dark-mode.spec.js`: Target column header text + Submit instead of removed Group buttons
- `tests/e2e/archive.spec.js`: Updated Group 1 assertion to column-header text

## Decisions
(none)


## Summary

- Work items completed: 1
- Files created: 0
- Files modified: 6
- Tests added: 9
- Coverage: 97.3%
- Completed: 2026-06-14T02:03:22.498Z
