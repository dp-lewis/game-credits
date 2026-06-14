---
id: complement-accent-colours
title: Complement Submit and Lives Colours
intent: pastel-layout-refresh
complexity: low
mode: autopilot
status: completed
depends_on:
  - pastel-tile-theme
created: 2026-06-14T06:45:00Z
run_id: run-game-credits-021
completed_at: 2026-06-14T06:40:39.911Z
---

# Work Item: Complement Submit and Lives Colours

## Description

The saturated blue Submit button and bright red lives dots clash with the new
pastels. Retune them to complementary tones: a muted plum accent for the Submit
button (and selected ring / Archive link, which share `--cs-accent`), and a dusty
rose for the lives dots.

## Acceptance Criteria

- [ ] `--cs-accent` → `#6B5B95` (muted plum) — Submit, selected-swap ring, nav link
- [ ] New `--cs-lives` → `#D9756E` (dusty rose) for the "on" life dots
- [ ] Submit text (white) on the plum meets WCAG AA (≈5.6:1)
- [ ] Lives dots read clearly in light and dark mode and are distinct from the
      error red (kept for the lost-game state)
- [ ] No other behaviour/markup change; `npm run check` passes

## Technical Notes

`src/styles/global.css`: set `--cs-accent: #6b5b95`; add `--cs-lives: #d9756e`
(constant, not flipped in dark mode). `src/components/call-sheet-board.js`:
`.life.on { color: var(--cs-lives, #d9756e); }` (was `--cs-wrong`). Submit, ring,
and nav already read `--cs-accent`, so they move automatically. `--cs-wrong` stays
for the lost banner / error text. The dark-mode e2e asserts the submit surface sum
< 500 — plum `#6B5B95` = 347, still passes.

## Dependencies

- pastel-tile-theme
