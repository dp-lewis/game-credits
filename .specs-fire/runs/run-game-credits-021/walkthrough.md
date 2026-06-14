---
run: run-game-credits-021
work_item: complement-accent-colours
intent: pastel-layout-refresh
generated: 2026-06-14T06:51:00Z
mode: autopilot
---

# Implementation Walkthrough: Complement Submit and Lives Colours

## Summary

Swapped the two accents that clashed with the pastels:

- **Submit button** (and the selected-swap ring + Archive link, which share
  `--cs-accent`) → **muted plum `#6B5B95`** — a deeper sibling of the lavender,
  distinct from the green tick, bridging the warm and cool pastels. White text on it
  is ~5.6:1 (AA).
- **Lives dots** → **dusty rose `#D9756E`** (`--cs-lives`) — a deeper echo of the
  coral tile, soft but clearly "lives," and distinct from the error red.

## What changed

- `src/styles/global.css` — `--cs-accent: #6b5b95`; added `--cs-lives: #d9756e`
  (both constant, so they don't flip in dark mode).
- `src/components/call-sheet-board.js` — `.life.on` now uses `var(--cs-lives)`
  instead of `--cs-wrong`.

`--cs-wrong` (red) is kept for the lost-game banner / error text, so a lost game
still reads clearly without the lives dots looking like an alarm during play.

## How to Verify

```bash
npm run dev    # Submit is plum, lives are dusty rose — both sit with the pastels
npm run check  # format, lint, coverage, build, e2e — green
```

## Ready for Review

- [x] Plum Submit/accent; dusty-rose lives
- [x] AA contrast on the Submit; dark-mode e2e still green
- [x] `npm run check` green

## Next

`tighten-page-layout` then `lock-completed-replays` remain in this intent.
