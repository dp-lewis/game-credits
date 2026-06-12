# Call Sheet

A daily web game: sort a scrambled ensemble cast back into the **two films** the
actors came from. _Connections_-style — assign every actor to Film A or Film B,
with a limited number of mistakes. One puzzle a day, shareable result, streaks.

Built **web-platform-first**: HTML, modern CSS, and vanilla JavaScript (ES
modules) with [Lit](https://lit.dev) Web Components. No server runtime — the daily
puzzle is precomputed static JSON, player state lives in `localStorage`, and the
site deploys as static files to Dreamhost. [Vite](https://vite.dev) is the dev/build
tool; [TMDB](https://www.themoviedb.org) is used **only at build time** to generate
puzzles (its API key never reaches the client).

## Requirements

- Node.js 20+ (developed on Node 24)
- npm 10+

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server (http://localhost:5173)
```

## Scripts

| Script                  | What it does                                |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                   |
| `npm run build`         | Build the static site into `dist/`          |
| `npm run preview`       | Preview the production build locally        |
| `npm test`              | Run unit tests (Vitest) once                |
| `npm run test:watch`    | Run unit tests in watch mode                |
| `npm run test:coverage` | Unit tests with coverage (gates `src/lib/`) |
| `npm run test:e2e`      | Run end-to-end smoke tests (Playwright)     |
| `npm run lint`          | Lint with ESLint                            |
| `npm run format`        | Format with Prettier                        |
| `npm run format:check`  | Check formatting without writing            |

> **E2E browsers:** the first Playwright run needs browser binaries:
> `npx playwright install chromium`.

## Project structure

```
.
├── index.html              # Vite entry; mounts <call-sheet-app>
├── src/
│   ├── main.js             # app entry
│   ├── components/         # Lit Web Components (<call-sheet-*>)
│   ├── lib/                # pure, framework-free logic (grading, loaders, state)
│   └── styles/             # global CSS + design tokens
├── public/
│   └── puzzles/            # static per-day puzzle JSON
├── scripts/                # build-time only (TMDB curation → puzzle JSON)
└── tests/
    ├── unit/               # Vitest
    └── e2e/                # Playwright
```

## Deployment

The site is a static bundle (`npm run build` → `dist/`) uploaded to **Dreamhost**
shared hosting. The exact deploy procedure is set up in the `dreamhost-deploy`
work item. `base: './'` in `vite.config.js` keeps asset paths relative so the
game can live at a domain root or a subpath.

## Development process

This project is planned and executed with the **FIRE** flow (see `.specs-fire/`):
intents → work items → runs, each run producing a plan, tests, review, and
walkthrough.
