---
run: run-game-credits-001
work_item: project-scaffold
intent: call-sheet
generated: 2026-06-12T08:10:00Z
mode: autopilot
---

# Implementation Walkthrough: Project Scaffold

## Summary

Stood up the Call Sheet project foundation: a Vite-built, web-platform-first
static site rendering a placeholder Lit `<call-sheet-app>` element, with the full
agreed directory structure and green tooling (ESLint flat config, Prettier,
Vitest unit tests, Playwright e2e). All verification gates pass and a clean static
`dist/` builds. No game logic yet — this is the verified base every later work
item stacks on.

## Structure Overview

```
.
├── index.html                     # Vite entry; mounts <call-sheet-app>
├── package.json                   # manifest: lit (prod) + tooling (dev)
├── vite.config.js                 # build + Vitest (happy-dom, coverage→src/lib)
├── eslint.config.js               # ESLint flat config
├── .prettierrc.json / .prettierignore
├── playwright.config.js           # e2e: boots vite dev server, chromium
├── .gitignore                     # node_modules, dist, .env, caches…
├── src/
│   ├── main.js                    # app entry (registers root component)
│   ├── components/call-sheet-app.js
│   ├── lib/.gitkeep               # pure logic lands here next
│   └── styles/global.css          # mobile-first tokens + base styles
├── public/puzzles/.gitkeep        # static per-day puzzle JSON
├── scripts/.gitkeep               # TMDB build script
└── tests/
    ├── unit/sanity.test.js
    └── e2e/smoke.spec.js
```

## Architecture

### Pattern Used

Static site, no server runtime. Lit Web Components for the view; pure ES modules
(reserved in `src/lib/`) for logic; Vite for dev/build. Matches
`system-architecture.md`.

### Layer Structure

```text
index.html → src/main.js → <call-sheet-app> (Lit)
                              └─ (later) board / result components
src/lib/  → pure logic (grading, loaders, state)   [reserved]
public/puzzles/ → static JSON content              [reserved]
```

## Files Changed

### Created

| File | Purpose |
|------|---------|
| `.gitignore` | Ignore node_modules, dist, `.env`/secrets, coverage, Playwright + TMDB cache |
| `index.html` | Vite entry; mounts `<call-sheet-app>` |
| `vite.config.js` | Vite build config + Vitest block (happy-dom; coverage scoped to `src/lib`) |
| `eslint.config.js` | ESLint flat config; browser+node globals; ignores FIRE dirs |
| `.prettierrc.json` / `.prettierignore` | Formatting config + ignore list |
| `playwright.config.js` | E2E config; boots vite dev server; chromium project |
| `src/main.js` | App entry; imports/registers the root component |
| `src/components/call-sheet-app.js` | Placeholder `<call-sheet-app>` Lit element |
| `src/styles/global.css` | Mobile-first global styles + design tokens |
| `src/lib/.gitkeep`, `public/puzzles/.gitkeep`, `scripts/.gitkeep` | Reserve structure dirs |
| `tests/unit/sanity.test.js` | Vitest runner + custom-element registration test |
| `tests/e2e/smoke.spec.js` | Playwright smoke: page renders title |

### Modified

| File | Changes |
|------|---------|
| `package.json` | Full manifest + scripts; Lit (prod) and Vite/Vitest/coverage/happy-dom/Playwright/ESLint/Prettier (dev); kept `yaml` devDep for FIRE scripts |
| `README.md` | Overview, requirements, scripts, structure, deploy notes |

## Key Implementation Details

### 1. Relocatable build for Dreamhost

`base: './'` in `vite.config.js` emits relative asset URLs, so the built site
works at a domain root or a subpath without rebuilds — important since the exact
Dreamhost location is still TBD.

### 2. Coverage pre-scoped to game logic

Vitest coverage targets `src/lib/**` only. The scaffold has no logic yet (so
coverage is n/a today), but the gate is wired so the 90% lib threshold from the
testing standards applies automatically from `game-logic-lib` onward.

### 3. Shadow-DOM-aware e2e

The Lit component renders into open shadow DOM; the Playwright smoke test uses a
role query (`getByRole('heading')`) which pierces it, confirming the real render
path rather than just markup presence.

## Security Considerations

| Concern | Approach |
|---------|----------|
| TMDB key leakage | `.gitignore` excludes `.env`/`.env.*`; no secrets in scaffold; key will be build-time only |
| Dependency surface | Minimal set, web-platform-first; 0 npm audit vulnerabilities at install |

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Seed `package.json` via `yaml` install | Keep `yaml` as devDependency | FIRE scripts parse `state.yaml`; folds cleanly into project tooling |
| Test DOM environment | happy-dom | Lightweight; lets unit tests touch custom elements without a browser |
| E2E web server | `vite` dev server | Fast boot for smoke; preview/build path documented in README |
| Installed major versions | Latest stable (Vite 8, Vitest 4, ESLint 10, Lit 3.3) | Node 24 supports them; recorded in test report (ahead of approximate pins in tech-stack.md) |

## Deviations from Plan

Minor: installed dependency majors are newer than the approximate pins in
`tech-stack.md` (Vite/Vitest/ESLint a major ahead). Behavior matches the plan;
flagged in the test report for an optional standards refresh.

## Dependencies Added

| Package | Why Needed |
|---------|------------|
| `lit` | Web Components UI layer (prod) |
| `vite` | Dev server + static build |
| `vitest`, `@vitest/coverage-v8` | Unit testing + coverage |
| `happy-dom` | DOM environment for unit/component tests |
| `@playwright/test` | E2E browser testing |
| `eslint`, `@eslint/js`, `globals` | Linting (flat config) |
| `prettier` | Formatting |
| `yaml` (devDep) | FIRE harness scripts parse `state.yaml` |

## How to Verify

1. **Install & dev server**
   ```bash
   npm install && npm run dev
   ```
   Expected: Vite serves http://localhost:5173 showing the "Call Sheet" title + tagline.

2. **Unit tests**
   ```bash
   npm test
   ```
   Expected: 2 passing tests.

3. **Production build**
   ```bash
   npm run build
   ```
   Expected: `dist/` with `index.html`, hashed `assets/`, and copied `puzzles/`.

4. **Lint & format**
   ```bash
   npm run lint && npm run format:check
   ```
   Expected: both clean (exit 0).

5. **E2E smoke**
   ```bash
   npx playwright install chromium && npm run test:e2e
   ```
   Expected: 1 passing test.

## Test Coverage

- Tests added: 3 (2 unit + 1 e2e)
- Coverage: n/a (no `src/lib/` code yet; infra in place)
- Status: passing

## Ready for Review

- [x] All acceptance criteria met
- [x] Tests passing
- [x] No critical issues
- [x] Documentation updated (README)
- [x] Developer notes captured

## Developer Notes

The project is intentionally framework-light. When building `game-board-ui`,
consume the reserved `--cs-accent` token and add component tests under
`tests/` using happy-dom. `package.json` carries `yaml` purely for the FIRE
tooling — leave it in devDependencies. For Dreamhost, the `dreamhost-deploy`
work item still needs your blog's deploy method and the target domain/subpath
(to confirm `base`).

---
*Generated by specs.md - fabriqa.ai FIRE Flow Run run-game-credits-001*
