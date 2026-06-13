---
run: run-game-credits-012
scope: wide
work_items: [practice-mode-streaks, archive-list, archive-view]
intent: call-sheet-archive
---

# Implementation Plan: Call Sheet — Archive (run-game-credits-012)

Wide run, 3 items. `archive-view` (confirm) pauses for approval.

---

## Work Item: practice-mode-streaks

### Approach

Add an `{ updateStreak }` option to `recordResult`. When false (a past/archive
play), the day is still recorded (for the archive ✓) but the streak counters
(`current`/`longest`/`lastPlayedKey`) are untouched. Default `true` keeps every
existing caller's behaviour. Already idempotent per day → replay-safe.

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/progress-store.js` | `recordResult(dateKey, result, { updateStreak = true } = {})` — gate the streak update on the flag |
| `tests/unit/progress-store.test.js` | practice play records day but not streak; today play still updates; replay no-op; default-true compat |

---

## Work Item: archive-list

### Approach

Pure helper `listArchivePuzzles(manifestIds, todayKey)` → valid date ids
`<= todayKey`, sorted newest-first. Excludes future dates (no spoilers).

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/archive.js` | `listArchivePuzzles` |
| `tests/unit/archive.test.js` | excludes future / sorts desc / ignores invalid / empty |

---

## Work Item: archive-view  *(confirm — checkpoint)*

### Approach — a real archive *index page* (multi-page, web-native)

Rather than an in-app SPA router, add a second real page. Navigation is plain
`<a href>` links and full-page loads, so the **back button is native** and pages
are bookmarkable/shareable — no `history` API.

**Pages (Vite multi-page build):**
- `index.html` — the game. `?puzzle=<id>` plays that puzzle on a **fresh board**
  (replay); no param → today (resolve + **restore** if played). Adds an
  **"Archive"** link → `archive.html`.
- `archive.html` (new) — the **puzzle index**: dates ≤ today, newest first, each a
  real link with status. Today's row links to `index.html` (official daily play);
  past rows link to `index.html?puzzle=<id>` (practice replay). A **"Play today"**
  link back to the game.

**Restore vs replay (in `index.html`):** default today path restores a finished
result; an explicit `?puzzle=` always replays (fresh board).

**Streak:** `updateStreak: !isReplay && id === todayKey()` — only the official
daily play moves the streak; `?puzzle=` plays are practice.

Same-origin `localStorage` means status (✓/✗/▢) is shared across both pages.
Relative links (`index.html`, `archive.html`) work under the Dreamhost subfolder.

### Files to Create

| File | Purpose |
|------|---------|
| `archive.html` | Second Vite entry; mounts the archive |
| `src/archive-main.js` | Entry script for `archive.html` |
| `src/components/call-sheet-archive.js` | Fetches manifest + progress store; renders the list of `<a>` links with status + "today" marker |
| `tests/component/call-sheet-archive.test.js` | Renders entries as links, marks today, correct hrefs |
| `tests/e2e/archive.spec.js` | Home → Archive link → listing + status → click a past day → play to a win → **browser back** returns to the index |

### Files to Modify

| File | Change |
|------|--------|
| `vite.config.js` | Multi-page input (`index.html` + `archive.html`) |
| `index.html` | An "Archive" link |
| `src/components/call-sheet-app.js` | Treat `?puzzle=` as replay (no restore); streak gating `!isReplay && id===today` |
| `src/lib/date-key.js` | `formatDateKey('2026-06-14')` → "Jun 14, 2026" (pure, tested) |

### Archive page design (proposed)

```
Call Sheet — Archive                 [ Play today ▸ ]

  Jun 14, 2026   today    ✓  solved, 0 mistakes
  Jun 13, 2026            ✗  out of lives
  Jun 12, 2026            ▢  play
```

### Checkpoint decisions

1. **Multi-page index** (`archive.html`) with native `<a>` navigation — confirmed direction.
2. **Restore-vs-replay**, **streak gating**, and **which row links where** (today → official, past → replay).
3. **Archive page layout / labels** above.

---
*Plan revised (web-native multi-page index per user feedback). Awaiting approval.*
