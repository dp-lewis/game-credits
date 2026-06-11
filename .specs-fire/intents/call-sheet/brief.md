---
id: call-sheet
title: Call Sheet
status: in_progress
created: 2026-06-11T20:58:52Z
---

# Intent: Call Sheet

## Goal

Build **Call Sheet**, a daily web game where players sort a scrambled ensemble
cast back into the two films the actors came from. The mechanic is *Connections*-
style: players assign every actor to Film A or Film B and submit, with a limited
number of mistakes allowed. Solving produces a shareable result and feeds a daily
streak.

## Users

Casual daily-puzzle players and film buffs — the Wordle/Connections crowd who
enjoy a quick, shareable daily ritual. Secondary: an admin/curator who approves
each day's puzzle.

## Problem

Movie lovers lack a fresh, low-friction daily habit that rewards film knowledge.
Call Sheet combines trivia recall with a satisfying sorting mechanic and social
sharing, creating a repeatable daily ritual with built-in virality.

## Success Criteria

- A player can load the daily puzzle and see the scrambled ensemble cast.
- A player can assign every actor to one of two films and submit.
- The game grades the submission, enforces a limited-mistake budget, and shows a clear win/lose state.
- A shareable emoji-grid result can be generated from the outcome.
- The experience is mobile-first and plays smoothly in a phone browser.

## Constraints

- Platform: mobile-first responsive web app (browser, shareable daily link).
- Data: curated-from-TMDB, cached — TMDB sources real film/cast data; an admin/approval step locks each day's puzzle into a stored schedule.
- Game rules: Wordle/Connections-style limited mistakes (default 4), one puzzle per day, streak tracking, shareable result.
- MVP focus: ONE fully playable single daily puzzle (sort → submit → grade) to prove the fun. Daily rotation, streaks, and the TMDB curation pipeline come after.
- Tech stack: not finalized; leaning React/Next.js + TypeScript for a mobile-first web app. Decide in design phase.

## Notes

**Default puzzle shape (tunable):** ~8 actors, 4 per film; mistake budget of 4
(Connections convention).

**Scope sequencing:** MVP = playable single puzzle with hardcoded/sample data.
Post-MVP layers: (1) daily rotation + local streaks + share grid,
(2) TMDB-backed curation/caching pipeline with admin approval.

**Project setup note:** Project initialized via orchestrator `project-init`.
Workspace: greenfield / monolith. Autonomy bias: **autonomous**. Standards
generated in `.specs-fire/standards/` for a web-platform-first static stack
(HTML/CSS/vanilla JS + Lit, Vite build, static puzzle JSON, deploy to Dreamhost,
TMDB at build time only).
