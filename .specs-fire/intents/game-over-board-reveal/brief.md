---
id: game-over-board-reveal
title: Game-Over Board Reveal
status: completed
created: 2026-06-14T03:10:00Z
completed_at: 2026-06-14T03:40:31.326Z
---

# Intent: Game-Over Board Reveal

## Goal

Reuse the board itself to reveal the result when the game ends, instead of a
separate section below it.

- **Win** — the board celebrates: every chip gets a tick.
- **Loss / partial** — after a ~1s beat, the board reveals every movie title in the
  headers and **animates the misplaced actors into their correct movie columns**
  (reusing the FLIP move). Actors the player had in the right movie show a **tick**;
  the ones that had to move are left **blank** — so the board reads as the true
  solution, annotated with what you got right.

The standalone result card (spoiler-free share grid + "Copy result" + streak line)
is **removed entirely**; the board is the whole end-game payoff.

## Users

Players — a more satisfying, legible finish that shows exactly which actors they
placed correctly, right where they were working, rather than a separate readout.

## Problem

Today the end-game lives below the board: the board shows a banner (and, on a loss,
a plain text answer list) and a separate `<call-sheet-result>` card shows the share
grid + streak. It's disconnected from where the player was just working and doesn't
clearly show *which* picks were right.

## Success Criteria

- On a win, the board reveals all movie titles and every chip shows a tick.
- On a loss/partial, after a short delay the board reveals titles and moves the
  misplaced actors into their correct movies (animated), ticking the ones the player
  had right and leaving the movers blank.
- The reveal ends with the board showing the full, correct solution.
- The separate result/share/streak card is gone; nothing renders below the board.
- `prefers-reduced-motion` is honoured (no delay/animation — jump to the revealed
  state); the board is non-interactive after game over.
- Streak is still tracked in storage (just not shown); full suite + e2e green.

## Constraints

- Web-platform-first: reuse the existing FLIP (Web Animations API), no new deps.
  Lit Web Components.
- Reuse `gradeGroups`/answer key to know each actor's correct movie and which picks
  were right; this is presentation, not new puzzle logic.
- Player placements aren't persisted, so the **already-played restore** view shows
  the revealed solution (titles + cast in place) **without** per-actor ticks, plus a
  short "already played" line.

## Notes

Decided with the user: **remove the share/streak card entirely** (board reveal
only). Streak tracking stays in `progress-store`; the `share-grid` lib is retained
(pure + tested) but no longer used by the UI. Decomposed into
`board-result-reveal` (the in-board reveal mechanics + a static reveal entry point,
high/confirm — animation sequencing checkpoint) and `retire-result-card` (remove the
card, wire the app + restore view, update tests; medium).
