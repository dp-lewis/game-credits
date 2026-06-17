---
id: preview-reveal-detail
title: Preview Reveal and Trap Detail
intent: curator-preview
complexity: medium
mode: autopilot
status: completed
depends_on:
  - preview-gallery
created: 2026-06-17T11:00:00Z
run_id: run-game-credits-030
completed_at: 2026-06-17T10:21:46.153Z
---

# Work Item: Preview Reveal and Trap Detail

## Description

When a date is selected in the gallery, fetch that puzzle and show the **revealed
board** plus a curator panel: theme, the three films with their casts, and the
**traps** (actors with `alsoIn`) and a trap count.

## Acceptance Criteria

- [ ] Selecting a date fetches `puzzles/<date>.json` and renders the board in static
      `reveal` mode (films + cast in their correct movies) — reusing the existing board
- [ ] A curator panel shows: theme, each film + its 4 actors, and the **traps** —
      actors whose `alsoIn` is non-empty, with which film(s) they overlap — plus a
      total trap count
- [ ] Works for any date including future (this page never uses the play-app guard)
- [ ] Switching dates updates the reveal + panel; back/native nav sane
- [ ] Legible light + dark; a small e2e loads `/preview.html`, selects a date, and
      asserts the revealed board + a trap is shown
- [ ] `npm run check` passes

## Technical Notes

`src/components/call-sheet-preview.js` (or a child component): on selection,
`loadPuzzle(date)` (or a plain fetch of `puzzles/<date>.json` + `validatePuzzle`) and
mount `<call-sheet-board .puzzle=${p} .reveal=${true}>`. Build the trap list from
`p.actors.filter(a => a.alsoIn?.length)` (name + solution film + `alsoIn` films), and
trap count = that length. Reuse `formatDateKey`. No changes to the board or schema —
`reveal` already renders the solution; traps come from the puzzle's `alsoIn` metadata.

## Dependencies

- preview-gallery
