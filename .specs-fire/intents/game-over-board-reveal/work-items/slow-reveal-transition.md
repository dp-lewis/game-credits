---
id: slow-reveal-transition
title: Slow the Reveal Transition
intent: game-over-board-reveal
complexity: low
mode: autopilot
status: completed
depends_on:
  - board-result-reveal
created: 2026-06-14T03:45:00Z
run_id: run-game-credits-018
completed_at: 2026-06-14T03:45:09.009Z
---

# Work Item: Slow the Reveal Transition

## Description

The end-of-game reveal moves the misplaced actors into their correct movies too
quickly. Slow **that move** to ~1 second so the transition reads clearly. Keep the
in-play select-then-swap animation snappy (unchanged) — only the loss reveal move is
slowed.

## Acceptance Criteria

- [ ] The loss reveal's move animation lasts ~1000ms (was 180ms)
- [ ] The in-play swap animation is unchanged (still ~180ms)
- [ ] `prefers-reduced-motion` still jumps straight to the revealed state (no motion)
- [ ] Full suite + e2e remain green

## Technical Notes

`src/components/call-sheet-board.js`. `_flip(before)` is shared by `_swap` (play) and
`_revealLoss` (reveal); parameterise it (e.g. `_flip(before, duration = 180)`) and
pass ~1000 (with a gentle `ease-in-out`) from `_revealLoss`, leaving the swap call at
the default. Optionally expose the reveal duration as a constant/field for clarity.
No test assertions depend on the duration (happy-dom no-ops `animate`), so this is a
timing-only change.

## Dependencies

- board-result-reveal
