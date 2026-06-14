---
run: run-game-credits-016
work_item: header-feedback-movie-labels
intent: call-sheet-board-redesign
generated: 2026-06-14T12:59:00Z
mode: autopilot
---

# Implementation Walkthrough: Header Feedback and Movie Labels

## Summary

The per-group feedback now lives **inside each column header**, the columns are
labelled **"Movie 1/2/3"** (was "Group"), and a solved column's header turns into
the **movie title with a tick (✓)**.

- Before any submit: `Movie 1` · `Movie 2` · `Movie 3`
- After a submit: each unsolved header gains its count, e.g. `Movie 2 — 3/4`
- On solving a column: `Inception ✓`

## Why

You asked to tie the feedback to its column rather than a separate line, to call
them movies (which is what they are), and to make a solved column read as the film
it turned out to be. Co-locating the count with the header makes "which movie is
close" obvious at a glance.

## What changed

- **`src/components/call-sheet-board.js`**
  - `_renderHeaders` now renders, per column: solved → `title` + `✓`; unsolved →
    `Movie n` and, once `_progress` is set, a `n/total` count beneath it.
  - The separate `.progress` line and `_renderProgress` are gone; the `.headers`
    row is now the `role="status" aria-live="polite"` region, so the per-group
    result is announced on submit.
  - Header layout stacks label over count; added `.count`/`.tick` styles.
  - The selection announcement now says "from Movie n" to match the labels.
- **Tests** — component test asserts Movie labels, header-based counts, and the
  title + tick on solve; e2e label selectors updated to "Movie n" (dark-mode now
  targets the `.head` surface so it still measures the header background).

## How it works

`_progress` (set on each submit from `gradeGroups`' `correctCount`) is read directly
in the header render: `this._progress?.[c]`. No count shows until the first submit.
Grading and the rest of the board are unchanged — this is presentation only.

## How to Verify

```bash
npm run dev    # headers read "Movie 1/2/3"; Submit → each shows n/4; solve one →
               # its header becomes the film title with a ✓
npm test               # 183 unit/component
npm run test:e2e       # 6 e2e
npm run lint && npm run build
```

## Ready for Review

- [x] Count folded into the headers; separate line removed
- [x] "Group" → "Movie"; solved header shows title + ✓
- [x] Headers are an `aria-live` region; dark/light legible
- [x] 183 unit/component + 6 e2e green; lint clean; build OK

## Intent status

`call-sheet-board-redesign` now has three completed work items
(`column-board-redesign`, `per-group-progress`, `header-feedback-movie-labels`).
Ready to close via the Orchestrator, then commit + push to deploy.
