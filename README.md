# Call Sheet

A daily web game: sort a scrambled ensemble cast back into the films they came
from. _Connections_-style deduction — the film titles are hidden, so you group the
actors into the right films (crossover actors are traps), solving a group to
reveal its film. A limited mistake budget, one puzzle a day, shareable result,
and streaks.

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

| Script                  | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                    |
| `npm run build`         | Build the static site into `dist/`           |
| `npm run preview`       | Preview the production build locally         |
| `npm test`              | Run unit tests (Vitest) once                 |
| `npm run test:watch`    | Run unit tests in watch mode                 |
| `npm run test:coverage` | Unit tests with coverage (gates `src/lib/`)  |
| `npm run test:e2e`      | Run end-to-end smoke tests (Playwright)      |
| `npm run build:puzzle`  | Generate a puzzle (see "Generating puzzles") |
| `npm run lint`          | Lint with ESLint                             |
| `npm run format`        | Format with Prettier                         |
| `npm run format:check`  | Check formatting without writing             |

> **E2E browsers:** the first Playwright run needs browser binaries:
> `npx playwright install chromium`.

## Generating puzzles

Puzzles are produced by a build-time script that assembles a crossover puzzle and
**verifies it has a unique solution** before writing it (and appending the date to
`public/puzzles/manifest.json`).

```bash
# Offline — uses sample cast data, no API key needed
npm run build:puzzle -- --date 2026-06-20 --films 3 --group-size 4 --offline --dry-run

# Live — sources real casts from TMDB (key via env, never written to disk/output)
TMDB_API_KEY=… npm run build:puzzle -- --date 2026-06-20 --films 3
```

Drop `--dry-run` to write the puzzle (you'll be asked to approve the preview;
`--yes` skips the prompt). See `docs/puzzle-schema.md` for details and the
uniqueness algorithm.

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

The site is a static bundle (`npm run build` → `dist/`) deployed to **Dreamhost**
shared hosting by GitHub Actions (`.github/workflows/ci.yml`). On every push to
`main`, the **check** job runs format/lint/unit/e2e/build; if it passes, the
**deploy** job builds and `rsync`s `dist/` over SSH into this game's own
subfolder on Dreamhost.

**Multiple games on one host.** `DEPLOY_PATH` is the _shared_ web root that all
your games deploy under; each game repo declares its own folder via
`DEPLOY_SUBDIR` in `.github/workflows/ci.yml` (this game: `call-sheet`). The site
is served from `<root>/call-sheet/`, and `rsync --delete` is scoped to that
subfolder, so deploying one game never touches the others.

`base: './'` in `vite.config.js` keeps asset paths relative (and the puzzle
`fetch`es are relative too), so serving from a subfolder needs no changes.

### One-time setup — repository secrets

Add these under **Settings → Secrets and variables → Actions** in this repo
(same scheme as the blog):

| Secret           | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| `DEPLOY_SSH_KEY` | Private SSH key authorised on the Dreamhost account                  |
| `DEPLOY_HOST`    | Dreamhost host (e.g. `iad1-shared-xxxx.dreamhost.com`)               |
| `DEPLOY_USER`    | Dreamhost SSH username                                               |
| `DEPLOY_PATH`    | Shared web root all games deploy under (e.g. the domain's directory) |

To change this game's folder, edit `DEPLOY_SUBDIR` in the workflow. Once the
secrets are set, the next push to `main` deploys automatically. To deploy
manually instead:

```bash
npm run build
rsync -az --delete dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/call-sheet/"
```

## Development process

This project is planned and executed with the **FIRE** flow (see `.specs-fire/`):
intents → work items → runs, each run producing a plan, tests, review, and
walkthrough.
