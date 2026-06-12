---
run: run-game-credits-001
work_item: project-scaffold
intent: call-sheet
mode: autopilot
checkpoint: none
approved_at: n/a (autopilot — 0 checkpoints)
---

# Implementation Plan: Project Scaffold

## Approach

Stand up the web-platform-first foundation per the project standards: a Vite
project rendering a trivial Lit `<call-sheet-app>` element, the agreed directory
structure, and green tooling (ESLint flat config, Prettier, Vitest unit + a DOM
environment, Playwright e2e), wired through npm scripts. No game logic yet — the
goal is a running dev server, a clean static `dist/` build, and passing tests so
every later work item stacks on a verified base.

`package.json` already exists as a seed (it carries `yaml`, the devDependency the
FIRE harness scripts need). This run extends it into the full project manifest,
keeping `yaml` as a tooling devDependency. `.gitignore` is already in place
(node_modules, dist, .env, coverage, Playwright output, TMDB cache).

## Files to Create

| File | Purpose |
|------|---------|
| `index.html` | Vite entry; mounts `<call-sheet-app>` |
| `vite.config.js` | Vite config (root, build output, Vitest test block) |
| `eslint.config.js` | ESLint 9 flat config (browser + node globals, Lit-friendly) |
| `.prettierrc.json` | Prettier config (2-space, single quotes, semicolons) |
| `.prettierignore` | Exclude build/deps/artifacts from formatting |
| `playwright.config.js` | Playwright e2e config (webServer = vite preview) |
| `src/main.js` | App entry — imports the root component |
| `src/components/call-sheet-app.js` | Placeholder `<call-sheet-app>` Lit element |
| `src/styles/global.css` | Mobile-first global styles + design tokens stub |
| `src/lib/.gitkeep` | Reserve pure-logic dir (grading/loaders land here later) |
| `public/puzzles/.gitkeep` | Reserve static per-day puzzle JSON dir |
| `scripts/.gitkeep` | Reserve TMDB build-script dir |
| `tests/unit/sanity.test.js` | One passing Vitest unit test (proves runner) |
| `tests/e2e/smoke.spec.js` | One Playwright smoke test (page loads, app renders) |
| `README.md` (replace) | Setup, scripts, structure, deploy-later notes |

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add name/type/scripts + Lit (prod) and Vite/Vitest/Playwright/ESLint/Prettier/happy-dom (dev); keep `yaml` devDep |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/sanity.test.js` | Vitest runner smoke (trivial assertion) |
| `tests/e2e/smoke.spec.js` | App page loads and renders the title |

## Technical Details

- **Stack/versions**: install current stable of each dep on Node 24. Tech-stack.md
  pins approximate majors (Lit ^3, Vite ^5+); actual installed versions recorded
  in the test report and `package.json`.
- **ESLint 9 flat config**: `eslint.config.js` with browser + node globals via
  `globals`; `prefer-const`, `eqeqeq`, `no-unused-vars` as errors per coding standards.
- **Vitest**: configured inside `vite.config.js` `test` block, `environment:
  'happy-dom'` so future component tests work; sanity test is environment-agnostic.
- **Playwright**: `webServer` runs `npm run preview` against the built/served app;
  single Chromium project. Browser binaries are downloaded on demand
  (`npx playwright install chromium`); if this sandbox blocks the download, the
  e2e config + test still ship and the unit suite remains the enforced gate — this
  will be called out explicitly in the test report rather than silently skipped.
- **Verification**: `npm run lint`, `npm run format:check`, `npm test`, and
  `npm run build` (must emit `dist/`) all run before completion.

---
*Plan recorded (autopilot — no checkpoint). Execution follows.*
