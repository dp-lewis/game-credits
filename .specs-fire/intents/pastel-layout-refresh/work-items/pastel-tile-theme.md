---
id: pastel-tile-theme
title: Pastel Solid Tiles
intent: pastel-layout-refresh
complexity: medium
mode: autopilot
status: completed
depends_on: []
created: 2026-06-14T04:10:00Z
run_id: run-game-credits-020
completed_at: 2026-06-14T06:35:28.791Z
---

# Work Item: Pastel Solid Tiles

## Description

Recolour the board to the pastel palette and make the tiles solid and borderless.
Actor chips **and** the Movie headers (including the unsolved "Movie 1") fill with
their column's solid pastel, with one constant dark text colour and no borders.

## Acceptance Criteria

- [ ] `--cs-group-0/1/2` = `#FFC6C2` / `#FAE9DA` / `#C3E0DD`; add a 4th pastel for
      `--cs-group-3` (four-film fixture only)
- [ ] A constant dark **tile text** token (e.g. `--cs-tile-fg: #1a1a1a`) that does
      **not** flip in dark mode; every tile's text uses it
- [ ] Actor chips: solid pastel background (their column colour), **no border**, dark
      text; the selected-swap ring and the ✓ tick stay clearly visible
- [ ] Movie headers: **all** solid pastel (solved and unsolved), no border, dark text
      (remove the white-text-on-solved styling)
- [ ] Tiles look the same in light and dark mode (pastel + dark text); only page
      chrome (bg/fg/muted) flips
- [ ] Contrast: dark text on each pastel meets WCAG AA+ (verified AAA — pastels used
      as given); if any failed, the pastel would be darkened, not the text
- [ ] `tests/e2e/dark-mode.spec.js` updated to assert dark-text-on-pastel legibility
      (dark text + light pastel surface) instead of "surface is dark"
- [ ] Full suite + e2e green; `npm run check` passes

## Technical Notes

`src/styles/global.css` (group tokens + new `--cs-tile-fg`, not overridden in the
dark-mode block), `src/components/call-sheet-actor.js` (replace card bg + border +
inset accent with solid `g0..g3` background, dark text, keep `.selected` ring and the
`.lock` ✓), `src/components/call-sheet-board.js` (`.head` solid pastel for all,
borderless, dark text; drop `.head.solved` white-text). Submit button, lives, and
banners are unchanged. The dark-mode regression test currently asserts the header
surface is dark — flip it to assert the pastel surface + dark text (contrast holds in
dark mode).

## Dependencies

(none)
