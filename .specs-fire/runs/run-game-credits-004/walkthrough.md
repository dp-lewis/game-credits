---
run: run-game-credits-004
work_items: [daily-puzzle-rotation, streak-tracking]
intent: call-sheet
generated: 2026-06-13T08:04:00Z
mode: wide (autopilot ×2)
---

# Implementation Walkthrough: Phase 2 — daily rotation + streaks

## Summary

Turned Call Sheet from a single hardcoded puzzle into a real **daily game**:
date-driven puzzle rotation from a static manifest, a `?puzzle=<id>` override,
per-device **streaks/history** in `localStorage`, finished-day **restore** (no
replay), and streaks in the share grid. 126 unit/component tests + 2 e2e,
`src/lib` ~98%.

## Structure Overview

```
src/lib/                       # all pure / injectable (testable)
├── date-key.js     ← new      # todayKey, isValidDateKey, daysBetween
├── puzzle-schedule.js ← new   # resolvePuzzleId (exact → latest ≤ today → earliest)
├── progress-store.js  ← new   # createProgressStore(storage): getDay/recordResult/getStreaks
├── puzzle-loader.js  + loadManifest
└── share-grid.js     + optional streak line
public/puzzles/manifest.json ← new   # ["2026-06-12","2026-06-13","2026-06-14"]
src/components/call-sheet-app.js  ← rotation + ?puzzle override + record/restore + streak
src/components/call-sheet-result.js ← streak display + share
```

## Key Implementation Details

### 1. Date-driven rotation, static-host friendly

Static hosting can't list a directory, so a **manifest** is the registry. The app
resolves `todayKey()` (local date) against it via `resolvePuzzleId` — exact day,
else most recent ≤ today, else earliest, else a friendly "no puzzle" message.
**Timezone:** local midnight rolls the puzzle (documented).

### 2. `?puzzle=<id>` override

Forces a specific puzzle, bypassing date resolution. This makes the e2e
deterministic (independent of the run date) and doubles as a replay/share link.

### 3. Streaks, idempotent and resilient

`createProgressStore(storage)` wraps `localStorage` behind an injectable
interface. A win on the day after the last play increments the streak; a gap or a
loss resets it (longest is preserved). Same-day records are idempotent (no
double-count) and malformed stored JSON recovers to a fresh state. The app uses a
private-mode-safe storage (in-memory fallback). Only outcome metadata is stored —
never answers.

### 4. Finished-day restore

On load, if the resolved puzzle already has a recorded result, the app shows that
result + streak and an "already played" note instead of the board — verified by an
e2e that wins, reloads, and asserts the board is gone.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Puzzle registry | static `manifest.json` | No directory listing on static hosts |
| "Today" | player's local date | Simple, expected; documented |
| Resolution fallback | latest ≤ today, else earliest | Sensible with sparse puzzle files |
| Streak rule | win-only; gap/loss resets; longest kept | Wordle-like, unambiguous |
| Progress key | puzzle date id | Consistent with rotation + day math |
| Storage | injectable + safe fallback | Testable; survives private mode |

## Deviations from Plan

None of substance. Added the `?puzzle=` override (not in the original item text)
to make rotation testable deterministically — a useful side-benefit.

## Dependencies Added

| Package | Why |
|---------|-----|
| (none) | Built on existing deps |

## How to Verify

1. **Rotation + override**
   ```bash
   npm run dev
   ```
   `/` loads today's puzzle (by local date); `/?puzzle=2026-06-14` forces the
   3-film one. Finish a puzzle, reload — it shows your result, not a replay.

2. **Tests**
   ```bash
   npm run test:coverage   # 126 passing; src/lib ~98%
   npm run test:e2e        # 2 passing (incl. reload-restore)
   ```

## Test Coverage

- Tests added: 128 (126 unit/component + 2 e2e)
- `src/lib/` coverage: 98.2% stmts / 100% funcs
- Status: passing

## Ready for Review

- [x] All acceptance criteria met (2 work items)
- [x] Tests passing
- [x] No critical issues
- [x] Documentation updated (rotation/timezone)
- [x] Developer notes captured

## Developer Notes

The `tmdb-curation-script` should append each generated puzzle's date id to
`public/puzzles/manifest.json`. `daysBetween`/`todayKey` are shared by rotation
and streaks so "consecutive days" stays consistent. The board's `game-over`
detail (`status`/`mistakes`/`groupsSolved`/`totalGroups`) is what the store
records — a richer per-submit history could feed a Connections-style share grid
later if desired.
