---
run: run-game-credits-025
intent: archive-themes-preview
---

# Test Report: Archive Themes and Tomorrow Preview

## Work Item: archive-theme-index

### Test Results

- **Unit tests**: 203 passed, 0 failed
- **New tests added**: 3 (`archive-index.test.js`)

### New Tests

| Test | Result |
|------|--------|
| `archive index guard > index.json exists and is a non-empty array` | ✓ |
| `archive index guard > every manifest date appears in the index with a non-empty theme` | ✓ |
| `archive index guard > index is sorted by date ascending` | ✓ |

### Acceptance Criteria Validation

- [x] `public/puzzles/index.json` is `[{ "date": "YYYY-MM-DD", "theme": "..." }]`, sorted by date, covering every manifest puzzle (15 entries)
- [x] `build-puzzles.js` upserts the index entry on write via `upsertArchiveIndex()`
- [x] `scripts/build-archive-index.js` (re)builds the index from the manifest + puzzle files
- [x] Guard unit test: index includes every manifest date with a non-empty theme
- [x] `manifest.json` shape unchanged; `npm run check` passes

---

## Work Item: archive-themes-and-preview

### Test Results

- **Unit tests**: 203 passed (including 10 new)
- **E2E tests**: 8 passed (including 2 new)

### New Unit Tests

| Test | Result |
|------|--------|
| `nextDateKey > adds one calendar day` | ✓ |
| `nextDateKey > crosses month boundary` | ✓ |
| `nextDateKey > crosses year boundary` | ✓ |
| `tomorrowEntry > returns the next-day entry when it exists` | ✓ |
| `tomorrowEntry > returns null when tomorrow has no index entry` | ✓ |
| `tomorrowEntry > returns null when index is empty` | ✓ |
| `tomorrowEntry > returns null for a non-array index` | ✓ |
| `enrichWithThemes > joins theme onto each id from the index` | ✓ |
| `enrichWithThemes > sets theme to null when date not in index` | ✓ |
| `enrichWithThemes > handles empty ids array` | ✓ |

### New E2E Tests

| Test | Result |
|------|--------|
| `archive rows show a theme label` | ✓ |
| `tomorrow locked teaser is shown on the archive page` | ✓ |

### Acceptance Criteria Validation

- [x] Each archive row shows its theme (muted `.theme` span alongside date + status)
- [x] A locked tomorrow teaser renders at the top (`.preview` div, not a link, with 🔒)
- [x] Only today+1 is previewed; graceful when there's no tomorrow puzzle or theme
- [x] Native back-button behaviour unchanged (real `<a>` links for playable rows)
- [x] `nextDateKey` + `tomorrowEntry` unit-tested; e2e asserts themed row + teaser
- [x] `npm run check` passes

### Coverage

| Metric | Value |
|--------|-------|
| Statements | 97.56% |
| Branches | 92.91% |
| Functions | 100% |
| Lines | 98.79% |
