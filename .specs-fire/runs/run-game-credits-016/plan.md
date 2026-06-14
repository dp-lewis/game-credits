---
run: run-game-credits-016
work_item: header-feedback-movie-labels
intent: call-sheet-board-redesign
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Header Feedback and Movie Labels

## Approach

Fold the per-group progress into the column headers, rename "Group" → "Movie", and
turn a solved header into the movie title with a tick. Removes the separate
progress line so feedback sits tightly with each column.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | Headers render `Movie n` + a `n/total` sub-line (when `_progress` set); solved → title + `✓`. Remove the `.progress` `<p>` and `_renderProgress`; make `.headers` the `aria-live` region. Add header count/tick styles |
| `tests/component/call-sheet-board.test.js` | Read progress from headers (not the removed `.progress`); assert "Movie" labels, `n/total`, and title + ✓ on solve |
| `tests/e2e/play.spec.js` | "Group 1" → "Movie 1" |
| `tests/e2e/archive.spec.js` | "Group 1" → "Movie 1" |
| `tests/e2e/dark-mode.spec.js` | "Group 2" → "Movie 2" |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/component/call-sheet-board.test.js` | Movie labels; header count after submit; title + ✓ on solve; no count before first submit |
| e2e specs | Updated label text |

## Technical Details

- `_renderHeaders(c)`: `solved` → `<span class="title">{title}</span><span
  class="tick">✓</span>`; else `<span class="label">Movie {c+1}</span>` and, when
  `this._progress`, `<span class="count">{count}/{total}</span>`.
- Wrap `.headers` with `role="status" aria-live="polite"` so the per-group result is
  announced on submit. Keep the existing `.a11y-status` line for selection/swap.
- `_progress` state and its `_submit` wiring are unchanged. Delete `_renderProgress`
  and the `.progress` element + styles; add `.head .count` (smaller, muted) and
  `.head .tick` styles.

---
*Autopilot mode — plan recorded; no checkpoint.*
