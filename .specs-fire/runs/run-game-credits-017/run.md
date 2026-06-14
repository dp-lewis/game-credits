---
id: run-game-credits-017
scope: wide
work_items:
  - id: board-result-reveal
    intent: game-over-board-reveal
    mode: confirm
    status: completed
    current_phase: review
    checkpoint_state: approved
    current_checkpoint: plan
  - id: retire-result-card
    intent: game-over-board-reveal
    mode: autopilot
    status: completed
    current_phase: review
    checkpoint_state: none
    current_checkpoint: null
current_item: null
status: completed
started: 2026-06-14T03:27:02.290Z
completed: 2026-06-14T03:40:31.318Z
---

# Run: run-game-credits-017

## Scope
wide (2 work items)

## Work Items
1. **board-result-reveal** (confirm) — completed
2. **retire-result-card** (autopilot) — completed


## Current Item
(all completed)

## Files Created
(none)

## Files Modified
- `src/components/call-sheet-actor.js`: Added ticked prop driving ✓ (decoupled from locked)
- `src/components/call-sheet-board.js`: In-board game-over reveal: win ticks all + cascade; loss delay→reveal titles→FLIP misplaced actors into correct movies, ticking player-correct picks; static reveal prop; removed old solution list; hide submit/lives appropriately
- `src/components/call-sheet-app.js`: Removed call-sheet-result; already-played restore renders static-reveal board + note; kept streak recording; dropped unused _gameOver/_streak state
- `tests/component/call-sheet-board.test.js`: Added game-over reveal tests (win/loss/static); revealDelayMs=0 helper
- `tests/e2e/play.spec.js`: Assert on-board win reveal (banner + 12 ticks, no Submit/Copy result)

## Decisions
(none)


## Summary

- Work items completed: 2
- Files created: 0
- Files modified: 5
- Tests added: 8
- Coverage: 97.3%
- Completed: 2026-06-14T03:40:31.318Z
