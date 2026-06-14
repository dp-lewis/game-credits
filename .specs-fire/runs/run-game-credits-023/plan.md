---
run: run-game-credits-023
work_item: lock-completed-replays
intent: pastel-layout-refresh
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Lock Completed Replays

## Approach

Make any puzzle with a stored result load the locked/revealed board, regardless of
whether it's the daily or a `?puzzle=` replay. Unplayed puzzles stay playable.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | `_load`: drop the `!this._isReplay` guard so `getDay(id)` drives `_played` for any path; gate the practice note with `&& !this._played`; make the already-played message conditional (daily vs replay wording) |
| `tests/e2e/play.spec.js` | After winning `?puzzle=2026-06-14`, a reload now shows the **locked/revealed** board ("already completed", no Submit), not a fresh board |

## Tests

`npm run check`. `archive.spec.js` (`?puzzle=2026-06-15`, unplayed) stays a fresh
practice board — Playwright starts with empty storage, so no change there.

## Technical Details

In `_load`, replace the `if (!this._isReplay) { ... }` block with an unconditional
`const prior = this._store.getDay(this._puzzle.id); if (prior) this._played = true;`.
`_isReplay` stays for streak gating in `_onGameOver` and the practice note. In
`render()`: practice note condition → `this._isReplay && this._puzzle && !this._played`;
the `_played` message → `this._isReplay ? "You've already completed this puzzle." :
"You've already played today's puzzle. Come back tomorrow for a new one."`. The
post-win reload in `play.spec.js` flips from "fresh board / no already-played" to
"already-completed + no Submit (revealed board)".

---
*Autopilot mode — plan recorded; no checkpoint.*
