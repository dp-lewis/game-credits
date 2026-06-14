---
id: add-check-gate-script
title: Add a check Script Mirroring CI
intent: local-ci-gate
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-14T04:00:00Z
run_id: run-game-credits-019
completed_at: 2026-06-14T03:56:34.993Z
---

# Work Item: Add a `check` Script Mirroring CI

## Description

Add a `check` npm script that runs the same gate CI runs, **with `format:check`
first**, so formatting/lint/test/build/e2e failures surface locally before a push.

## Acceptance Criteria

- [ ] `package.json` gains `"check"` running, in order: `format:check`, `lint`,
      `test:coverage`, `build`, `test:e2e`
- [ ] The order/commands match `.github/workflows/ci.yml`
- [ ] `npm run check` passes on the current tree
- [ ] No other changes (no dependency, no unrelated formatting churn)

## Technical Notes

`package.json` scripts. Add:
`"check": "npm run format:check && npm run lint && npm run test:coverage && npm run build && npm run test:e2e"`.
`&&` short-circuits so the first failure stops the gate (like CI). e2e needs the
Playwright browser already installed locally (CI installs it as a step; locally it's a
one-time `npx playwright install chromium`).

## Dependencies

(none)
