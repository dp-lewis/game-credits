---
run: run-game-credits-014
work_item: column-board-redesign
intent: call-sheet-board-redesign
generated: 2026-06-14T12:04:00Z
mode: confirm
---

# Implementation Walkthrough: Column Board Redesign

## Summary

The board is now an **N-column grid** (3 columns for the live 3-film puzzle), one
column per hidden film, and it's **always full** — the cast starts shuffled,
`groupSize` per column. You rearrange by **select-then-swap**: tap an actor to
select it, tap another cell to swap the two, tap the selected one again to
deselect. Swaps animate with a **FLIP** transition. Submitting still grades each
column by membership and locks correct ones, revealing the film in the column
header.

## Why

The brush board (group buttons + a pool you tapped into) was functional but less
tactile, and tapping a group then its actors was an extra mode to think about.
A full grid you physically rearrange — and an animated swap — reads as more
direct. (You approved this design at the plan checkpoint.)

## What changed

- **`call-sheet-board.js`** — rewritten around `_columns` (an array of columns of
  actor ids; column index = group). `_onPick` runs select-then-swap; `_swap`
  exchanges two actors' slots and runs FLIP; `_submit` grades `_columns` directly
  with `gradeGroups` (**unchanged**). Headers reveal the film title when a column
  is solved; solved columns lock in place.
- **`call-sheet-actor.js`** — added a `selected` state (a clear ring +
  `aria-pressed`); chips always show their column colour.
- **Tests** — component test rewritten for the column model with new
  select-then-swap / deselect / locked-immovable cases; `play.spec.js` now solves
  the puzzle through swaps; `dark-mode`/`archive` selectors updated.

## How it works

- **Always full:** `willUpdate` shuffles the cast and slices it evenly into the
  columns, so every cell is occupied and Submit is enabled while playing.
- **Select-then-swap:** first tap selects (ring); second tap on another unlocked
  cell swaps the two; tapping the selected one clears it. Locked (solved-column)
  actors can't be selected or used as a swap target.
- **FLIP animation:** all 12 chips render from one stable, keyed `repeat`, each
  positioned with inline `grid-column`/`grid-row`. A swap only changes two chips'
  placement, so they keep DOM identity. `_swap` measures their rects before,
  mutates, awaits the re-render, then `element.animate()`s each from its old→new
  delta back to rest. `prefers-reduced-motion` skips the motion (instant).
- **Accessibility:** chips are native `<button>`s, so keyboard select-then-swap
  works for free; an `aria-live` status line announces selection and swaps and
  names the actor's group.
- **Grading unchanged:** `gradeGroups` is fed the columns as-is; correct columns
  lock and reveal their film; wrong/partial costs a life; "One away…" still shows
  (the next work item, `per-group-progress`, replaces it); win/lose and the
  `game-over` event are untouched, so the result/share layer needed no changes.

## How to Verify

```bash
npm run dev    # rearrange actors into columns by tap-to-select then tap-to-swap;
               # solve a column → it locks and the film title appears in its header
npm test               # 180 unit/component
npm run test:e2e       # 6 e2e — includes a full solve via select-then-swap
npm run lint && npm run build
```

Try it with reduced motion on (OS setting) — swaps become instant. Keyboard:
Tab to a chip, Enter to select, Tab to another, Enter to swap.

## Ready for Review

- [x] N-column always-full grid; columns = groups, labelled headers
- [x] Select-then-swap with animated FLIP (Web Animations API, no dependency)
- [x] `prefers-reduced-motion` honoured; keyboard-operable; `aria-live` announces
- [x] Solved columns lock and reveal the film; locked actors immovable
- [x] `gradeGroups` reused unchanged; win/lose/share unaffected
- [x] 180 unit/component + 6 e2e green; lint clean; build OK; coverage 97.3%

## Next

`per-group-progress` (medium, autopilot) — replace "One away…" with per-group
`n/4` correct feedback on submit. Depends on this item (now complete).
