---
id: per-group-progress
title: Per-Group Progress Feedback
intent: call-sheet-board-redesign
complexity: medium
mode: autopilot
status: completed
depends_on:
  - column-board-redesign
created: 2026-06-13T22:01:01Z
run_id: run-game-credits-015
completed_at: 2026-06-14T02:40:46.000Z
---

# Work Item: Per-Group Progress Feedback

## Description

Replace the vague **"One away…"** hint with **per-group progress** shown on submit.
Each group reports how many of its four are correct (e.g.
`Grp1 4/4 ✓ · Grp2 3/4 · Grp3 1/4`), so the player knows exactly which column is
close rather than a single ambiguous nudge. Solved groups stay marked `✓`.

## Acceptance Criteria

- [ ] On submit, each group shows its correct count out of four (`n/4`), derived from `gradeGroups`
- [ ] A fully-correct group is marked solved (`✓`) and reads `4/4`
- [ ] The old single "One away…" line is removed entirely
- [ ] Feedback updates on every submit and reflects the current column arrangement
- [ ] Readable in light and dark mode; meets contrast (carries over the fixes intent's palette)
- [ ] Accessible: the progress line is announced (e.g. `aria-live`/`role="status"`) so it isn't silent for screen readers
- [ ] Component tests cover the per-group counts (all-correct, partial, zero) replacing the `oneAway` assertions

## Technical Notes

`gradeGroups` already returns per-group `correct` plus the modal/most-common
membership it used for grading — surface a per-group **correct count** rather than
the boolean `oneAway`. If `group-logic.js` doesn't already expose the count, add it
to each group's result (`correctCount`) without changing the grading semantics;
`oneAway` can remain for back-compat or be dropped once the board no longer reads
it. Render the counts in `call-sheet-board.js` where the "One away…" hint lived.
Depends on the column board so the labels/columns line up with the new layout.

## Dependencies

- column-board-redesign
