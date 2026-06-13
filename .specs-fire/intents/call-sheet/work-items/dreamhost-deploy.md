---
id: dreamhost-deploy
title: Dreamhost Deploy
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - project-scaffold
created: 2026-06-11T21:10:53Z
run_id: run-game-credits-006
completed_at: 2026-06-13T10:16:14.097Z
---

# Work Item: Dreamhost Deploy

## Description

Establish the build-and-deploy path to Dreamhost shared hosting: produce the
static `dist/` and publish it using the user's existing blog deploy method
(rsync/SFTP/git — details to be provided), plus document the process so it's
repeatable. No server runtime on Dreamhost; this is a static upload.

## Acceptance Criteria

- [ ] `npm run build` output (`dist/`) deploys to Dreamhost and the site loads at its URL
- [ ] Static assets (puzzle JSON under `public/puzzles/`) are served correctly with proper paths
- [ ] A documented, repeatable deploy procedure exists in the README
- [ ] Base path / asset URLs are correct for the Dreamhost location (subdomain or subdir)
- [ ] No secrets are included in the deployed artifact

## Technical Notes

**Blocked on input:** needs the user's Dreamhost deploy method (the approach used
for their blog) and the target domain/path. Likely rsync or SFTP of `dist/`.
Confirm whether the game lives at a domain root or subpath so Vite `base` is set
correctly. Optionally script the deploy as an npm script. CI automation is
out of scope here (can be a later item).

## Dependencies

- project-scaffold
