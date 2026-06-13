---
run: run-game-credits-006
work_item: dreamhost-deploy
intent: call-sheet
mode: autopilot
---

# Implementation Plan: dreamhost-deploy

## Approach

Mirror the user's blog deploy: a GitHub Actions workflow with a **check** job
(install → format → lint → unit → build → e2e) and a **deploy** job that, on push
to `main`, builds and **rsyncs `dist/` over SSH to Dreamhost** using the same
secret names (`DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`).
Adapt the steps to this project's npm scripts. The build already uses
`base: './'`, so assets resolve at a domain root or a subpath.

## Files to Create

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI checks + rsync-to-Dreamhost deploy on push to main |

## Files to Modify

| File | Purpose |
|------|---------|
| `README.md` | Replace the placeholder Deployment section with the CI flow + required secrets |

## Workflow shape

- **check** (push + PR): `npm ci`, `format:check`, `lint`, `test:coverage`,
  `build`, then `npx playwright install --with-deps chromium` + `test:e2e`.
- **deploy** (push to main only, `needs: check`): `npm ci` → `build` → configure
  SSH from `DEPLOY_SSH_KEY` + `ssh-keyscan` `DEPLOY_HOST` → `rsync -az --delete`
  `dist/` to `${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/`.

## Required repo secrets (documented for the user to set)

| Secret | Value |
|--------|-------|
| `DEPLOY_SSH_KEY` | Private SSH key authorised on Dreamhost |
| `DEPLOY_HOST` | Dreamhost host |
| `DEPLOY_USER` | SSH user |
| `DEPLOY_PATH` | Target directory on Dreamhost for this site |

## Verification

- `npm run build` produces a deployable `dist/` (already verified across runs).
- `.github/workflows/ci.yml` parses as valid YAML (checked with the `yaml` lib).
- The live deploy itself requires the secrets above + a push to `main` (the
  user's step); documented clearly. No secrets committed.

## Notes

- Deploy runs automatically on push to `main` after `check` passes — matching the
  blog's pattern. The first push after secrets are set performs the first deploy.
- The Playwright e2e step downloads a browser in CI (`--with-deps chromium`).

---
*Plan recorded (autopilot — no checkpoint). Execution follows.*
