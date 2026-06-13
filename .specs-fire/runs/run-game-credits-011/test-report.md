---
run: run-game-credits-011
scope: wide
intent: call-sheet-fixes
generated: 2026-06-13T12:05:00Z
status: in_progress
---

# Test Report: Call Sheet — Fixes (run-game-credits-011)

Per-item sections appended as each fix completes.

---

## Work Item: fix-dark-mode-contrast

### Test Results

- Unit (Vitest): **144 passed** · Lint/Format: clean · Build: clean
- E2E (Playwright): **3 passed** including the new `dark-mode.spec.js`

### Acceptance Criteria Validation

- ✅ **Group + Submit meet AA in dark mode** — dark-mode now overrides `--cs-card` (#1e1e1e) + `--cs-border` (#444); group colours darkened (#2c5282/#92400e/#553c9a/#276749) to clear ≥4.5:1 with white text
- ✅ **Light mode still passes** — group colours are AA in both modes; only surfaces flip
- ✅ **Disabled Submit legible** — now `color: var(--cs-muted)` on `--cs-border` (not white-on-light-grey)
- ✅ **Dark-mode e2e guard** — asserts the inactive group + Submit backgrounds are dark (fails on the old white surface)
- ✅ **No existing tests broken**

### Tests / Files

- Created `tests/e2e/dark-mode.spec.js`
- `src/styles/global.css` (dark `--cs-card`/`--cs-border`; AA group colours), `src/components/call-sheet-board.js` (disabled Submit colour), `src/components/call-sheet-actor.js` (removed now-redundant local dark override)

---

## Work Item: fix-grid-wrap-layout

### Test Results

- Unit (Vitest): **144 passed** · Lint/Format: clean
- E2E (Playwright): **4 passed** including the new `grid-layout.spec.js`

### Acceptance Criteria Validation

- ✅ **Chips consistent height regardless of wrapping** — `grid-auto-rows: 1fr` + chip fills its cell (`:host`/`button` `height: 100%`); e2e asserts all 12 chips equal height on desktop with long names
- ✅ **Desktop grid aligned with mixed name lengths** — verified at 1280px on `2026-06-14` (has "Joseph Gordon-Levitt" etc.)
- ✅ **Mobile (2-col) still works** — same rules apply; unit/e2e green
- ✅ **No existing tests broken**

### Tests / Files

- Created `tests/e2e/grid-layout.spec.js`
- `src/components/call-sheet-board.js` (`.grid { grid-auto-rows: 1fr }`), `src/components/call-sheet-actor.js` (`:host`/`button` `height: 100%`)

---

## Work Item: enforce-three-film-rotation  *(confirm — approved)*

### Test Results

- Unit (Vitest): **153 passed** (16 files; +9 guard checks) · Lint/Format: clean
- E2E (Playwright): **4 passed**
- Build: **8 puzzles in `dist/`, all 3-film**
- Verified: today (06-13) resolves to `2026-06-14` → **3 films**

### Acceptance Criteria Validation

- ✅ **Manifest only 3-film puzzles** — `2026-06-12`/`2026-06-13` removed; manifest = `2026-06-14 … 2026-06-21`
- ✅ **Fixtures preserved** — 4-film relocated to `tests/fixtures/four-film-puzzle.json` (3 imports updated); 2-film deleted (unused; `sample-puzzle.json` covers it) — per approved checkpoint
- ✅ **Today resolves to a 3-film puzzle** — `2026-06-14` (verified)
- ✅ **Guard test** — `manifest-three-films.test.js` loads every manifest puzzle and asserts exactly 3 films (fails before; passes after; blocks future regressions)
- ✅ **No tests broken** — 3 relocated imports green

### Tests / Files

- Created `tests/unit/manifest-three-films.test.js`
- Moved `public/puzzles/2026-06-13.json` → `tests/fixtures/four-film-puzzle.json`; deleted `public/puzzles/2026-06-12.json`; updated `manifest.json` + 3 test imports

---

## Run Summary

| Metric | Value |
|--------|-------|
| Fixes | 3 / 3 |
| Tests | **153 unit/component + 4 e2e** (all passing) |
| New regression guards | dark-mode e2e, grid-layout e2e, manifest-3-films unit |
| Build / Lint / Format | clean |

**All three reported issues fixed, each with a regression guard.**
