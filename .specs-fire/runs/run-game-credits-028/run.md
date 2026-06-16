---
id: run-game-credits-028
scope: wide
work_items:
  - id: rename-submit-check-answer
    intent: board-visual-tweaks
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
  - id: lives-below-grid
    intent: board-visual-tweaks
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
  - id: taller-actor-tiles
    intent: board-visual-tweaks
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-16T09:30:00Z
completed: 2026-06-16T09:46:09Z
---

# Run: run-game-credits-028

## Scope
wide (3 work items)

## Work Items
1. **rename-submit-check-answer** (autopilot) — completed
2. **lives-below-grid** (autopilot) — completed
3. **taller-actor-tiles** (autopilot) — completed

## Files Created
(none)

## Files Modified
- `src/components/call-sheet-board.js`: action-button label "Submit" → "Check Answer";
  `render()` order changed so lives render below the cells grid (above the button)
- `src/components/call-sheet-actor.js`: chip `min-height` `3rem` → `5rem`
- `tests/e2e/play.spec.js`, `tests/e2e/dark-mode.spec.js`, `tests/e2e/archive.spec.js`:
  button accessible-name selector `'Submit'` → `'Check Answer'`

## Decisions
- Back-fill run: the changes were synced from the Figma design file
  *Call Sheet — Game UI* and verified before the intent/work-items were recorded.
- Lives kept behind the existing `_status === 'revealed'` guard (static reveal still
  hides them); only the render position moved.
- Button retained its `.submit` class, so component tests (class selector) were
  unaffected; only e2e accessible-name selectors changed.

## Summary

- Work items completed: 3
- Files created: 0
- Files modified: 5
- Tests added: 0 (3 e2e selector strings updated)
- Coverage: 97.55%
- Completed: 2026-06-16T09:46:09Z
