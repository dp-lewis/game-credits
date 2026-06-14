---
run: run-game-credits-017
work_item: board-result-reveal
intent: game-over-board-reveal
mode: confirm
checkpoint: plan
approved_at:
---

# Implementation Plan: In-Board Result Reveal

(Wide run — this is item 1 of 2. Item 2, `retire-result-card`, runs autopilot after
this is approved and built; its plan section is appended then.)

## Approach

Make the board reveal the result in place.

- **Win:** every chip gets a tick (a light staggered cascade); titles already show.
- **Loss/partial:** after a ~1s beat, reveal every movie title in the headers and
  **FLIP every misplaced actor into its correct movie column**. Actors the player
  had in the right movie keep a **tick**; the ones that move are left **blank**. The
  board ends as the full, correct solution annotated with what you got right.
- **Static reveal** (`reveal` property): render the solved solution directly — titles
  + cast in correct columns, **no ticks**, no lives/submit — for the already-played
  view (used by item 2).

The tick is **decoupled from `locked`**: today a chip shows ✓ whenever it's locked,
and the board locks every chip at game over, so a loss currently ticks *everything*.
A new `ticked` prop on `call-sheet-actor` drives the ✓; `locked` keeps only the
disabled/non-interactive behaviour.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-actor.js` | Add `ticked` prop; show ✓ when `ticked` (was `locked`); `locked` still disables |
| `src/components/call-sheet-board.js` | Reveal sequencing on game over (win cascade / loss delay→titles→FLIP-all); `reveal` property for static reveal; per-chip `ticked` + per-column titles in reveal; remove the lost-state `_renderSolution` text list; hide submit/lives appropriately; reuse `_flip` for the multi-chip move |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/component/call-sheet-board.test.js` | Win → all chips ticked + titles; loss → correct final columns, ticks only on the player's correct picks, all titles shown; static `reveal` renders the solved board with no ticks |
| `tests/component/call-sheet-actor.test.js` (if present, else board covers it) | `ticked` shows ✓ independent of `locked` |

## Technical Details

**Column → film resolution at reveal** (`_columnFilm[]`): solved columns keep their
`bucketFilm`; each remaining column is assigned its **modal remaining film** (the one
it has most of — matching the n/4 the player just saw), greedily resolving collisions
by descending modal count so it stays a bijection films↔columns.

**Ticks**: an actor is "right" when its film equals the film assigned to its
*pre-reveal* column → `ticked = answerKey[a] === _columnFilm[preRevealCol(a)]`. Win →
all ticked; static `reveal` → none.

**Target columns**: for each column `c`, the actors with `answerKey === _columnFilm[c]`
in stable puzzle order. Set `_columns` to that; reuse the existing keyed-`repeat` +
inline grid placement so chips keep identity and the existing `_flip(before)` (which
already iterates many ids) animates every mover at once.

**Sequencing** (`_revealLoss`): capture all chip rects → optional `await delay(revealDelayMs)`
(default 1000) → set `_revealed`, `_columnFilm`, `_bucketFilm` (all), `_revealTicks`,
`_columns = target` → `await updateComplete` → `_flip(before)`. `_revealWin` sets
`_revealed` + ticks-all + a subtle stagger. Expose the in-flight work as
`this._revealDone` (a promise) and a `revealDelayMs` prop so component tests set
delay 0 and `await board._revealDone`.

**Reduced motion**: `prefers-reduced-motion` → no delay, no FLIP, no cascade — jump
straight to the revealed state.

**Static `reveal` prop**: handled in `willUpdate` — build film-order solution columns,
`_revealed = true`, empty ticks, all titles; render hides lives + submit. Used by the
app's already-played branch (item 2).

**Render changes**: headers show a title when `_revealed || solved`; `_renderCells`
passes `?ticked` per chip; submit rendered only while `playing`; lives hidden in
static reveal; the lost-state `_renderSolution` list is deleted.

## Checkpoint — please confirm

1. **Loss reveal**: ~1s beat → reveal titles → FLIP misplaced actors into their
   correct movie; ticks stay on the player's correct picks, movers go blank.
2. **Unsolved-column film** is its **modal** film (consistent with the n/4 hint),
   greedy collision resolution.
3. **Win** = tick every chip (subtle cascade); **reduced-motion** = instant reveal;
   **static `reveal`** = solved board, no ticks (for the already-played view).

---
*Plan approved at checkpoint. Execution follows.*

---

## Work Item: retire-result-card

### Approach

Remove the separate end-game card now that the board reveals the result. Drop
`<call-sheet-result>` from the app and delete the component + its test. For the
already-played daily restore, render the board's static `reveal` (solved board, no
ticks) plus a brief "already played" line. Keep streak tracking in `progress-store`
(just not displayed). Re-point the win e2e to the on-board reveal.

### Files to Modify

- `src/components/call-sheet-app.js` — remove the result import + render block; drop
  the now-unused `_gameOver`/`_streak` state; render the `_played` branch as a
  static-reveal board + note; keep `_onGameOver` recording results.
- `tests/e2e/play.spec.js` — assert the on-board win reveal (ticked chips / revealed
  titles) instead of the removed "Copy result" / share grid.

### Files to Delete

- `src/components/call-sheet-result.js`
- `tests/component/call-sheet-result.test.js`

### Notes

`src/lib/share-grid.js` + its unit tests are retained (pure, tested, re-addable).
