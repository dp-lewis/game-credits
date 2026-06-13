---
id: curation-actor-prominence
title: Curation — Actor Prominence
intent: call-sheet
complexity: medium
mode: confirm
status: completed
depends_on:
  - tmdb-curation-script
created: 2026-06-13T11:26:13Z
run_id: run-game-credits-007
completed_at: 2026-06-13T11:28:35.893Z
---

# Work Item: Curation — Actor Prominence

## Description

Improve generated-puzzle **quality** by biasing actor selection toward
recognizable, top-billed leads instead of random cast members. Live TMDB
generation produced technically-valid but unfun puzzles full of deep-cut
character actors (e.g. Ron Dean, Monique Gabriela Curnen) because the assembler
chose anchors at random from the cast. Rank by **billing order** so the leads are
chosen.

> Retrofitted into FIRE after the fact: the change was implemented as a direct
> edit, then captured as this work item + run so the project history is complete.

## Acceptance Criteria

- [ ] TMDB client preserves each actor's billing `order` and fetches a deeper pool (top ~20)
- [ ] The assembler picks the most prominent (lowest billing order) anchors per film
- [ ] Crossover traps are preferred by prominence; injecting a trap drops the *least* prominent anchor (never a lead)
- [ ] Falls back to the existing deterministic shuffle when no billing data is present (offline sample + existing tests unaffected)
- [ ] Generated puzzles remain schema-valid and uniquely solvable
- [ ] Tests cover prominence-based anchor selection, prominent-trap injection, and the TMDB `order` mapping
- [ ] Live dry-run shows recognizable casts

## Technical Notes

Decision (checkpoint): rank by **billing order** (TMDB `order`, lower = more
prominent) rather than popularity, for era-stable recognizability. Prominence
ordering reduces within-trio variety but maximizes recognizability; variety comes
from date-seeded film selection. Pure logic stays in `src/lib/curation.js`; the
`order` field is assembly-only and never reaches the puzzle JSON.

## Dependencies

- tmdb-curation-script
