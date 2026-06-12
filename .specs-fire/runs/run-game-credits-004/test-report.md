---
run: run-game-credits-004
scope: wide
intent: call-sheet
generated: 2026-06-13T07:58:00Z
status: in_progress
---

# Test Report: Phase 2 — daily rotation + streaks (run-game-credits-004)

Per-item sections appended as each item completes.

---

## Work Item: daily-puzzle-rotation

### Test Results

- Unit + component (Vitest): **114 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed** (smoke on today's puzzle; play-through forced via `?puzzle=`)
- Lint: clean · Format: clean · Build: clean (manifest + all puzzles copied to `dist/puzzles/`)
- Coverage (`src/lib/`): **98.45% stmts / 97.1% branch / 100% funcs**

### Acceptance Criteria Validation

- ✅ **Resolves today's date → loads `<date>.json`** — `todayKey` + `resolvePuzzleId` + `loadPuzzle`
- ✅ **Multiple puzzles coexist; correct one loads by date** — manifest registry + chronological resolution
- ✅ **Graceful fallback when none exists** — resolver picks latest ≤ today / earliest; app shows a "no puzzle today" message on null
- ⏳ **"Already played today" detection** — wired in `streak-tracking` (#2, this run), which adds the progress store + result restore
- ✅ **Timezone defined + documented** — local calendar date (local midnight); documented in `docs/puzzle-schema.md`
- ✅ **Tests cover date→key + missing-puzzle fallback** — `date-key`, `puzzle-schedule`, `loadManifest`

### Tests Written

- `tests/unit/date-key.test.js` — formatting, validation (incl. overflow), day math across months
- `tests/unit/puzzle-schedule.test.js` — exact/fallback/earliest/empty/unsorted/malformed
- `tests/unit/puzzle-loader.test.js` (extended) — `loadManifest` happy/path/non-ok/non-array/empty-entry

### Notes

- Added a `?puzzle=<id>` URL override (deterministic e2e + replay/share links).
- With the current files, today's date resolves to its same-dated puzzle; the
  manifest lists `2026-06-12` (2-film), `2026-06-13` (4-film), `2026-06-14`
  (3-film).

---

## Work Item: streak-tracking

### Test Results

- Unit + component (Vitest): **126 passed**, 0 failed, 0 skipped
- E2E (Playwright/chromium): **2 passed** (play-through now also asserts reload-restore)
- Lint: clean · Format: clean · Build: clean (`dist/` JS 12.2 kB gzip)
- Coverage (`src/lib/`): **98.2% stmts / 94.7% branch / 100% funcs**

### Acceptance Criteria Validation

- ✅ **Progress store in `src/lib/` reads/writes streak + history to localStorage** — `createProgressStore(storage)`
- ✅ **Current streak increments on consecutive wins; resets on gap/loss (documented)** — rule in JSDoc + tested
- ✅ **Longest streak tracked** — preserved across resets (tested)
- ✅ **Reloading a finished day restores its result (no replay)** — app `_played` restore; e2e reloads and asserts "already played" + no board
- ✅ **Share text can include streak** — `generateGroupShareText({ streak })` appends a 🔥 line; result passes it
- ✅ **Tests cover increment / reset-on-gap / restore (storage stubbed)** — plus loss-reset, idempotent same-day, malformed-data recovery, persistence

### Tests Written

- `tests/unit/progress-store.test.js` — empty/record/increment/gap-reset/loss-reset/fresh-after-loss/idempotent/persist/malformed
- `tests/unit/share-grid-v2.test.js` (extended) — streak append / omit
- `tests/component/call-sheet-result.test.js` (extended) — streak display + share line
- `tests/e2e/play.spec.js` (extended) — reload restores the finished puzzle

---

## Run Summary

| Metric | Value |
|--------|-------|
| Work items completed | 2 / 2 |
| Total tests | **126 unit/component + 2 e2e** (all passing) |
| `src/lib/` coverage | **98.2% stmts**, 100% funcs |
| Build | clean static `dist/` (JS 12.2 kB gzip) |
| Lint / Format | clean |

**Phase 2 complete: Call Sheet is now a real daily game — date-driven puzzle
rotation (with `?puzzle=` override), per-device streaks/history, finished-day
restore, and streaks in the share grid.**