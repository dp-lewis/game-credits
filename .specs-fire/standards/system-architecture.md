# System Architecture

## Overview

Call Sheet is a static, client-only daily game. All gameplay runs in the browser
against precomputed per-day puzzle JSON. A separate offline build step sources
data from TMDB and emits those JSON files. There is no production server: the
built site is uploaded as static files to Dreamhost.

## System Context

A player opens the site, the client fetches today's puzzle JSON, the player sorts
the ensemble cast into the two films and submits, and the client grades it
locally and tracks streaks in `localStorage`. Puzzle content is produced ahead of
time by a curator-run build script using the TMDB API.

### Context Diagram

```
        build time (offline)                 runtime (browser, static)
  ┌──────────────────────────┐        ┌──────────────────────────────────┐
  │ Curator                  │        │ Player                           │
  │   │                      │        │   │                              │
  │   ▼                      │        │   ▼                              │
  │ build-puzzles.js ──▶ TMDB│        │ Static site (HTML/CSS/Lit JS)    │
  │   │   (API key, env)     │        │   │  fetch ▼                     │
  │   ▼                      │        │   │   public/puzzles/DATE.json   │
  │ public/puzzles/*.json    │ ─────▶ │   ▼                              │
  └──────────────────────────┘ deploy │ localStorage (streaks/progress)  │
            rsync/SFTP to Dreamhost   └──────────────────────────────────┘
```

### Users

- **Player**: Plays the daily puzzle in a phone or desktop browser
- **Curator/Admin**: Runs the build script to source and approve daily puzzles

### External Systems

- **TMDB API**: Source of film and cast data (build time only; key never shipped)
- **Dreamhost**: Static hosting for the built site and puzzle JSON

## Architecture Pattern

**Pattern**: Static site / JAMstack-without-the-serverless — prebuilt content + client-side logic
**Rationale**: Matches web-platform-first goals and Dreamhost shared hosting; no runtime backend to operate or secure

## Component Architecture

### Components

#### UI Components (Lit)

- **Purpose**: Render the board, actors, film columns, submit, result/share
- **Responsibilities**: Presentation and interaction only (thin)
- **Dependencies**: `lit`, `src/lib/*`

#### Game Logic (src/lib)

- **Purpose**: Pure rules — grading, mistake budget, win/lose, share-grid
- **Responsibilities**: Deterministic, framework-free, fully unit-tested
- **Dependencies**: none

#### Puzzle Loader

- **Purpose**: Fetch + validate the day's puzzle JSON
- **Responsibilities**: Resolve date key, fetch static JSON, validate shape
- **Dependencies**: `fetch`

#### Progress Store

- **Purpose**: Persist streaks and per-day completion
- **Responsibilities**: Read/write `localStorage`
- **Dependencies**: `localStorage`

#### Puzzle Build Script (scripts/build-puzzles.js)

- **Purpose**: Offline TMDB curation → static puzzle JSON
- **Responsibilities**: Query TMDB, pick overlapping casts, cache, emit JSON
- **Dependencies**: Node 20+, TMDB API key (env)

### Component Diagram

```
<call-sheet-app>
  ├─ <call-sheet-board>
  │     ├─ <call-sheet-actor> (xN)
  │     └─ <call-sheet-film-column> (x2)
  ├─ <call-sheet-result>  ── share grid
  └─ uses: lib/grading, lib/puzzle-loader, lib/progress-store
```

## Data Flow

The client resolves the current date, fetches `public/puzzles/<date>.json`,
validates it, and renders the board. On submit, pure logic grades the assignment
against the answer key, enforces the mistake budget, and the result component
renders win/lose plus a shareable emoji grid. Progress and streaks persist to
`localStorage`.

```
date -> loader.fetch(json) -> validate -> board render
board submit -> grading(assignment, answerKey, maxMistakes)
            -> result (win/lose + share grid) -> progress-store(localStorage)
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Markup | HTML5 | Document structure |
| Styling | Modern CSS (mobile-first) | Presentation |
| UI | Lit Web Components | Reactive components |
| Logic | Vanilla ES modules | Game rules, loaders, state |
| Persistence | localStorage | Streaks/progress |
| Content | Static JSON | Per-day puzzles |
| Build | Vite | Dev server + static build |
| Curation | Node script + TMDB API | Generate puzzle JSON |
| Hosting | Dreamhost (static) | Serve built site |

## Non-Functional Requirements

### Performance

- **First load**: Fast on mobile — minimal JS (Lit ~5KB), static assets
- **Interaction**: Instant sort/submit (all client-side)

### Security

- TMDB API key never reaches the client; used only at build time
- No backend attack surface (static hosting)
- Validate puzzle JSON shape before use

### Scalability

Static files scale trivially via hosting/CDN; no runtime compute. Adding days =
adding JSON files. No per-user server state.

## Constraints

- Must deploy as static files to Dreamhost shared hosting (no Node runtime in prod)
- Web-platform-first: minimal, light dependencies
- MVP = one fully playable single puzzle (sort → submit → grade)

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend | None (static) | Dreamhost shared hosting + web-platform-first |
| UI framework | Lit | Tiny, standards-based Web Components |
| Build tool | Vite | Light dev/build, static output |
| Puzzle data | Precomputed static JSON | No runtime API; TMDB key stays server/build side |
| Player state | localStorage | No backend; streaks are per-device |
| TMDB usage | Build-time only | Keep secrets out of the client |

---
*Generated by specs.md - fabriqa.ai FIRE Flow*
