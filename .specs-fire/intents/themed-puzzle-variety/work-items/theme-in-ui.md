---
id: theme-in-ui
title: Show Theme in the UI
intent: themed-puzzle-variety
complexity: low
mode: autopilot
status: completed
depends_on:
  - theme-schema-and-generator
created: 2026-06-14T08:20:00Z
run_id: run-game-credits-024
completed_at: 2026-06-14T09:18:50.653Z
---

# Work Item: Show Theme in the UI

## Description

Surface the puzzle's theme up-front as flavour — a small label above the board (e.g.
"Today's theme: Heist crews"). Degrade gracefully when a puzzle has no theme.

## Acceptance Criteria

- [ ] When the loaded puzzle has a `theme`, show it above the board as a small label
- [ ] No theme → nothing rendered (older/theme-less puzzles unaffected)
- [ ] Styled to fit the pastel layout (muted, tight, doesn't compete with the board)
- [ ] Visible in light and dark mode; reads on the practice/locked/reveal states too
- [ ] Optional: show the theme on each archive row; component/e2e tests cover the label
- [ ] `npm run check` passes

## Technical Notes

`src/components/call-sheet-app.js` (pass `theme` / render the label near the tagline)
or a tiny presentational piece in `call-sheet-board.js`. Keep it a plain element with
muted styling consistent with `.tagline`. If surfacing in the archive, thread `theme`
through the archive list helper/component. Add a small e2e assertion that a known
themed puzzle shows its label.

## Dependencies

- theme-schema-and-generator
