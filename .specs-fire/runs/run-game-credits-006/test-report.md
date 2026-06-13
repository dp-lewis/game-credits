---
run: run-game-credits-006
work_item: dreamhost-deploy
intent: call-sheet
generated: 2026-06-13T10:15:00Z
status: passed
---

# Test Report: dreamhost-deploy

## Summary

| Category | Result |
|----------|--------|
| Workflow YAML valid | ✅ parses; jobs `check` + `deploy`; `deploy` needs `check` |
| Build produces deployable `dist/` | ✅ (relative `base: './'`) |
| Unit/component tests | ✅ 138 passing |
| Lint / Format | ✅ clean |

This item is CI/deploy configuration, so verification is workflow validation +
the existing suite rather than new tests.

## Acceptance Criteria Validation

- ✅ **`npm run build` output deploys; documented, repeatable procedure** — `.github/workflows/ci.yml` (check → deploy via rsync over SSH on push to main); README "Deployment" documents it + a manual rsync fallback
- ✅ **Static assets served with correct paths** — `base: './'` emits relative URLs; works at a domain root or a subpath
- ✅ **Base path correct for the Dreamhost location** — relative base needs no per-location change
- ✅ **No secrets in the deployed artifact / repo** — workflow reads `DEPLOY_*` from the `secrets` context; nothing committed
- ⏳ **Site loads at its URL** — requires the four repo secrets + a push to `main` (the user's one-time setup); documented

## What was built

- `.github/workflows/ci.yml` — mirrors the blog: a `check` job (install → format
  → lint → unit+coverage → build → Playwright e2e) and a `deploy` job
  (`needs: check`, push-to-main only) that builds and `rsync -az --delete dist/`
  to `${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/` over SSH.
- README "Deployment" — the CI flow, the four required secrets, and a manual
  deploy fallback.

## Required secrets (user one-time setup)

`DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` — set under
Settings → Secrets and variables → Actions.

## Notes

- Also corrected a stale v1 description in the README intro (now reflects the v2
  hidden-groups game).
- The deploy job runs on push to `main`; without the secrets set the rsync step
  fails (expected) — so add secrets before relying on auto-deploy.

## Ready for Completion

- [x] Workflow valid; build deployable; tests/lint/format clean
- [x] Procedure documented + secrets listed
- [x] No secrets committed
- [ ] Live deploy confirmed — pending user secrets + push (out of this run's control)
