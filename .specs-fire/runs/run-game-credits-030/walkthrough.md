---
run: run-game-credits-030
work_items: preview-gallery, preview-reveal-detail
intent: curator-preview
generated: 2026-06-17T11:33:00Z
mode: wide (autopilot)
---

# Implementation Walkthrough: Curator Preview Gallery

## Summary

A new **`/preview.html`** curator QA page: browse every scheduled day (future
included) and reveal any puzzle with its films, cast, theme, and traps. Read-only,
unlinked from the game, built entirely from existing pieces.

## What changed

- **`preview.html`** — new Vite multi-page entry (mirrors `archive.html`), `noindex`,
  added to `vite.config.js` `rollupOptions.input` (so it builds into `dist/` but isn't
  linked anywhere).
- **`src/preview-main.js`** — fetches `puzzles/index.json` (all dates + themes) and
  hands them to the component.
- **`src/components/call-sheet-preview.js`** — a spoiler banner + a chronological list
  of date · theme rows. Selecting a row `loadPuzzle(date)`s it and renders the board in
  static **`reveal`** mode (solved layout) plus a curator panel: theme, each film and
  its cast, and the **traps** (actors whose `alsoIn` is non-empty → which films they
  overlap) with a trap count.

## Why it's safe / simple

The puzzle JSON is already public, so an unlinked preview adds no exposure. It reuses
the board's existing reveal mode and the puzzle's `alsoIn` metadata — **no board or
schema changes**. Because it's its own page, it never goes through the play app's
future-guard, so it can show any date (incl. Sep 14, 2026).

## How to Verify

```bash
npm run dev    # open /preview.html → list of all days; click one → revealed board + traps
npm run check  # format, lint, coverage, build (emits preview.html), 12 e2e — green
```

## Intent status

Both work items of **Curator Preview Gallery** complete.
