---
id: board-visual-tweaks
title: Board Visual Tweaks
status: completed
created: 2026-06-16T09:30:00Z
completed_at: 2026-06-16T09:46:09Z
---

# Intent: Board Visual Tweaks

## Goal

Three small visual/copy refinements to the game board, synced from the
"Call Sheet — Game UI" Figma file:

1. **Clearer call-to-action** — rename the primary action button from "Submit" to
   **"Check Answer"**.
2. **Lives below the grid** — move the lives indicator from above the column
   headers to **below the actor grid**, immediately above the action button.
3. **Taller actor tiles** — increase the actor chip `min-height` from `3rem` to
   `5rem` (48px → 80px) for a more tactile, legible board.

## Users

Players — a call-to-action that names what the button does (grade the board), a
lives counter that sits next to the action it gates, and larger tiles that read
comfortably even when an actor's name wraps to two lines.

## Problem

The board's copy and layout had drifted from the latest Figma design: "Submit"
undersold the grading action, the lives sat far from the button at the top of the
board, and 48px tiles felt cramped for the two-line names that wrapping produces.

## Success Criteria

- The playing-state action button reads **"Check Answer"**.
- Lives render **below the grid**, above the action button; the static-reveal view
  still hides lives (the `_status === 'revealed'` guard is unchanged).
- Actor chips are `5rem` min-height; Movie headers (`2.5rem`) and the action button
  (`3rem`) are unchanged.
- Chips stay equal height when names wrap (grid-layout e2e still passes).
- Full suite + e2e green (e2e button selectors updated to the new label).

## Constraints

- Web-platform-first, Lit Web Components; styles live in each component's
  `static styles`. Presentation/copy only — **no game-logic changes**.
- Keep the static-reveal lives guard and the equal-height grid behaviour.

## Notes

**Back-fill.** These changes were implemented and verified (full suite + e2e green)
as a direct sync from the Figma design file *Call Sheet — Game UI*
(file key `oxV8uolihQ3uG2wsUGvNrj`) before this intent was recorded; the intent and
work-items document what was built so the FIRE ledger stays consistent.

The Figma "Call Sheet" H1 removal observed during the sync is **out of scope** — it
was already delivered by `tighten-page-layout` under `pastel-layout-refresh`.

Decomposed into `rename-submit-check-answer`, `lives-below-grid`, and
`taller-actor-tiles` (all low complexity → autopilot under the `autonomous` bias).
Executed as `run-game-credits-028`.
