---
run: run-game-credits-015
work_item: per-group-progress
intent: call-sheet-board-redesign
generated: 2026-06-14T12:42:00Z
mode: autopilot
---

# Implementation Walkthrough: Per-Group Progress Feedback

## Summary

The vague **"One away…"** hint is gone. After each submit, the board now shows
**per-group progress** — how many of each column belong to the same film:

```
Grp1 4/4 ✓ · Grp2 3/4 · Grp3 1/4
```

so you know exactly which group is close, not just that *something* was one away.

## Why

"One away…" told you a near-miss existed somewhere but not where or how close any
other group was. Per-group counts are precise and actionable, and they fit the new
column layout — each number lines up with a column.

## What changed

- **`src/lib/group-logic.js`** — `gradeGroups` now also returns `correctCount` per
  group: the number of members sharing that column's modal (best-matching) film.
  Purely additive — `correct`, `oneAway`, `filmId`, and `allSolved` are unchanged.
- **`src/components/call-sheet-board.js`** — removed `_oneAway`, `_renderHint`, and
  the `.hint` element. Added a `_progress` state set on each submit from
  `correctCount`, rendered as `Grp{n} {count}/{total}` (with `✓` and a green tint
  when solved) inside a `role="status" aria-live="polite"` line. Nothing shows
  before the first submit.
- **Tests** — `group-logic` asserts `correctCount` (solved / partial / under-filled);
  the board test replaces the old "One away…" check with per-group progress
  assertions plus a "no line before first submit" case.

## How it works

- A column's count is its **modal-film count** — the largest number of members that
  share one film. For a solved column that's `groupSize` (`4/4 ✓`); for "3 of one
  film + a crossover trap" it's `3/4`; a 2+2 split is `2/4`.
- `_submit` recomputes `_progress` from the grade every time, so the line always
  reflects the latest arrangement. Solved groups keep showing `n/n ✓`.
- The line is a live region, so screen readers announce the result after each
  submit (complementing the existing selection/swap announcements).

## How to Verify

```bash
npm run dev    # arrange, Submit → the line under the headers shows each group's n/4;
               # solve one → it reads 4/4 ✓ while others show their progress
npm test               # 183 unit/component (incl. correctCount + progress)
npm run test:e2e       # 6 e2e
npm run lint && npm run build
```

## Ready for Review

- [x] Per-group `n/total` shown on submit; solved reads `n/n ✓`
- [x] "One away…" removed entirely
- [x] Announced via `role="status"` / `aria-live`; legible in light + dark
- [x] `gradeGroups` semantics unchanged (additive `correctCount` only)
- [x] 183 unit/component + 6 e2e green; lint clean; build OK

## Intent status

Both work items of **Call Sheet — Board Redesign** are complete:
`column-board-redesign` (run 014) and `per-group-progress` (run 015). The intent is
ready to close.
