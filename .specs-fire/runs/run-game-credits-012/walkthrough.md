---
run: run-game-credits-012
work_items: [practice-mode-streaks, archive-list, archive-view]
intent: call-sheet-archive
generated: 2026-06-13T20:58:00Z
mode: wide (autopilot ×2 + confirm ×1)
---

# Implementation Walkthrough: Call Sheet — Archive

## Summary

Added the ability to play past puzzles via a real **archive index page**, with
completion status and correct streak handling. 170 unit/component + 6 e2e.

## What shipped

### 1. Practice-mode streaks
`recordResult(dateKey, result, { updateStreak })` — a past/archive play records the
day (for the archive ✓) but only **today's** play moves the streak. Idempotent, so
replays never overwrite a result.

### 2. Archive list helper
Pure `listArchivePuzzles(manifest, today)` → dates ≤ today, newest first (no future
spoilers). `formatDateKey('2026-06-14')` → "Jun 14, 2026".

### 3. Archive view (web-native, per user feedback)
A real second page, **`archive.html`** (Vite multi-page build), listing puzzles as
`<a href>` links with status — so navigation, bookmarking, and the **back button
are native** (no `history` API). Today's row → `index.html` (official daily); past
rows → `index.html?puzzle=<id>` (practice replay). The game gained an **Archive**
link and treats `?puzzle=` as a fresh practice board (no restore); a "Practice
mode" note tells the player it won't affect the streak.

## Key decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Navigation | Multi-page `<a>` links | Native back button; "how the web works" (user steer) |
| Restore vs replay | Today restores; `?puzzle=` replays | Daily ritual preserved; archive is practice |
| Streak | `!isReplay && id===today` | Only the official daily play counts |
| `safeStorage` | Extracted to `src/lib` | Shared by game + archive pages |

## How it works

```
index.html  →  "Archive ▸"  →  archive.html
archive.html row (today)     →  index.html            (official daily; restores)
archive.html row (past)      →  index.html?puzzle=ID  (fresh practice board)
browser Back from a game     →  archive.html          (native)
```

Same-origin `localStorage` shares completion status across both pages. Relative
links keep it working under the `/call-sheet/` Dreamhost subfolder.

## Deviations from Plan

Per user feedback, replaced the originally-planned in-app `?archive` SPA router
(`history.pushState`/`popstate`) with a real multi-page index — simpler and more
web-native.

## How to Verify

```bash
npm run test:coverage && npm run test:e2e   # 170 + 6 (incl. native back button)
npm run build && ls dist/*.html             # index.html + archive.html
npm run dev                                  # Archive link → listing → play a day → Back
```

## Note on content

The archive currently shows only today (06-14) because every manifest puzzle is
06-14 or later; past entries accumulate as days pass and as older puzzles are
added.

## Ready for Review

- [x] All 3 work items met
- [x] Tests passing (170 + 6 e2e)
- [x] No critical issues
- [x] Web-native navigation (native back button), verified by e2e
