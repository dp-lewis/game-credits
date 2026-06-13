---
run: run-game-credits-012
scope: wide
intent: call-sheet-archive
generated: 2026-06-13T20:48:00Z
status: in_progress
---

# Test Report: Call Sheet — Archive (run-game-credits-012)

Per-item sections appended as each item completes.

---

## Work Item: practice-mode-streaks

### Test Results

- Unit (Vitest): **158 passed** (+5 practice-mode) · Lint/Format: clean

### Acceptance Criteria Validation

- ✅ **`recordResult(…, { updateStreak })`** — `false` records the day but leaves `current`/`longest`/`lastPlayedKey` untouched
- ✅ **Same-day behaviour preserved** — default `true`; increment/gap/loss rules unchanged
- ✅ **Idempotent / replay-safe** — re-recording a day keeps the original result and doesn't re-streak
- ✅ **Status readable** — existing `getDay` drives the archive list
- ✅ **Tests** — practice win records day not streak; existing-streak preserved; practice loss doesn't break streak; replay no-op; default-true compat

### Files

- `src/lib/progress-store.js`, `tests/unit/progress-store.test.js`

---

## Work Item: archive-list

### Test Results

- Unit (Vitest): **163 passed** (+5) · Lint/Format: clean

### Acceptance Criteria Validation

- ✅ **`listArchivePuzzles(manifestIds, todayKey)`** → valid ids `<= today`, sorted newest-first
- ✅ **Future dates excluded** (no spoilers)
- ✅ **Invalid ids ignored; empty/non-array → `[]`**
- ✅ **Pure, fully unit-tested**

### Files

- Created `src/lib/archive.js`, `tests/unit/archive.test.js`

---

## Work Item: archive-view  *(confirm — approved)*

### Test Results

- Unit + component (Vitest): **170 passed** · Lint/Format: clean
- Coverage (`src/lib/`): **97.3%** (safe-storage covered)
- E2E (Playwright): **6 passed** — incl. archive nav + native back button + practice replay
- Build: emits **both `index.html` and `archive.html`** (multi-page)

### Approved design (web-native multi-page)

A real `archive.html` index page with `<a href>` links; navigation + back button
are native. Today's row → official game; past rows → `?puzzle=` practice replay.

### Acceptance Criteria Validation

- ✅ **Archive entry link** from the game (`<a href="archive.html">`)
- ✅ **Index lists dates newest-first with status** (✓/✗/▢) + today marker — `<call-sheet-archive>` over `listArchivePuzzles` + `getDay`
- ✅ **Selecting plays it; back returns** — real links; e2e drives Archive → row → game → **browser back** → archive
- ✅ **Shareable / back-button** — multi-page, no history API
- ✅ **Today restores; `?puzzle=` replays (fresh board)** — gated by `_isReplay`; e2e reload of `?puzzle=` shows a fresh board
- ✅ **Streak gating** — `updateStreak: !isReplay && id===today`; practice note shown on replays
- ✅ **Component + e2e tests** — archive list rendering/hrefs + navigation/back

### Files

- Created `archive.html`, `src/archive-main.js`, `src/components/call-sheet-archive.js`, `src/lib/safe-storage.js`, `tests/component/call-sheet-archive.test.js`, `tests/e2e/archive.spec.js`, `tests/unit/safe-storage.test.js`
- Modified `vite.config.js` (multi-page), `src/components/call-sheet-app.js` (replay + streak gating + Archive link), `src/lib/date-key.js` (`formatDateKey`), `tests/e2e/play.spec.js` (replay semantics)

---

## Run Summary

| Metric | Value |
|--------|-------|
| Work items | 3 / 3 |
| Tests | **170 unit/component + 6 e2e** (all passing) |
| Coverage (`src/lib/`) | 97.3% |
| Build | both pages; clean |

**Archive shipped: a real index page of past puzzles, web-native navigation,
practice replays that don't disturb the streak.**
