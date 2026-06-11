---
id: result-and-share
title: Result and Share
intent: call-sheet
complexity: medium
mode: autopilot
status: pending
depends_on: [game-logic-lib, game-board-ui]
created: 2026-06-11T21:10:53Z
---

# Work Item: Result and Share

## Description

After a puzzle is solved or lost, present a result view and generate a shareable,
spoiler-free emoji-grid summary (Wordle/Connections-style) that the player can
copy. This completes the MVP loop (sort → submit → grade → share) and is the
virality hook.

## Acceptance Criteria

- [ ] A result view shows clear win/lose state and the player's outcome (e.g. mistakes used)
- [ ] A shareable text/emoji grid is generated representing the result without revealing answers
- [ ] "Copy result" copies the share text to the clipboard
- [ ] Share text includes a title/identifier and is readable when pasted into social/chat
- [ ] Unit test covers share-grid generation for win and lose cases

## Technical Notes

Keep share-grid generation as a pure function in `src/lib/` (testable, no DOM).
Spoiler-free: encode correctness pattern, not the actual film assignments. Render
the view as a Lit component (`<call-sheet-result>`). Streak text can be appended
later by #7 (streak-tracking) — keep the generator composable.

## Dependencies

- game-logic-lib
- game-board-ui
