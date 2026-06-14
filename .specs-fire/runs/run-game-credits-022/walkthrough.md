---
run: run-game-credits-022
work_item: tighten-page-layout
intent: pastel-layout-refresh
generated: 2026-06-14T07:01:00Z
mode: autopilot
---

# Implementation Walkthrough: Tighten Page Layout

## Summary

Trimmed the page chrome so the board leads: the big "Call Sheet" title is gone, the
tagline stays as a small lead-in, and the Archive link moved to the bottom.

## What changed

- `src/components/call-sheet-app.js` — `render()` drops the `<h1>`; the `.tagline`
  is now the top element; the `.nav` Archive link renders after the board. CSS:
  removed the dead `h1` rule, flipped `.nav` margin to the top (for bottom
  placement), and trimmed the host top padding (`2rem` → `1.25rem`).
- `tests/e2e/smoke.spec.js` — asserts the tagline is visible instead of the removed
  "Call Sheet" heading.

The document `<title>` is untouched, so the browser tab still says "Call Sheet".

## How to Verify

```bash
npm run dev    # tagline → board → Archive link at the bottom; tighter top
npm run check  # format, lint, coverage, build, e2e — green
```

## Ready for Review

- [x] Title removed, tagline kept, Archive at the bottom, spacing tightened
- [x] `npm run check` green

## Next

`lock-completed-replays` is the last item in this intent.
