---
id: multi-film-board
title: Multi-Film Board (v2)
intent: call-sheet
complexity: high
mode: confirm
status: completed
depends_on:
  - multi-film-schema
  - game-board-ui
  - game-logic-lib
created: 2026-06-12T09:34:28Z
run_id: run-game-credits-003
completed_at: 2026-06-12T09:58:26.873Z
---

# Work Item: Multi-Film Board (v2)

## Description

Redesign the board for the 4-film / 16-actor crossover puzzle. The v1 per-actor
two-button toggle does not scale to 4 films × 16 actors, so this needs a new,
mobile-first interaction (Connections-style) and a 4-colour film scheme. The lives
loop carries over; correct actors lock and groups complete. Marked `confirm` so
the interaction model is checkpointed before build.

## Acceptance Criteria

- [ ] Board renders N films (4) with distinct colours/legend and a scrambled 16-actor pool
- [ ] A clear, touch-friendly interaction assigns each actor to one of the four films and allows reassignment before submit (model agreed at checkpoint)
- [ ] Submit gated until every actor is assigned; grades via `src/lib`
- [ ] Correct actors lock; a completed film/group is visibly indicated; wrong submit spends a life; win when all groups complete, lose at zero lives (answers revealed)
- [ ] Any new pure logic (e.g. per-film completion / groups-complete helper) lives in `src/lib` with tests
- [ ] Works for both N=4 (v2 puzzle) and N=2 (v1 puzzle) — board generalises over film count
- [ ] Component + e2e tests: full 4-film play-through to a win; loss path covered

## Technical Notes

`gradeSubmission`/`buildAnswerKey` already generalise over film count — reuse
them. Decide the interaction at the checkpoint; candidates: (a) tap actor → tap
film slot, (b) select a film then tap its actors, (c) per-actor 4-way selector.
Recommend (a)/(b) for 16 items over a cramped 4-way toggle. Reuse the lives
indicator and `game-over` event contract so `multi-film-result-share` and any
streak work consume it unchanged. Keep components thin; colours via CSS custom
properties (`--cs-film-0..3`).

## Dependencies

- multi-film-schema
- game-board-ui
- game-logic-lib
