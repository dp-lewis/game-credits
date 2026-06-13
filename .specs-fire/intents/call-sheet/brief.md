---
id: call-sheet
title: Call Sheet
status: completed
created: 2026-06-11T20:58:52Z
completed_at: 2026-06-13T10:16:14.110Z
---

# Intent: Call Sheet

## Goal

Build **Call Sheet**, a daily web game where players sort a scrambled ensemble
cast back into the films the actors came from. The mechanic is *Connections*-
style **deduction**: a board of 16 actors must be partitioned into **4 films**
(4 actors each). Crucially, some actors genuinely appeared in **more than one** of
the four films — these crossovers are traps. Each actor has exactly one *solution*
film, and there is exactly **one valid partition** that completes all four groups;
players must find the right combination. A limited mistake budget applies. Solving
produces a shareable result and feeds a daily streak.

## Users

Casual daily-puzzle players and film buffs — the Wordle/Connections crowd who
enjoy a quick, shareable daily ritual. Secondary: an admin/curator who approves
each day's puzzle.

## Problem

Movie lovers lack a fresh, low-friction daily habit that rewards film knowledge.
Call Sheet combines trivia recall with a satisfying sorting mechanic and social
sharing, creating a repeatable daily ritual with built-in virality.

## Success Criteria

- A player can load the daily puzzle and see the scrambled 16-actor ensemble.
- A player can assign every actor to one of the four films and submit.
- Crossover actors (in 2+ of the four films) act as traps; only each actor's solution film is correct, and there is a single valid partition.
- The game grades the submission, enforces a limited-mistake budget, and shows a clear win/lose state with completed groups.
- A shareable emoji-grid result can be generated from the outcome.
- The experience is mobile-first and plays smoothly in a phone browser.

## Constraints

- Platform: mobile-first responsive web app (browser, shareable daily link).
- Data: curated-from-TMDB, cached — TMDB sources real film/cast data; an admin/approval step locks each day's puzzle into a stored schedule.
- Game rules: 4 films / 16 actors (4 per film), Connections-style limited mistakes (default 4), one puzzle per day, streak tracking, shareable result.
- Crossover constraint: each actor has a single solution film; the curated puzzle must have a unique valid partition despite overlaps.
- MVP focus: v1 (2-film) playable puzzle is COMPLETE. v2 evolves it to the 4-film crossover mechanic. Daily rotation, streaks, and the TMDB curation pipeline follow.
- Tech stack: web-platform-first static site — HTML/CSS/vanilla JS + Lit, Vite build, static puzzle JSON, deploy to Dreamhost, TMDB at build time only.

## Notes

**Default puzzle shape (tunable):** v2 = 4 films × 4 actors (16 total); mistake
budget of 4 (Connections convention). v1 was 2 films × 4 actors (8).

**Mechanic evolution (2026-06-12):** v1 shipped a 2-film sort (a coin-flip once
films are known — too easy). v2 adds depth: 4 films with cross-cast actors whose
overlaps are deliberate traps, and a single unique solution partition. Confirmed
design: Connections-style 4×4; only the solution film is correct; 16 actors.

**Scope sequencing:** v1 MVP (2-film) complete. Next: v2 mechanic
(multi-film schema → board redesign → 4-group result/share). Then daily rotation
+ streaks, and the TMDB curation pipeline (which must verify a unique solution).

**Project setup note:** Project initialized via orchestrator `project-init`.
Workspace: greenfield / monolith. Autonomy bias: **autonomous**. Standards
generated in `.specs-fire/standards/` for a web-platform-first static stack
(HTML/CSS/vanilla JS + Lit, Vite build, static puzzle JSON, deploy to Dreamhost,
TMDB at build time only).
