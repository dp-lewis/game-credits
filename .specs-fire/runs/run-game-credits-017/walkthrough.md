---
run: run-game-credits-017
work_items: board-result-reveal, retire-result-card
intent: game-over-board-reveal
generated: 2026-06-14T13:41:00Z
mode: wide (confirm + autopilot)
---

# Implementation Walkthrough: Game-Over Board Reveal

## Summary

The board now reveals the result in place — the separate result/share card is gone.

- **Win** → every chip gets a tick (a light cascade) and a "Solved! You found every
  movie 🎬" banner.
- **Loss / partial** → after a ~1s beat, every movie title is revealed in the headers
  and the misplaced actors **slide into their correct movie columns** (FLIP). Actors
  you'd placed in the right movie keep a **tick**; the ones that move are left blank —
  so the final board is the full solution, annotated with what you got right.

## Why

The end-game used to live in a card below the board (a banner, a plain answer list on
a loss, and a share grid). Moving the reveal onto the board itself makes the payoff
land where you were just working, and the per-chip ticks show exactly which picks were
right — which a text readout couldn't.

## What changed

**`call-sheet-actor.js`** — new `ticked` prop drives the ✓, decoupled from `locked`.
(Previously a chip showed ✓ whenever locked, and the board locks everything at game
over — so a loss used to tick *every* chip. Now ticks mean "you got this one right.")

**`call-sheet-board.js`**
- `_revealWin()` — tick all chips, reveal titles, subtle staggered pop.
- `_revealLoss()` — pause (`revealDelayMs`, default 1000), resolve each column's movie,
  compute the player-correct ticks, set the solution columns, and reuse the existing
  `_flip` to animate every mover at once.
- `_resolveColumnFilms()` — solved columns keep their film; each remaining column takes
  its **modal** remaining film (matching the n/4 hint), greedy tiebreak → a clean
  films↔columns bijection.
- `reveal` property — renders the solved board directly (titles + cast in place, no
  ticks, no submit/lives) for the already-played view.
- `prefers-reduced-motion` → no delay/animation; jump to the revealed state. Removed
  the old lost-state text answer list.

**`call-sheet-app.js`** — removed `<call-sheet-result>`; the already-played daily
restore now renders `<call-sheet-board .reveal>` + a short "already played" note.
Streak is still recorded on game over (just not displayed); unused `_gameOver`/`_streak`
state dropped.

**Deleted**: `call-sheet-result.js` + its test. **Retained**: `share-grid.js` + its
unit tests (pure, unused by the UI now, re-addable).

## How to Verify

```bash
npm run dev
#   Win  → solve all three: every chip ticks, "Solved!" banner, no card below.
#   Loss → run out of lives: ~1s pause, titles appear, misplaced actors animate into
#          their movies; your correct picks keep a ✓, the movers are blank.
#   Reload a finished daily → the solved board is shown (no ticks) + "already played".
npm test               # 182 unit/component (incl. win/loss/static reveal)
npm run test:e2e       # 6 e2e — play.spec asserts the on-board win reveal
npm run lint && npm run build
```

Try it with reduced motion on (OS setting): the reveal is instant.

## Ready for Review

- [x] Win ticks every chip; loss animates misplaced actors into correct movies
- [x] Ticks mark only the player's correct picks (decoupled from `locked`)
- [x] Result/share card removed; restore uses the board's static reveal
- [x] Streak still tracked; `prefers-reduced-motion` honoured
- [x] 182 unit/component + 6 e2e green; lint clean; build OK; coverage 97.3%

## Intent status

Both work items of **Game-Over Board Reveal** are complete (`board-result-reveal`,
`retire-result-card`). Ready to close via the Orchestrator, then commit + push to
deploy.
