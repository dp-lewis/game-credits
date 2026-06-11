---
id: project-scaffold
title: Project Scaffold
intent: call-sheet
complexity: medium
mode: autopilot
status: pending
depends_on: []
created: 2026-06-11T21:10:53Z
---

# Work Item: Project Scaffold

## Description

Set up the web-platform-first project skeleton: a Vite project using Lit for Web
Components, the agreed directory structure, tooling (ESLint, Prettier), test
runners (Vitest for unit/component, Playwright for e2e), and npm scripts. This is
the foundation every other work item builds on. No game logic yet — just a
running dev server rendering a placeholder and green tooling.

## Acceptance Criteria

- [ ] `npm install` then `npm run dev` starts Vite and serves a placeholder page
- [ ] Lit is installed and a trivial `<call-sheet-app>` custom element renders
- [ ] Directory structure exists: `src/components/`, `src/lib/`, `src/styles/`, `public/puzzles/`, `scripts/`, `tests/`
- [ ] `npm run build` produces a static `dist/` (no server runtime required)
- [ ] ESLint + Prettier configured; `npm run lint` and format pass on the scaffold
- [ ] Vitest runs (`npm test`) with at least one passing sample test
- [ ] Playwright configured with one passing smoke test (page loads)
- [ ] `index.html` is the entry; ES modules with explicit `.js` extensions

## Technical Notes

Stack per `.specs-fire/standards/tech-stack.md`: Vite ^5, Lit ^3, npm, ESLint ^9,
Prettier ^3, Vitest ^2, Playwright ^1, Node 20+. Keep dependencies minimal
(web-platform-first). Output must be plain static assets suitable for Dreamhost.
No TMDB key or secrets introduced here.

## Dependencies

(none)
