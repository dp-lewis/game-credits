---
id: call-sheet-fixes
title: Call Sheet — Fixes
status: completed
created: 2026-06-13T11:58:54Z
completed_at: 2026-06-13T20:37:40.888Z
---

# Intent: Call Sheet — Fixes

## Goal

Fix three reported issues in the live Call Sheet game: dark-mode colour contrast
on the group + submit buttons, inconsistent desktop grid layout when actor names
wrap, and the daily rotation serving a 4-film puzzle when it should always be
three. Each fix ships with a regression check where practical.

## Users

Players of the live game (especially dark-mode and desktop users), plus the
maintainer (the rotation guard prevents future non-3-film puzzles).

## Problem

Maintenance: the shipped game has accessibility (contrast), layout (wrap), and
content-rotation (film count) defects that degrade the experience.

## Success Criteria

- Group buttons and Submit meet WCAG AA contrast in dark mode.
- The desktop actor grid stays aligned when long names wrap.
- The live rotation serves only 3-film puzzles; today resolves to a 3-film puzzle.
- A guard test fails if a non-3-film puzzle enters the manifest.
- No existing tests broken; full suite + e2e green.

## Constraints

- Web-platform-first; CSS-only fixes preferred for #1/#2.
- The 2-film and 4-film fixtures retain testing value — relocate to `tests/fixtures/`, don't delete.
- Visual fixes (#1/#2) verified via Playwright (dark mode / long names), not pixel unit tests.

## Notes

Confirmed with user: hard guard on #3 (CI-failing test), keep old fixtures for
tests. Decomposed into `fix-dark-mode-contrast`, `fix-grid-wrap-layout`,
`enforce-three-film-rotation`.
