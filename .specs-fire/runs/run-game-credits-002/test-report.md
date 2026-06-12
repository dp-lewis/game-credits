---
run: run-game-credits-002
scope: wide
intent: call-sheet
generated: 2026-06-12T08:39:00Z
status: in_progress
---

# Test Report: Finish the MVP (run-game-credits-002)

Per-item sections are appended as each item completes.

---

## Work Item: puzzle-schema-and-loader

### Test Results

- Unit (Vitest): **22 passed**, 0 failed, 0 skipped (run total 24 incl. scaffold)
- Lint: clean · Format: clean

### Acceptance Criteria Validation

- ✅ **Documented puzzle JSON schema exists** — `docs/puzzle-schema.md` + JSDoc typedefs in `src/lib/puzzle-schema.js` (films[2], actors[] with answer `filmId`, `maxMistakes`)
- ✅ **One hand-made fixture conforms and is under `public/puzzles/`** — `public/puzzles/2026-06-12.json` (Ocean's Eleven vs The Devil Wears Prada, 8 actors / 4 each)
- ✅ **`loadPuzzle(id)` fetches and returns a validated object** — implemented with injectable `fetchImpl` + `basePath`
- ✅ **Loader validates shape and rejects malformed data** — `validatePuzzle` throws `PuzzleValidationError` with descriptive messages
- ✅ **Schema documented for the curation pipeline** — `docs/puzzle-schema.md`
- ✅ **Tests cover valid load, missing-field rejection, wrong-shape rejection** — plus duplicates, bad film refs, maxMistakes default, fetch path/network/non-ok, immutability

### Tests Written

- `tests/unit/puzzle-loader.test.js` — `validatePuzzle` (well-formed, no-mutation, defaults, non-object/missing-id/film-count/duplicate-film/unknown-film/duplicate-actor/empty-actors/bad-maxMistakes) and `loadPuzzle` (default path, custom basePath, non-ok, network failure, malformed body, empty id)
- `tests/fixtures/sample-puzzle.json` — deterministic test fixture

### Notes

Coverage on `src/lib/` is exercised by these tests; the loader and schema are the
first modules in `src/lib/`. Full numeric coverage is reported at run completion.

---

## Work Item: game-logic-lib

### Test Results

- Unit (Vitest): **44 passed**, 0 failed, 0 skipped (run total)
- Lint: clean · Format: clean
- **Coverage (`src/lib/`): 98.75% stmts / 95.71% branch / 100% funcs** — `game-logic.js` 100%, `puzzle-loader.js` 98.3% (clears the 90% lib threshold)

### Acceptance Criteria Validation

- ✅ **`gradeSubmission(assignment, answerKey, maxMistakes)` returns wrong count, `solved`, `lost`** — plus `total`, `correct`, and per-actor `results`
- ✅ **Win when zero misassigned** — `solved = wrong === 0`
- ✅ **Lose when wrong exceeds the budget** — `lost = wrong > maxMistakes`
- ✅ **Pure, in `src/lib/`** — no DOM/network/storage
- ✅ **Boundary cases covered** — exactly-at-limit (no loss) vs over-limit (loss), all-correct, all-wrong, single mistake, unassigned-as-wrong, extra-keys-ignored, empty assignment
- ✅ **Lib coverage threshold met** — `game-logic.js` 100%

### Tests Written

- `tests/unit/game-logic.test.js` — `buildAnswerKey`, `isComplete`, `gradeSubmission` (win/loss boundaries, partials, ordering, robustness)
- Extended `tests/unit/puzzle-loader.test.js` with remaining field-guard + body-error cases to lift loader coverage above 90%

### Notes

Documented mistake-budget semantics: a submission is graded as a whole (0 wrong =
win, > budget = loss, in-between = neither). The exact player loop (single submit
vs adjust-within-budget) is finalized at the `game-board-ui` checkpoint.

---

## Work Item: game-board-ui  *(confirm — approved)*

### Test Results

- Unit + component (Vitest): **55 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed** (smoke + full play-through)
- Lint: clean · Format: clean · Build: clean (`dist/` JS 9.33 kB gzip)
- Coverage (`src/lib/`): **98.92% stmts** (`shuffle.js` covered; components are out of the lib coverage scope by design)

### Approved interaction model

- Per-actor Film A/B segmented toggle (mobile-first).
- Loop: submit → lock correct → 4 lives → reveal answers on loss.

### Acceptance Criteria Validation

- ✅ **`<call-sheet-board>` renders a loaded puzzle's actors (scrambled) + two film columns** — legend + shuffled cast
- ✅ **Player can assign every actor and change assignments before submitting** — toggle reassignment, locked actors excluded
- ✅ **Submit disabled until all assigned** — gated by `isComplete` (tested)
- ✅ **On submit, grades via `src/lib` and reflects win/lose + mistake feedback** — lives indicator, banners, lock highlighting
- ✅ **Mobile-first responsive; touch-usable** — segmented controls, large tap targets (min 2.25–3rem)
- ✅ **Components stay thin — no rules in the view** — all grading delegated to `game-logic`
- ✅ **Component/e2e test: full sort-and-submit play-through passes** — `tests/e2e/play.spec.js` wins the real puzzle; component test covers win + loss

### Tests Written

- `tests/component/call-sheet-board.test.js` — submit gating, win, game-over event, partial-correct locking, loss on exhausted lives
- `tests/e2e/play.spec.js` — real chromium play-through to a win
- `tests/unit/shuffle.test.js` — membership, immutability, deterministic seed, edge sizes, default rng

---

## Work Item: result-and-share

### Test Results

- Unit + component (Vitest): **63 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed** (smoke + play-through now asserts the share view)
- Lint: clean · Format: clean · Build: clean (`dist/` JS 9.93 kB gzip)
- Coverage (`src/lib/`): **99.02% stmts / 96.1% branch / 100% funcs**

### Acceptance Criteria Validation

- ✅ **Result view shows clear win/lose + outcome** — `<call-sheet-result>` heading + mistakes count
- ✅ **Shareable emoji grid generated without revealing answers** — `generateShareText` encodes only outcome + lives-used pips (spoiler-free, asserted)
- ✅ **"Copy result" copies to clipboard** — `navigator.clipboard.writeText` with graceful fallback + "Copied!" feedback
- ✅ **Share text has a title/identifier, readable when pasted** — `Call Sheet <id>` header + outcome line + pips
- ✅ **Unit test covers share-grid for win and lose** — win (0 and 1 mistake), loss, clamping, spoiler-free

### Tests Written

- `tests/unit/share-grid.test.js` — win/lose/singular/clamp/spoiler-free
- `tests/component/call-sheet-result.test.js` — renders share text, win/lose heading, clipboard copy + feedback
- Extended `tests/e2e/play.spec.js` — result + Copy button appear after the win

---

## Run Summary

| Metric | Value |
|--------|-------|
| Work items completed | 4 / 4 |
| Total tests | **63 unit/component + 2 e2e** (all passing) |
| `src/lib/` coverage | **99.02% stmts**, 100% funcs |
| Build | clean static `dist/` (JS 9.93 kB gzip) |
| Lint / Format | clean |

**The MVP is complete: a fully playable daily puzzle — load → sort → submit →
win/lose → shareable result.**
