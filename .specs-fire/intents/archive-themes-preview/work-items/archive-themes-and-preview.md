---
id: archive-themes-and-preview
title: Archive Themed Rows and Tomorrow Teaser
intent: archive-themes-preview
complexity: medium
mode: autopilot
status: completed
depends_on:
  - archive-theme-index
created: 2026-06-14T10:00:00Z
run_id: run-game-credits-025
completed_at: 2026-06-14T14:29:23.473Z
---

# Work Item: Archive Themed Rows and Tomorrow Teaser

## Description

Consume the theme index in the archive: show each row's theme, and add a single
locked **tomorrow** teaser (date + theme, not playable) at the top.

## Acceptance Criteria

- [ ] Each archive row shows its **theme** (muted, alongside date + status); rows still
      link to play (today → daily, past → `?puzzle=` practice)
- [ ] A locked **tomorrow** teaser renders at the top: tomorrow's date + theme + a 🔒,
      **not** a play link; styled distinctly (clearly "coming soon")
- [ ] Only today+1 is previewed; later future dates stay hidden; graceful when there's
      no tomorrow puzzle or no theme
- [ ] Native back-button behaviour unchanged (still real `<a>` links for playable rows)
- [ ] Pure helper for the tomorrow lookup is unit-tested; e2e asserts a themed row +
      the locked teaser
- [ ] `npm run check` passes

## Technical Notes

`src/lib/date-key.js` (add `nextDateKey(key)` → today+1), `src/lib/archive.js`
(`tomorrowEntry(indexEntries, todayKey)` → `{date, theme}` | null; enrich the played
list with theme by joining on the index), `src/archive-main.js` (fetch `index.json`,
build themed entries + the tomorrow preview, pass both to the component),
`src/components/call-sheet-archive.js` (render `entry.theme`; render a non-link
`.preview` row with 🔒 when a `preview` prop is set). Tests:
`tests/unit/archive.test.js` (tomorrow helper), `tests/e2e/archive.spec.js` (theme +
teaser visible).

## Dependencies

- archive-theme-index
