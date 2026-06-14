---
run: run-game-credits-019
work_item: add-check-gate-script
intent: local-ci-gate
generated: 2026-06-14T04:02:00Z
mode: autopilot
---

# Implementation Walkthrough: Add a `check` Script Mirroring CI

## Summary

Added a single `npm run check` gate that runs the same checks as CI, in the same
order, with `format:check` first — so a formatting/lint/test/build/e2e failure shows
up locally before a push (the gap that silently blocked the last two deploys).

## What changed

`package.json` — one script:

```json
"check": "npm run format:check && npm run lint && npm run test:coverage && npm run build && npm run test:e2e"
```

Mirrors `.github/workflows/ci.yml` (Format check → Lint → Unit+coverage → Build →
E2E). `&&` stops at the first failure, like CI.

## How to Verify

```bash
npm run check   # runs the whole gate; must be green before committing
```

(E2E needs the Playwright chromium browser locally: one-time `npx playwright install chromium`.)

## Ready for Review

- [x] `check` added, mirrors CI order/commands
- [x] `npm run check` passes on the current tree
- [x] One-line change; no behaviour/formatting churn

## Intent status

`local-ci-gate` — single work item complete. Going forward, run `npm run check`
before committing.
