---
id: game-board-ui
title: Game Board UI
intent: call-sheet
complexity: high
mode: confirm
status: pending
depends_on: [puzzle-schema-and-loader, game-logic-lib]
created: 2026-06-11T21:10:53Z
---

# Work Item: Game Board UI

## Description

Build the core playable experience as Lit Web Components: render the scrambled
ensemble cast and two film columns, let the player assign each actor to a film,
and submit. This is the heart of the game and the main UX decision point (tap-to-
assign vs drag-and-drop, how mistakes are surfaced, mobile-first layout). The
board wires together the loader (#2) and game logic (#3) into a working sort →
submit loop. Marked `confirm` so the interaction model is checkpointed before build.

## Acceptance Criteria

- [ ] `<call-sheet-board>` renders a loaded puzzle's actors (scrambled) and two film columns
- [ ] Player can assign every actor to Film A or Film B and change assignments before submitting
- [ ] Submit is disabled until all actors are assigned (or clearly handles partial state)
- [ ] On submit, the board grades via `src/lib` and reflects win/lose + mistake feedback
- [ ] Mobile-first responsive layout; usable with touch on a phone
- [ ] Components stay thin — no game rules embedded in the view
- [ ] Component/e2e test: a full sort-and-submit play-through against the fixture puzzle passes

## Technical Notes

Confirm the interaction model at the checkpoint (recommend tap-to-assign for
mobile-first simplicity, with drag as a possible enhancement). Use modern CSS
(custom properties, container/media queries) per coding standards. Components
under `src/components/`, tag prefix `call-sheet-`. Keep state reactive via Lit;
delegate all grading to `game-logic-lib`.

## Dependencies

- puzzle-schema-and-loader
- game-logic-lib
