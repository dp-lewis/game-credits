---
run: run-game-credits-006
work_item: dreamhost-deploy
intent: call-sheet
generated: 2026-06-13T10:16:00Z
mode: autopilot
---

# Implementation Walkthrough: dreamhost-deploy

## Summary

Set up automated deployment to Dreamhost, mirroring the user's blog: a GitHub
Actions workflow that runs checks, then `rsync`s the built `dist/` over SSH to
Dreamhost on every push to `main`. This is the final work item — Call Sheet is
now end-to-end shippable.

## Files Changed

### Created

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | `check` (format/lint/unit/e2e/build) + `deploy` (rsync to Dreamhost, push-to-main only) |

### Modified

| File | Changes |
|------|---------|
| `README.md` | Deployment section (CI flow, required secrets, manual fallback); fixed the stale v1 intro to describe the v2 hidden-groups game |

## How it works

```
push to main / PR
   └─ check: npm ci → format:check → lint → test:coverage → build
             → playwright install chromium → test:e2e
push to main (after check passes)
   └─ deploy: npm ci → build → configure SSH (key from secret, ssh-keyscan host)
             → rsync -az --delete dist/ → DEPLOY_USER@DEPLOY_HOST:DEPLOY_PATH
```

The build uses `base: './'`, so assets resolve at a domain root or a subpath with
no per-location change. `rsync --delete` keeps the remote an exact mirror of
`dist/`.

**Per-game subfolder (shared host).** `DEPLOY_PATH` is the *shared* web root all
games deploy under; this repo declares `DEPLOY_SUBDIR: call-sheet` (workflow env),
so it deploys to `<root>/call-sheet/`. The deploy step `mkdir -p`s that folder and
scopes `rsync --delete` to it — so deploying one game never deletes a sibling
game's files. Confirmed the built `index.html` uses relative `./assets/…` paths,
so subfolder serving needs no Vite change.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Deploy mechanism | GitHub Actions + rsync over SSH | Matches the user's blog exactly |
| Secret names | `DEPLOY_SSH_KEY/HOST/USER/PATH` | Same scheme the user already uses |
| Trigger | push to `main`, gated `needs: check` | Automated, but only after green checks |
| Host trust | `ssh-keyscan` + `StrictHostKeyChecking=yes` | Pin the host key; no MITM |
| Concurrency | `deploy-production`, no cancel | Avoid overlapping/interrupted uploads |

## Deviations from Plan

None. Also corrected the README intro (out of scope but a quick accuracy fix).

## Dependencies Added

| Package | Why |
|---------|-----|
| (none) | GitHub-hosted runner tooling only |

## How to Verify / Go Live

1. In this repo: **Settings → Secrets and variables → Actions**, add
   `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`.
2. Push to `main` (or re-run the workflow). The `check` job runs; on success the
   `deploy` job rsyncs `dist/` to Dreamhost.
3. Visit the site URL to confirm.

Manual alternative:
```bash
npm run build
rsync -az --delete dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"
```

## Ready for Review

- [x] Workflow valid; build deployable; tests/lint/format clean
- [x] Procedure + secrets documented
- [x] No secrets committed
- [x] Developer notes captured

## Developer Notes

The `check` job installs a Playwright browser for the e2e step (adds ~30–60s).
If CI minutes matter, the e2e step can be dropped from PRs and kept on `main`. The
deploy job is intentionally a near-copy of the blog's so it's familiar to operate;
if the game lands on a subpath, no Vite change is needed (relative base), only the
`DEPLOY_PATH` secret.
