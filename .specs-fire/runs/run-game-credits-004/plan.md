---
run: run-game-credits-004
scope: wide
work_items: [daily-puzzle-rotation, streak-tracking]
intent: call-sheet
---

# Implementation Plan: Phase 2 — daily rotation + streaks (run-game-credits-004)

Wide run, 2 autopilot items in dependency order (streaks builds on rotation).

---

## Work Item: daily-puzzle-rotation

### Approach

Replace the hardcoded default puzzle with date-driven selection. A static
**manifest** lists available puzzle ids; the app resolves today's date key, picks
the right puzzle (with a sensible fallback), and loads it. A `?puzzle=<id>` URL
override forces a specific puzzle (deterministic tests + replay/share links).

**Timezone decision:** "today" = the player's **local** date (local midnight
rolls the puzzle). Documented. Streak day-gaps (#2) compute on the same keys.

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/date-key.js` | Pure `todayKey(date?)`, `isValidDateKey`, `daysBetween` (reused by streaks) |
| `src/lib/puzzle-schedule.js` | Pure `resolvePuzzleId(todayKey, availableIds)` — exact day, else latest ≤ today, else earliest, else null |
| `public/puzzles/manifest.json` | `["2026-06-12","2026-06-13","2026-06-14"]` (curation maintains it later) |
| `tests/unit/date-key.test.js` | date-key formatting, validation, day math |
| `tests/unit/puzzle-schedule.test.js` | exact/fallback/empty resolution |

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/puzzle-loader.js` | Add `loadManifest({basePath,fetchImpl})` → validated string[] |
| `src/components/call-sheet-app.js` | Resolve `?puzzle=` override → else manifest + `todayKey` → load; "no puzzle today" fallback |
| `tests/unit/puzzle-loader.test.js` | `loadManifest` happy/empty/bad cases |
| `tests/e2e/play.spec.js` | Use `/?puzzle=2026-06-14` for a deterministic 3-film play-through |
| `docs/puzzle-schema.md` | Document the manifest + date resolution + timezone |

### Notes

- Today resolves to its same-dated puzzle; with the current files, `2026-06-13`
  (4-film) is "today's" and `2026-06-14` (3-film) is the next day's. `?puzzle=`
  lets you play any of them now.
- "Already played today" detection is wired in `streak-tracking` (#2), which adds
  the real progress store and result restore.

---

## Work Item: streak-tracking

### Approach

A thin, testable `localStorage` wrapper records each day's outcome and computes
streaks. The app records on `game-over`, restores a finished day on reload (no
replay), shows the streak, and appends it to the share text.

**Streak rule (documented):** a day counts only if **won**. Current streak
increments when you win on the day immediately after your last play; a **gap**
(missed day) or a **loss** resets it to 0 (a fresh win then starts at 1). Longest
is the max ever reached. Progress is keyed by the puzzle's date id; only
status/mistakes/groups are stored (never answers).

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/progress-store.js` | `createProgressStore(storage)` — `getDay`, `recordResult`, `getStreaks` |
| `tests/unit/progress-store.test.js` | increment / gap-reset / loss-reset / restore / malformed-data |

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/share-grid.js` | `generateGroupShareText` accepts optional `streak` → appends a 🔥 line |
| `src/components/call-sheet-result.js` | Show streak; pass it to the share generator |
| `src/components/call-sheet-app.js` | Record on game-over; restore finished day; pass streak to result |
| `tests/component/call-sheet-result.test.js` | Streak display + share line |
| `tests/unit/share-grid-v2.test.js` | Streak append |
| `tests/e2e/play.spec.js` | After win, reload → result restored (no replay) |

---
*Plan recorded (autopilot — no checkpoint). Execution follows.*
