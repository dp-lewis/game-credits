---
id: header-feedback-movie-labels
title: Header Feedback and Movie Labels
intent: call-sheet-board-redesign
complexity: low
mode: autopilot
status: completed
depends_on:
  - per-group-progress
created: 2026-06-14T12:50:00Z
run_id: run-game-credits-016
completed_at: 2026-06-14T02:58:22.776Z
---

# Work Item: Header Feedback and Movie Labels

## Description

Tighten the board feedback by folding the per-group progress **into the column
headers** (where the "Group 1/2/3" text lives) so the count sits with its column.
Rename **"Group" → "Movie"** (Movie 1/2/3). When a column is solved, the header
**becomes the movie title with a tick** (✓).

## Acceptance Criteria

- [ ] The separate progress line under the headers is removed; the per-group
      `n/total` count renders **inside each column header**
- [ ] Unsolved headers read **"Movie n"** (renamed from "Group n"); after a submit
      they also show that column's `n/total`
- [ ] Before the first submit, headers show just "Movie n" (no count yet)
- [ ] A solved header shows the **movie title + a tick (✓)**
- [ ] The header row is a live region (`role="status"`/`aria-live`) so the per-group
      result is announced on submit; legible in light + dark
- [ ] Component + e2e tests updated for "Movie" labels and header-based progress

## Technical Notes

`src/components/call-sheet-board.js`. Move `_progress[c]` into `_renderHeaders`:
unsolved → `Movie ${c+1}` plus a `${count}/${total}` sub-line when `_progress` is
set; solved → film title + `✓`. Remove the `.progress` `<p>` and `_renderProgress`;
make `.headers` the `aria-live` region. `_progress` state and its `_submit` wiring
stay. Update the e2e selectors that match "Group n" text (`play.spec.js`,
`archive.spec.js`, `dark-mode.spec.js`) to "Movie n", and the component test that
reads the old `.progress` element to read the headers instead.

## Dependencies

- per-group-progress
