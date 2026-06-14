---
run: run-game-credits-015
work_item: per-group-progress
intent: call-sheet-board-redesign
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Per-Group Progress Feedback

## Approach

Replace the vague **"One away…"** hint with **per-group progress** on submit:
`Grp1 4/4 ✓ · Grp2 3/4 · Grp3 1/4`. The count per group is the number of its
members that belong to the same film — i.e. the modal-film count `gradeGroups`
already computes internally. Surface that as `correctCount` on each group result,
then render a live status line per submit. Solved groups read `n/n ✓`.

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/group-logic.js` | Add `correctCount` (= modal-film count) to each group result; document it. `oneAway` stays for back-compat |
| `src/components/call-sheet-board.js` | Drop `_oneAway`/"One away…"; add `_progress` set on submit from `correctCount`; render a per-group `n/total` status line (`role="status"`, `aria-live`), `✓` on solved |
| `tests/unit/group-logic.test.js` | Assert `correctCount` (solved=groupSize, near-miss=groupSize-1, split cases) |
| `tests/component/call-sheet-board.test.js` | Replace the "One away…" test with per-group progress assertions (all-correct, partial, zero) |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/group-logic.test.js` | `correctCount` across solved / near-miss / split buckets |
| `tests/component/call-sheet-board.test.js` | Progress line shows correct `n/total` per group after submit |

## Technical Details

- `group-logic.js`: in the existing reduce, `modalCount` is already tracked; return
  `correctCount: modalCount`. For an empty bucket `correctCount` is 0. No grading
  semantics change (`correct`/`oneAway`/`filmId`/`allSolved` unchanged).
- `call-sheet-board.js`: add `_progress` (array of `{count,total,solved}` | null),
  reset to null in `willUpdate`. In `_submit`, after computing `solved`, set
  `_progress = grade.groups.map((g,c) => ({count: g.correctCount, total: groupSize,
  solved: solved.has(c)}))`. Remove `_oneAway` state, the `oneAway` set in
  `_submit`, and `_renderHint`; add `_renderProgress()` rendering
  `Grp{i+1} {count}/{total}` (with `✓` when solved), separated by ` · `. Keep the
  line in a fixed-min-height `role="status"` `aria-live="polite"` element so layout
  is stable and the update is announced. Shows nothing before the first submit.

---
*Autopilot mode — plan recorded; no checkpoint.*
