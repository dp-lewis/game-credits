#!/usr/bin/env node
/**
 * Batch-generate a run of daily puzzles with a rotating theme.
 *
 * Fetches each cluster's casts once, then assembles one puzzle per day using an
 * interleaved theme order (styles rotate; no theme on back-to-back days; each
 * theme used evenly). Writes `public/puzzles/<date>.json`, updates the manifest,
 * and rebuilds `index.json`. Existing puzzles outside the range are left alone.
 *
 * Usage:
 *   node scripts/generate-schedule.js --start 2026-06-17 --days 90
 *
 * The TMDB key is read from the environment / .env and sent only to TMDB.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchFilmCast } from './lib/tmdb.js';
import { buildArchiveIndex } from './build-archive-index.js';
import { assemblePuzzle } from '../src/lib/curation.js';
import { validatePuzzle } from '../src/lib/puzzle-loader.js';
import { mulberry32, shuffle } from '../src/lib/shuffle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
if (!process.env.TMDB_API_KEY) {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    /* offline */
  }
}

const OUT = path.join(ROOT, 'public/puzzles');
const MANIFEST = path.join(OUT, 'manifest.json');

function parseArgs(argv) {
  const args = { start: '2026-06-17', days: 90, films: 3, groupSize: 4 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--start') args.start = argv[++i];
    else if (argv[i] === '--days') args.days = parseInt(argv[++i], 10);
  }
  return args;
}

/** Deterministic seed from the date string (FNV-1a, matches build-puzzles.js). */
function seedFromDate(date) {
  let h = 2166136261;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** N consecutive YYYY-MM-DD dates from `start` (UTC, no DST surprises). */
function dateRange(start, days) {
  const out = [];
  const d = new Date(`${start}T00:00:00Z`);
  for (let i = 0; i < days; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

/** Interleave cluster ids across styles so consecutive days vary in style. */
function interleavedOrder(clusters) {
  const styles = ['troupe', 'franchise', 'genre', 'shared-actor'];
  const buckets = styles.map((s) =>
    clusters.filter((c) => c.style === s).map((c) => c.id)
  );
  const order = [];
  let added = true;
  while (added) {
    added = false;
    for (const b of buckets) {
      if (b.length) {
        order.push(b.shift());
        added = true;
      }
    }
  }
  return order;
}

async function main() {
  if (!process.env.TMDB_API_KEY) {
    console.error('TMDB_API_KEY not set.');
    process.exit(1);
  }
  const args = parseArgs(process.argv.slice(2));
  const clusters = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'lib/tmdb-themes.json'), 'utf8')
  );
  const byId = new Map(clusters.map((c) => [c.id, c]));
  const order = interleavedOrder(clusters);
  const dates = dateRange(args.start, args.days);

  // Fetch each cluster's casts once (only clusters that appear in the rotation).
  const used = new Set(dates.map((_, i) => order[i % order.length]));
  console.log(`Fetching casts for ${used.size} clusters…`);
  const castCache = new Map();
  for (const id of used) {
    const cluster = byId.get(id);
    const withCast = await Promise.all(
      cluster.films.map((f) => fetchFilmCast(f))
    );
    castCache.set(id, withCast);
  }

  const written = [];
  const failures = [];
  const trioByTheme = new Map(); // theme → Set of sorted film-id trios (dup guard)
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const themeId = order[i % order.length];
    const cluster = byId.get(themeId);
    const pool = castCache.get(themeId);
    const seen = trioByTheme.get(themeId) ?? new Set();

    // Salt the seed until we get a trio this theme hasn't used yet; fall back to
    // the first assembled trio if the cluster is too small to avoid a repeat.
    let puzzle = null;
    let trio = null;
    let fallback = null;
    let fallbackTrio = null;
    for (let salt = 0; salt < 12; salt++) {
      const rng = mulberry32(seedFromDate(salt ? `${date}#${salt}` : date));
      let p = null;
      for (let attempt = 0; attempt < 25 && !p; attempt++) {
        p = assemblePuzzle(shuffle(pool, rng), {
          id: date,
          filmCount: args.films,
          groupSize: args.groupSize,
          rng,
        });
      }
      if (!p) continue;
      const t = p.films
        .map((f) => f.id)
        .sort()
        .join('+');
      if (!fallback) {
        fallback = p;
        fallbackTrio = t;
      }
      if (!seen.has(t)) {
        puzzle = p;
        trio = t;
        break;
      }
    }
    if (!puzzle && fallback) {
      puzzle = fallback;
      trio = fallbackTrio;
      console.warn(
        `  unavoidable dup trio within ${cluster.theme} on ${date} (small cluster)`
      );
    }
    if (!puzzle) {
      failures.push(`${date} (${themeId})`);
      continue;
    }
    puzzle.theme = cluster.theme;
    validatePuzzle(puzzle);

    if (!trioByTheme.has(themeId)) trioByTheme.set(themeId, new Set());
    trioByTheme.get(themeId).add(trio);

    fs.writeFileSync(
      path.join(OUT, `${date}.json`),
      JSON.stringify(puzzle, null, 2) + '\n'
    );
    written.push(date);
    if ((i + 1) % 15 === 0) console.log(`  …${i + 1}/${dates.length}`);
  }

  // Merge written dates into the manifest, sorted + de-duped.
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  } catch {
    manifest = [];
  }
  const all = [...new Set([...manifest, ...written])].sort();
  fs.writeFileSync(MANIFEST, JSON.stringify(all, null, 2) + '\n');

  // Rebuild the archive theme index.
  const index = buildArchiveIndex(OUT, MANIFEST);
  fs.writeFileSync(
    path.join(OUT, 'index.json'),
    JSON.stringify(index, null, 2) + '\n'
  );

  console.log(
    `\nWrote ${written.length} puzzles (${dates[0]} … ${dates[dates.length - 1]}).`
  );
  console.log(
    `Manifest now ${all.length} dates; index ${index.length} entries.`
  );
  if (failures.length) {
    console.log(`FAILED (${failures.length}): ${failures.join(', ')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
