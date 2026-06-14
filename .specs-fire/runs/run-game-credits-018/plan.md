---
run: run-game-credits-018
work_item: slow-reveal-transition
intent: game-over-board-reveal
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Slow the Reveal Transition

## Approach

Parameterise the FLIP duration so the loss reveal's move takes ~1s while the in-play
swap stays snappy.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | `_flip(before, duration = 180, easing = 'ease')`; `_swap` keeps the default, `_revealLoss` passes ~1000ms with `ease-in-out`. Add a `REVEAL_MOVE_MS` constant for clarity |

## Tests

No new assertions — duration is timing-only (`animate` is a no-op in happy-dom). Full
unit/component + e2e re-run to confirm nothing regresses.

## Technical Details

`_flip` currently hardcodes `{ duration: 180, easing: 'ease' }` and is shared by
`_swap` and `_revealLoss`. Give it `duration`/`easing` params; `_revealLoss` calls
`this._flip(before, REVEAL_MOVE_MS, 'ease-in-out')` with `REVEAL_MOVE_MS = 1000`.
Reduced-motion path is unchanged (no FLIP).

---
*Autopilot mode — plan recorded; no checkpoint.*
