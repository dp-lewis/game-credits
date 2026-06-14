---
id: board-result-reveal
title: In-Board Result Reveal
intent: game-over-board-reveal
complexity: high
mode: confirm
status: completed
depends_on: []
created: 2026-06-14T03:10:00Z
run_id: run-game-credits-017
completed_at: 2026-06-14T03:37:05.152Z
---

# Work Item: In-Board Result Reveal

## Description

Make the board reveal the result when the game ends. **Win:** reveal every movie
title and tick every chip (a small celebratory cascade). **Loss/partial:** after a
~1s beat, reveal every movie title in the headers and **animate the misplaced
actors into their correct movie columns** (FLIP), ticking the actors the player had
right and leaving the movers blank. The board ends showing the full solution. Also
expose a **static reveal** entry point so the already-played view can show the
solved board without replaying. Marked `confirm` so the reveal sequencing /
animation is checkpointed before build.

## Acceptance Criteria

- [ ] On a **win**, all movie titles show in the headers and every chip shows a tick
      (cascade acceptable); board is locked
- [ ] On a **loss/partial**, the reveal: (1) ~1s delay, (2) headers reveal all movie
      titles, (3) misplaced actors animate into their correct movie columns via FLIP
- [ ] After the loss reveal, every actor sits in its correct movie; actors the player
      had placed correctly show a **tick**, the moved ones are **blank**
- [ ] The board's old text answer list (lost-state `_renderSolution`) is removed —
      the reveal replaces it
- [ ] `prefers-reduced-motion` → no delay/animation; jump straight to the fully
      revealed state (titles + final positions + ticks)
- [ ] A **static reveal** mode (e.g. a `reveal` property) renders the solved board
      directly — titles + cast in correct columns, no per-actor ticks — for reuse by
      the already-played view
- [ ] Board is non-interactive once revealing/revealed
- [ ] Component tests: win → all ticked + titles; loss → correct final columns, ticks
      only on the player's correct picks, titles shown; static `reveal` renders solved

## Technical Notes

`src/components/call-sheet-board.js` + `call-sheet-actor.js`. Drive the reveal from
`_submit` when the game ends (win or lives exhausted) and from a `reveal` prop for
the static case. Compute each actor's correct column from the answer key
(`buildAnswerKey`/`gradeGroups`); "player-correct" = the actor's final column equals
its correct column. Build the target `_columns` = the solution, then reuse the FLIP
helper to animate *all* moved chips at once (measure rects before, set `_columns`,
await update, animate movers) — the existing single-swap FLIP generalises since
chips render from one stable keyed list with grid placement. Reveal titles by
treating all columns as solved for header rendering. Add a per-actor "ticked" signal
to `call-sheet-actor` (reuse/extend the existing solved `✓`): show ticks on
player-correct actors in reveal; none in the static restore reveal. Sequence the
loss reveal with the component's update cycle (delay → titles → move); honour
reduced-motion by skipping the delay and animations. Keep a concise win/lose banner
on the board if helpful, but the reveal is the main signal.

## Dependencies

(none)
