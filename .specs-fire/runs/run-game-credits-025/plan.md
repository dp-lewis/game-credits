---
run: run-game-credits-025
intent: archive-themes-preview
mode: autopilot
scope: wide
---

# Implementation Plan: Archive Themes and Tomorrow Preview

Wide run — 2 work items, both autopilot.

## Work Item 1: Archive Theme Index (`archive-theme-index`)

### Approach

Build a `public/puzzles/index.json` (`[{date, theme}]` sorted by date) that
lets the archive fetch all themes in a single request. Update `build-puzzles.js`
to upsert the entry when it writes a puzzle. Add a standalone rebuild script and
a guard unit test.

### Files to Create

| File | Purpose |
|------|---------|
| `public/puzzles/index.json` | Date→theme index (generated now by build script) |
| `scripts/build-archive-index.js` | CLI: reads manifest + puzzle files, writes index.json |
| `tests/unit/archive-index.test.js` | Guard: every manifest date has a non-empty theme in the index |

### Files to Modify

| File | Changes |
|------|---------|
| `scripts/build-puzzles.js` | After writing puzzle file, upsert `{date, theme}` into index.json |

---

## Work Item 2: Archive Themed Rows and Tomorrow Teaser (`archive-themes-and-preview`)

### Approach

Consume `index.json` in the archive: join themes onto each row, and add a locked
tomorrow teaser (`{ date, theme }` row that is *not* a play link) at the top.

### Files to Create

| File | Purpose |
|------|---------|
| `tests/unit/archive-tomorrow.test.js` | Unit tests for `nextDateKey` + `tomorrowEntry` |

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/date-key.js` | Add `nextDateKey(key)` — adds 1 day to a date key |
| `src/lib/archive.js` | Add `tomorrowEntry(indexEntries, todayKey)` and `enrichWithThemes(ids, indexEntries)` |
| `src/archive-main.js` | Fetch `index.json`, enrich entries with theme, compute tomorrow preview |
| `src/components/call-sheet-archive.js` | Render `entry.theme` on rows; render locked `.preview` row when `preview` prop set |
| `tests/e2e/archive.spec.js` | Assert theme visible on a row + locked teaser present |
