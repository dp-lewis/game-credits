---
run: run-game-credits-003
scope: wide
intent: call-sheet
generated: 2026-06-12T09:43:00Z
status: in_progress
---

# Test Report: Call Sheet v2 — 4-film crossover (run-game-credits-003)

Per-item sections appended as each item completes.

---

## Work Item: multi-film-schema

### Test Results

- Unit + component (Vitest): **73 passed**, 0 failed, 0 skipped
- Lint: clean · Format: clean · Build: clean (both `2026-06-12.json` and `2026-06-13.json` copied to `dist/puzzles/`)
- Coverage (`src/lib/`): **99.2% stmts / 97.84% branch / 100% funcs**

### Acceptance Criteria Validation

- ✅ **N-film schema (≥2, expected 4)** — `MIN_FILMS_PER_PUZZLE = 2`; loader allows N films
- ✅ **Group-balance validation** — actors divisible by films; each film = `groupSize` solution actors
- ✅ **Single solution `filmId` + optional `alsoIn`** — `alsoIn` validated (declared films, ≠ solution, no dups) and preserved in output
- ✅ **Loader returns normalized validated puzzle; descriptive errors** — new messages for film count, balance, divisibility, alsoIn
- ✅ **4×4 fixture with a unique solution** — `public/puzzles/2026-06-13.json`; **verified: exactly 1 valid partition** over real memberships (`filmId ∪ alsoIn`)
- ✅ **Docs updated** — `docs/puzzle-schema.md` covers N films, balance, alsoIn, uniqueness boundary
- ✅ **Tests cover N-film, balance rejection, alsoIn validation; backward-compatible with 2-film**

### Uniqueness verification

The fixture was checked by counting all capacity-respecting partitions where each
actor is placed in a film they were really in (`filmId ∪ alsoIn`) and each film
gets its group of 4 → **exactly 1** solution. Anchors (single-film actors) fill
Inception and OUATIH to capacity and The Departed to 3/4, forcing the crossovers
(Pitt→Ocean's, Damon→Ocean's, DiCaprio→Departed).

### Tests Written

- `tests/unit/multi-film-schema.test.js` — 4-film fixture valid, alsoIn preserved, 2-film backward-compat, <2 films, unbalanced, non-divisible, alsoIn (unknown/solution/dup/non-array)
- Updated `tests/unit/puzzle-loader.test.js` — old "exactly 2" rule → "≥ 2"

### Files

- Modified: `src/lib/puzzle-schema.js`, `src/lib/puzzle-loader.js`, `docs/puzzle-schema.md`, `tests/unit/puzzle-loader.test.js`
- Created: `public/puzzles/2026-06-13.json`, `tests/unit/multi-film-schema.test.js`

---

## Work Item: multi-film-board  *(confirm — approved)*

### Test Results

- Unit + component (Vitest): **82 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed** (smoke + full 4-film play-through)
- Lint: clean · Format: clean · Build: clean (`dist/` JS 10.99 kB gzip)
- Coverage (`src/lib/`): **99.29% stmts / 98.11% branch / 100% funcs** (`group-logic.js` covered)

### Approved design (hidden films)

Film titles hidden during play; 4 colour-coded buckets; arrange 16 actors (4 per
bucket); graded by membership; solving a group reveals its film + locks; wrong
submit costs a life; "One away…" on near-miss; reveal all on loss.

### Acceptance Criteria Validation

- ✅ **Renders N films (4) with colours + a scrambled 16-actor pool** — buckets are colour/number only (titles hidden until solved)
- ✅ **Touch-friendly assign/reassign before submit** — colour-brush (pick bucket → tap actors); tap-again removes
- ✅ **Submit gated until full; grades via `src/lib`** — `gradeGroups`
- ✅ **Correct groups lock + reveal; wrong costs a life; win all / lose at 0 (reveal)** — verified in component tests
- ✅ **New pure logic in `src/lib` with tests** — `group-logic.js` (`gradeGroups`, one-away), 8 unit tests
- ✅ **Generalises over film count (N=4 and N=2)** — board derives buckets/groupSize from the puzzle
- ✅ **Component + e2e: full 4-film play-through to a win; loss covered** — `play.spec.js` + board component tests (win/lose/one-away/lock/gating)

### Tests Written

- `tests/unit/group-logic.test.js` — correct/one-away/2+2/under-filled/mixed/order-independence/empty
- `tests/component/call-sheet-board.test.js` — rewritten for v2 (gating, win any-order, game-over, lock+reveal, one-away, loss)
- `tests/e2e/play.spec.js` — 4-film play-through to a win + share view

---

## Work Item: multi-film-result-share

### Test Results

- Unit + component (Vitest): **87 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed**
- Lint: clean · Format: clean · Build: clean (`dist/` JS 11.07 kB gzip)
- Coverage (`src/lib/`): **99.34% stmts / 98.18% branch / 100% funcs**

### Acceptance Criteria Validation

- ✅ **Result shows win/lose + groups completed** — `<call-sheet-result>` renders "g/t groups found"
- ✅ **Share text spoiler-free, reflects 4-group outcome** — `generateGroupShareText` (groups + mistakes + 🟩/⬜ pips; no names — asserted)
- ✅ **"Copy result" works with graceful fallback** — unchanged clipboard path
- ✅ **Share generation pure + unit-tested for win and loss across 4 groups** — `share-grid-v2.test.js`
- ✅ **Backward-compatible / cleanly superseded** — v1 `generateShareText` retained; result component now group-aware

### Tests Written

- `tests/unit/share-grid-v2.test.js` — win (clean / singular), loss partial pips, clamp, spoiler-free
- Updated `tests/component/call-sheet-result.test.js` (group props + v2 text) and `tests/e2e/play.spec.js` (v2 win share)

---

## Run Summary

| Metric | Value |
|--------|-------|
| Work items completed | 3 / 3 |
| Total tests | **87 unit/component + 2 e2e** (all passing) |
| `src/lib/` coverage | **99.34% stmts**, 100% funcs |
| Build | clean static `dist/` (JS 11.07 kB gzip) |
| Lint / Format | clean |

**Call Sheet v2 is complete: a 4-film hidden-groups Connections-style puzzle —
arrange 16 actors into four hidden films, solve groups to reveal them, "One
away" hints, 4 lives, and a spoiler-free group share grid.**
