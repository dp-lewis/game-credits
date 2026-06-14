---
run: run-game-credits-020
work_item: pastel-tile-theme
intent: pastel-layout-refresh
generated: 2026-06-14T06:41:00Z
mode: autopilot
---

# Implementation Walkthrough: Pastel Solid Tiles

## Summary

The board now uses a soft pastel palette with solid, borderless tiles:

- **Movie 1 / 2 / 3 → `#FFC6C2` / `#FAE9DA` / `#C3E0DD`.**
- Actor chips **and** the Movie headers (including the unsolved "Movie 1") fill with
  their column's solid pastel — no borders.
- One **constant dark text** colour on every tile (`#1a1a1a`), which stays dark in
  light *and* dark mode, so the tiles look the same in both and always read clearly.

## What changed

- **`src/styles/global.css`** — `--cs-group-0/1/2` set to the three pastels;
  `--cs-group-3` to a light lavender (only the four-film test fixture uses a 4th
  colour); new `--cs-tile-fg: #1a1a1a` that is **not** overridden in the dark-mode
  block, so tile text never flips to light.
- **`call-sheet-actor.js`** — chips: solid `var(--cs-group-N)` background, `border:
  none`, `color: var(--cs-tile-fg)`. The selected-swap ring and the ✓ tick stay.
- **`call-sheet-board.js`** — headers: solid pastel for every column (solved and
  unsolved), borderless, dark text. Removed the old white-text-on-solved styling.
- **`tests/e2e/dark-mode.spec.js`** — the regression now asserts the pastel model:
  in dark mode a Movie header is a light pastel surface (RGB sum > 600) with dark
  text (sum < 200) — i.e. legible — and Submit stays a dark surface.

## Why this is accessible

The three pastels are light; dark `#1a1a1a` text on each clears WCAG AAA (~9:1). The
rule was: if a pastel ever failed contrast, darken the *pastel*, not the text — none
needed darkening, so the given hexes are used as-is. The e2e proves the dark-on-light
contrast holds even in dark mode.

## How to Verify

```bash
npm run dev    # board tiles are solid pastels with dark text, no borders, both schemes
npm run check  # format, lint, coverage, build, e2e — all green
```

## Ready for Review

- [x] Pastel palette; solid borderless chips + headers; constant dark text
- [x] Same look in light/dark; contrast verified (AAA), pastels unchanged
- [x] `npm run check` green

## Next

`tighten-page-layout` (remove title, archive to bottom) then `lock-completed-replays`.
