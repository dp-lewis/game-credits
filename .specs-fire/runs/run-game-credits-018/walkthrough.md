---
run: run-game-credits-018
work_item: slow-reveal-transition
intent: game-over-board-reveal
generated: 2026-06-14T13:46:00Z
mode: autopilot
---

# Implementation Walkthrough: Slow the Reveal Transition

## Summary

The end-of-game reveal now slides the misplaced actors into their correct movies over
**~1 second** (was 180ms), so the transition reads clearly. The in-play select-then-
swap stays snappy.

## What changed

`src/components/call-sheet-board.js`: the shared FLIP helper `_flip(before)` gained
`duration`/`easing` parameters. `_swap` (in-play) keeps the snappy defaults (180ms,
`ease`); `_revealLoss` (end-game) now passes `REVEAL_MOVE_MS = 1000` with `ease-in-out`
for a slower, smoother settle. `prefers-reduced-motion` still skips the animation
entirely.

## How to Verify

```bash
npm run dev   # lose a game → after the beat, the actors glide into place over ~1s
npm test && npm run test:e2e && npm run lint && npm run build
```

## Ready for Review

- [x] Reveal move ~1s (`ease-in-out`); in-play swap unchanged (~180ms)
- [x] Reduced-motion still instant
- [x] 182 unit/component + 6 e2e green; lint clean; build OK

## Intent status

`game-over-board-reveal` now has three completed work items (`board-result-reveal`,
`retire-result-card`, `slow-reveal-transition`). Ready to close + ship.
