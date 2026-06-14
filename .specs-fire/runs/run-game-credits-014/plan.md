---
run: run-game-credits-014
work_item: column-board-redesign
intent: call-sheet-board-redesign
mode: confirm
checkpoint: plan
approved_at:
---

# Implementation Plan: Column Board Redesign

## Approach

Replace the brush board (group buttons + a pool grid) with an **N-column grid**
(one column per group — 3 for the live 3-film puzzle, generic so the 4-film
fixture still works). The grid is **always full**: the 12 actors start shuffled,
`groupSize` per column. A column *is* a group, so arranging actors into columns is
the assignment.

**Interaction — select-then-swap:** tap an actor → it's selected (ring +
`aria-pressed`); tap another cell → the two **swap** positions; tap the selected
one again → deselect. Every cell always holds an actor, so there's no empty-slot
ambiguity. Locked (solved) actors can't be selected or be a swap target.

**Animation — FLIP via the Web Animations API:** the two swapped chips keep DOM
identity across re-render (Lit `repeat` keyed by actor id), so on a swap I measure
both chips' rects *before*, mutate state, `await updateComplete`, then
`element.animate()` each from its old→new delta back to rest. `prefers-reduced-motion`
→ no animation (instant). No animation dependency.

**Grading is unchanged:** submit grades the columns with `gradeGroups` (membership-
based, order-independent). A correct column locks, reveals its film in the column
header, and its chips lock; a wrong/partial submit costs a life; "One away…" stays
for now (the next work item, `per-group-progress`, replaces it). Win/lose/`game-over`
event are unchanged, so the result/share layer needs no changes.

**Keyboard a11y:** chips are already `<button>`s — focusable, Enter/Space activates
the same pick path, so select-then-swap works from the keyboard for free. Selection
is announced via an `aria-live` status line; columns are labelled regions.

## Files to Create

| File | Purpose |
|------|---------|
| (none) | Reuses existing components and tests |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | Replace bucket/pool model with N-column grid; `_columns` state (array of columns of actor ids); select-then-swap (`_selected`, `_onPick` → swap); FLIP animation helper honoring reduced-motion; column headers (label + revealed film when solved); submit always enabled while playing; grade columns via `gradeGroups` unchanged; `aria-live` selection status |
| `src/components/call-sheet-actor.js` | Add `selected` boolean prop (ring + `aria-pressed` from `selected`); chips always carry their column colour; keep `locked`/`actor-pick`/`bucketIndex`→column colour |
| `tests/component/call-sheet-board.test.js` | Rewrite for column model: deterministic `setColumns` helper; submit-always-enabled, win (any column order), game-over, lock+reveal, lose; new select-then-swap + deselect + locked-can't-move tests |
| `tests/e2e/play.spec.js` | Rewrite to solve via swaps: read current column placement, selection-sort into correct columns by clicking pairs, submit → win; assert column headers + 12 chips |
| `tests/e2e/dark-mode.spec.js` | Target column header + Submit (and/or an actor chip surface) instead of the removed "Group N" buttons; same dark-surface assertions |
| `tests/e2e/grid-layout.spec.js` | Keep the 12-equal-height-chips regression; adjust only if the column layout changes the selector |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/component/call-sheet-board.test.js` | Column layout, select-then-swap, deselect, locked immovable, submit/win/lose/lock-reveal |
| `tests/e2e/play.spec.js` | Full solve through swaps to a win (deterministic, shuffle-independent) |
| `tests/e2e/dark-mode.spec.js` | Dark-mode legibility of new surfaces |
| `tests/e2e/grid-layout.spec.js` | 12 chips equal height |

## Technical Details

**State model** (`call-sheet-board.js`):
- `_columns`: `string[][]` — `_numGroups` columns, each `_groupSize` actor ids, in
  display order. Group index = column index. Built in `willUpdate` from
  `shuffle(actors)` split into equal slices.
- `_selected`: `actorId | null`.
- `_solved` / `_bucketFilm` / `_lives` / `_status`: unchanged semantics.
- Assignment `actorId → group` is *derived* from which column holds it; `gradeGroups`
  is fed `_columns` directly (skipping solved-but-still-present columns is unneeded —
  solved columns stay put and re-grade as correct).

**Swap** (`_onPick(actorId)`):
1. ignore if not playing or actor locked.
2. no selection → select it.
3. tapped the selected one → deselect.
4. else → swap the two ids in `_columns` (exchange their col/row slots), clear
   selection, run FLIP on the two moved chips.

**FLIP helper**: `_animateSwap(idA, idB)` — before mutating, capture
`getBoundingClientRect()` of both `call-sheet-actor` hosts (query shadowRoot by
actor id); after `await this.updateComplete`, for each compute `dx/dy = oldRect -
newRect` and `host.animate([{transform:'translate(dx,dy)'},{transform:'none'}],
{duration:180, easing:'ease'})`. Guard with
`matchMedia('(prefers-reduced-motion: reduce)').matches` → skip.

**Rendering**: `_numGroups` column elements, each a labelled region (`role="group"`,
`aria-label="Group n"` or revealed film) with a header and a `repeat`-keyed list of
its chips. CSS: outer `display:grid; grid-template-columns: repeat(_numGroups,1fr)`;
each column an inner grid with `grid-auto-rows:1fr` so wrapped names keep equal
heights (preserves the grid-wrap fix). Solved column header shows the film title;
its chips render `locked`.

**Checkpoint focus** (please confirm): (1) FLIP via Web Animations API on the two
swapped chips; (2) reduced-motion = instant, keyboard = native button activation +
`aria-live` selection announce; (3) solved columns lock in place and their chips are
not selectable/swappable while unsolved columns keep swapping.

---
*Plan approved at checkpoint. Execution follows.*
