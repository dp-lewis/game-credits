---
id: call-sheet-board-redesign
title: Call Sheet — Board Redesign
status: completed
created: 2026-06-13T22:01:01Z
completed_at: 2026-06-14T02:40:46.008Z
---

# Intent: Call Sheet — Board Redesign

## Goal

Make the board more tactile and its feedback clearer:

1. **3-column grid (one column per group).** A 3×4 grid that is **always full**
   (the 12 actors start shuffled across the three columns). You **select an actor,
   then tap another cell to swap** the two — animated. A column is a group, so
   arranging actors into columns is the assignment. Submit when each column holds
   the right four.
2. **Per-group progress instead of "One away…".** On submit, each group shows how
   many it got right (e.g. `Grp1 4/4 ✓ · Grp2 3/4 · Grp3 1/4`) — precise and
   actionable, replacing the vague single hint.

## Users

Players — a clearer, more physical way to sort, and feedback that tells you
exactly which group is close rather than a vague "one away."

## Problem

The current board (3 group buttons + a 4×3 pool, brush assignment) is functional
but less tactile, and "One away…" doesn't say which group or how close.

## Success Criteria

- 3-column always-full grid; columns map to the three groups (labelled).
- Select an actor, tap another cell → the two swap, with a smooth animation.
- Keyboard-accessible (select + swap) and honours `prefers-reduced-motion`.
- Submit grades by column (`gradeGroups`, unchanged) and shows per-group `n/4`.
- The "One away…" single hint is replaced by per-group progress.
- No existing game logic changed; full suite + e2e green.

## Constraints

- Web-platform-first: animation via the Web Animations API (FLIP), no animation
  dependency. Lit Web Components.
- Reuse `gradeGroups` and the existing assignment model (actor → group); this is
  presentation + interaction, not new puzzle logic.

## Notes

Confirmed interaction: **select-then-swap** (two explicit taps; no active-group
state) — both cells are chosen, so there's no ambiguity about which actor is
displaced. Decomposed into `column-board-redesign` (high, confirm — design
checkpoint on animation + a11y) and `per-group-progress` (medium).
