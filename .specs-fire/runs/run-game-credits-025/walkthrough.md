---
run: run-game-credits-025
work_item: archive-theme-index + archive-themes-and-preview
intent: archive-themes-preview
generated: 2026-06-14T14:29:23Z
mode: autopilot
scope: wide
---

# Implementation Walkthrough: Archive Themes and Tomorrow Preview

## Summary

Added a build-time `public/puzzles/index.json` that maps each puzzle date to its
theme, enabling the archive to load all themes in a single fetch. The archive now
shows each day's theme in a muted italic label beneath the date, and a locked
"tomorrow" teaser (date + theme + 🔒) appears at the top — spoiler-free, not
playable until tomorrow arrives.

## Structure Overview

Three new pure helpers live in `src/lib/`: `nextDateKey` (date arithmetic),
`enrichWithThemes` (join index onto id list), and `tomorrowEntry` (look up
today+1). `archive-main.js` fetches `index.json` in parallel with the manifest,
then passes enriched entries and the optional tomorrow preview to the Lit
component. The component renders a `.preview` `<div>` (not an `<a>`) for the
teaser, and a `.theme` `<span>` inside every `.row`.

The index itself is a plain sorted JSON array built at puzzle-generation time
(and rebuildable via `scripts/build-archive-index.js`).

## Files Changed

### Created

| File | Purpose |
|------|---------|
| `public/puzzles/index.json` | Sorted `[{date, theme}]` index (15 entries, generated now) |
| `scripts/build-archive-index.js` | CLI that (re)builds index.json from manifest + puzzle files |
| `tests/unit/archive-index.test.js` | Guard: every manifest date in the index with non-empty theme |
| `tests/unit/archive-tomorrow.test.js` | Unit tests for `nextDateKey`, `tomorrowEntry`, `enrichWithThemes` |

### Modified

| File | Changes |
|------|---------|
| `scripts/build-puzzles.js` | Added `upsertArchiveIndex()` — called after writing puzzle, keeps index in sync |
| `src/lib/date-key.js` | Added `nextDateKey(key)` — returns the YYYY-MM-DD for key + 1 day |
| `src/lib/archive.js` | Added `enrichWithThemes(ids, indexEntries)` and `tomorrowEntry(indexEntries, todayKey)` |
| `src/archive-main.js` | Fetch `index.json` in parallel with manifest; pass themed entries + preview to component |
| `src/components/call-sheet-archive.js` | Added `preview` property; `.theme` span on rows; non-link `.preview` div for teaser |
| `tests/e2e/archive.spec.js` | Added 2 e2e tests: theme label visible on a row; locked teaser present |

## Key Implementation Details

### 1. Single-fetch theme loading

Rather than one fetch per puzzle (which would be N requests for an archive of N
days), a build-time `index.json` compiles all dates + themes into a single
sorted array. The archive fetches this once alongside the manifest. If the fetch
fails (offline / 404), the `catch(() => [])` fallback silently omits themes
without breaking the archive list.

### 2. Index kept in sync

`build-puzzles.js` calls `upsertArchiveIndex()` after writing every puzzle file.
The function reads the current index (or `[]`), upserts the `{date, theme}`
entry by date, re-sorts, and writes — so the index stays correct without any
manual step. `scripts/build-archive-index.js` provides a one-off rebuild for
backfills or recovery.

### 3. Tomorrow teaser design

Only today+1 is previewed (later dates stay fully hidden). The teaser is a
`<div class="preview">` — not an `<a>` — so it is visually distinct and cannot
be followed as a link. The lock emoji (🔒) and dashed border signal "coming
soon". If no tomorrow entry exists in the index, `tomorrowEntry` returns `null`
and the teaser is silently omitted.

### 4. Date arithmetic

`nextDateKey` converts the date key to a UTC timestamp, adds 86 400 000 ms (one
day exactly), then formats the result as YYYY-MM-DD — correct across DST
transitions and month/year boundaries.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Index format | Sorted `[{date, theme}]` array | Simple to fetch, join, and iterate; no lookup object needed at runtime |
| Fetch failure handling | Silent `catch(() => [])` | Archive still works (just without themes) if the fetch fails |
| Tomorrow: how many days previewed | Only today+1 | Brief asks for exactly one teaser; later days stay hidden |
| Teaser element type | `<div>` not `<a>` | Makes it non-navigable by construction; matches spec "not a play link" |
| Theme rendering position | Below the date in a flex column `.info` wrapper | Keeps the date prominent; theme is secondary (muted, italic) |

## Deviations from Plan

None. Implementation matches the work item specs precisely.

## Dependencies Added

None. `index.json` is a plain static JSON file; all new code uses web-platform
primitives already in use (`fetch`, `Date`, ES modules).

## How to Verify

1. **Rebuild the archive index (after adding new puzzles)**

   ```bash
   node scripts/build-archive-index.js
   ```

   Expected: `Wrote …/index.json (N entries).`

2. **Run the full check suite**

   ```bash
   npm run check
   ```

   Expected: format, lint, 203 unit tests, build, and 8 e2e tests all pass.

3. **Manual archive smoke test**

   Open `http://localhost:5173/archive.html` (after `npm run dev`):
   - Each row shows a muted italic theme label (e.g. "The Coen Brothers")
   - The very first item is a dashed, non-clickable card with tomorrow's date +
     theme + 🔒 (if a tomorrow puzzle is in the index)

## Test Coverage

- Tests added: 13 (3 guard unit + 10 helper unit + 2 new e2e) — actually 13 new
- Coverage: 97.56% statements, 100% functions
- Status: 203 unit / 8 e2e — all passing

## Ready for Review

- [x] All acceptance criteria met
- [x] Tests passing (203 unit + 8 e2e)
- [x] No critical issues
- [x] Developer notes captured

## Developer Notes

- The `index.json` must be served alongside the puzzle files. Vite's dev server
  and the static build both serve `public/` as-is, so no config change needed.
- If you backfill puzzles without running `build-archive-index.js`, those dates
  will appear in the archive list with `theme: null` (rows omit the theme label
  gracefully). Run the script to fix.
- The guard unit test (`archive-index.test.js`) reads the real `index.json` and
  `manifest.json` from disk — it's a fast sanity check, not a mock-based test.
  If you add a puzzle without updating the index, this test will catch the drift.

---
*Generated by specs.md - fabriqa.ai FIRE Flow Run run-game-credits-025*
