---
run: run-game-credits-019
work_item: add-check-gate-script
intent: local-ci-gate
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Add a `check` Script Mirroring CI

## Approach

Add one npm script, `check`, that chains the CI checks in the same order with `&&`
(so the first failure stops the gate). Run it to confirm it passes on the current
tree.

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `"check": "npm run format:check && npm run lint && npm run test:coverage && npm run build && npm run test:e2e"` |

## Tests

`npm run check` is itself the verification — it must pass end to end.

## Technical Details

Mirrors `.github/workflows/ci.yml` (Format check → Lint → Unit tests w/ coverage →
Build → E2E). e2e needs the Playwright chromium browser installed locally (one-time
`npx playwright install chromium`); CI installs it as a workflow step.

---
*Autopilot mode — plan recorded; no checkpoint.*
