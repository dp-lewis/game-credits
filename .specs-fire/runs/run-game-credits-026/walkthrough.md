---
run: run-game-credits-026
work_items: fix-preview-dark-mode, block-future-puzzles
intent: archive-preview-fixes
generated: 2026-06-15T09:33:00Z
mode: wide (autopilot)
---

# Implementation Walkthrough: Archive Preview Fixes

## Summary

Two bug fixes from the archive themes/preview work:

1. **Dark-mode teaser contrast** — the tomorrow teaser was light-on-light in dark mode
   because `.preview` used an **undefined `--cs-surface`** token (always the light
   `#f9f9f9` fallback). It now uses `--cs-card`, which flips to a dark surface in dark
   mode (matching the playable rows); the dashed border / muted text / 🔒 keep its
   "locked / coming soon" look.
2. **Future puzzles are no longer playable** — `?puzzle=<future date>` (or a moved
   clock) used to load and play an unreleased puzzle. `_load()` now refuses any
   `id > today` with "That puzzle isn't available yet…", and `resolvePuzzleId` no
   longer falls back to the earliest *upcoming* puzzle (returns null when nothing is
   on/before today).

## Files

- `src/components/call-sheet-archive.js` — `.preview` background → `var(--cs-card)`.
- `src/lib/puzzle-schedule.js` — dropped the upcoming-puzzle fallback.
- `src/components/call-sheet-app.js` — `_load` guards `id > todayKey()`.
- Tests — schedule unit (null on all-future), e2e `?puzzle=2099-01-01` → unavailable,
  e2e archive teaser dark in dark mode.

## Caveat

A static client can't fully trust the local clock, so this guards the *id* (the
`?puzzle=` URL hole), not clock manipulation — a tamper-proof gate would need a
backend. Noted in code and the brief.

## How to Verify

```bash
npm run dev
#   Archive in dark mode → the "Tomorrow — …🔒" teaser is dark-surfaced + legible.
#   Visit /index.html?puzzle=<a future date> → "isn't available yet", no board.
npm run check   # format, lint, coverage, build, 10 e2e — green
```

## Intent status

Both work items of **Archive Preview Fixes** complete.
