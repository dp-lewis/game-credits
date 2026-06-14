---
id: local-ci-gate
title: Local CI Parity Gate
status: completed
created: 2026-06-14T04:00:00Z
completed_at: 2026-06-14T03:56:35.001Z
---

# Intent: Local CI Parity Gate

## Goal

Add a single local "gate" command that runs the same checks as CI — including
`format:check` — so a formatting (or lint/test/build) failure is caught before
pushing, not after.

## Users

The developer (and the agent) — one command to run before committing, with the same
result CI would give.

## Problem

CI runs `format:check` (Prettier) before the deploy step, but there was no local
script bundling the checks. Running only `lint` locally let an unformatted commit
through, which failed CI's format check and silently blocked the deploy.

## Success Criteria

- A `check` npm script runs the CI checks in the same order: `format:check`, `lint`,
  `test:coverage` (with coverage), `build`, `test:e2e`.
- `npm run check` passes on the current tree.
- Nothing else changes (no behaviour, no formatting churn beyond what's needed).

## Constraints

- Mirror `.github/workflows/ci.yml` so local and CI can't drift.
- No new dependencies; reuse the existing scripts.

## Notes

Single low/autopilot work item (`add-check-gate-script`). Captures the lesson from the
board-reveal deploy: `format:check` must be part of the pre-commit gate.
