---
id: game-logic-lib
title: Game Logic Library
intent: call-sheet
complexity: medium
mode: autopilot
status: pending
depends_on: [puzzle-schema-and-loader]
created: 2026-06-11T21:10:53Z
---

# Work Item: Game Logic Library

## Description

Implement the pure, framework-free game rules in `src/lib/`: representing a
player's assignment of actors to films, grading a submission against the answer
key, enforcing the Connections-style mistake budget, and computing win/lose
state. These are deterministic functions with no DOM or Lit dependency, so they
can be exhaustively unit-tested and reused by the UI.

## Acceptance Criteria

- [ ] `gradeSubmission(assignment, answerKey, maxMistakes)` returns wrong count, `solved`, and `lost`
- [ ] Win condition: solved when zero actors are misassigned
- [ ] Lose condition: lost when wrong count exceeds the mistake budget
- [ ] Functions are pure (no DOM/localStorage/network) and live in `src/lib/`
- [ ] Boundary cases covered: exactly-at-limit vs over-limit, all-correct, all-wrong
- [ ] Unit-test coverage on this module meets the lib threshold (≥90% per testing standards)

## Technical Notes

Decide and document the exact mistake-budget semantics (e.g. "submit reveals all
wrong" vs incremental). Default budget = 4. Keep the API small and composable so
both the board (#4) and result/share (#5) consume it. No randomness inside the
graded functions.

## Dependencies

- puzzle-schema-and-loader
