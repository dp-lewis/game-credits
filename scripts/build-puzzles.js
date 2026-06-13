#!/usr/bin/env node
/**
 * Call Sheet puzzle curation CLI (build-time only).
 *
 * Sources film/cast data (offline sample, or live TMDB when a key is set),
 * assembles a crossover puzzle with a VERIFIED unique solution, previews it,
 * asks for approval, then writes `public/puzzles/<date>.json` and appends the
 * date to the manifest.
 *
 * Usage:
 *   node scripts/build-puzzles.js --date 2026-06-15 --films 3 --group-size 4 --offline
 *   TMDB_API_KEY=… node scripts/build-puzzles.js --date 2026-06-15
 *
 * Flags: --date <YYYY-MM-DD> (required), --films <n=3>, --group-size <n=4>,
 *        --offline, --dry-run, --yes, --out <dir>, --manifest <file>.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

import { assemblePuzzle } from '../src/lib/curation.js';
import { validatePuzzle } from '../src/lib/puzzle-loader.js';
import { mulberry32, shuffle } from '../src/lib/shuffle.js';
import { isValidDateKey } from '../src/lib/date-key.js';
import { fetchFilmCast } from './lib/tmdb.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load a gitignored .env as a fallback so TMDB_API_KEY needn't be exported each
// time. An explicit environment variable still takes precedence.
if (!process.env.TMDB_API_KEY) {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    // No .env — fine (offline mode, or the key is already in the environment).
  }
}

function parseArgs(argv) {
  const args = {
    films: 3,
    groupSize: 4,
    offline: false,
    dryRun: false,
    yes: false,
    out: path.join(ROOT, 'public/puzzles'),
    manifest: path.join(ROOT, 'public/puzzles/manifest.json'),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--date') args.date = argv[++i];
    else if (a === '--films') args.films = parseInt(argv[++i], 10);
    else if (a === '--group-size') args.groupSize = parseInt(argv[++i], 10);
    else if (a === '--offline') args.offline = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--yes' || a === '-y') args.yes = true;
    else if (a === '--out') args.out = path.resolve(argv[++i]);
    else if (a === '--manifest') args.manifest = path.resolve(argv[++i]);
  }
  return args;
}

/** Deterministic seed from the date string. */
function seedFromDate(date) {
  let h = 2166136261;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

async function loadPool(args) {
  if (args.offline) {
    const file = path.join(__dirname, 'fixtures/sample-casts.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const films = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'lib/tmdb-films.json'), 'utf8')
  );
  console.log(`Fetching ${films.length} casts from TMDB…`);
  return Promise.all(films.map((f) => fetchFilmCast(f)));
}

function previewPuzzle(puzzle) {
  const byFilm = new Map(puzzle.films.map((f) => [f.id, []]));
  for (const a of puzzle.actors) {
    const trap = a.alsoIn?.length ? ` (also in ${a.alsoIn.join(', ')})` : '';
    byFilm.get(a.filmId).push(a.name + trap);
  }
  console.log(
    `\nPuzzle ${puzzle.id} — ${puzzle.films.length} films, ${puzzle.actors.length} actors\n`
  );
  for (const f of puzzle.films) {
    console.log(`  ${f.title}${f.year ? ` (${f.year})` : ''}`);
    for (const name of byFilm.get(f.id)) console.log(`    - ${name}`);
  }
  const traps = puzzle.actors.filter((a) => a.alsoIn?.length).length;
  console.log(`\n  Crossover traps: ${traps}\n`);
}

function writeManifest(manifestPath, dateId) {
  let ids;
  try {
    ids = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    ids = [];
  }
  if (!Array.isArray(ids)) ids = [];
  if (!ids.includes(dateId)) ids.push(dateId);
  ids.sort();
  fs.writeFileSync(manifestPath, JSON.stringify(ids) + '\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.date || !isValidDateKey(args.date)) {
    console.error(
      'Error: --date <YYYY-MM-DD> is required and must be a valid date.'
    );
    process.exit(1);
  }

  const pool = await loadPool(args);
  const rng = mulberry32(seedFromDate(args.date));

  // Try a few film selections (shuffled by the date seed) until one assembles.
  let puzzle = null;
  for (let attempt = 0; attempt < 25 && !puzzle; attempt++) {
    const shuffledPool = shuffle(pool, rng);
    puzzle = assemblePuzzle(shuffledPool, {
      id: args.date,
      filmCount: args.films,
      groupSize: args.groupSize,
      rng,
    });
  }

  if (!puzzle) {
    console.error(
      'Error: could not assemble a unique puzzle from the available data.'
    );
    process.exit(1);
  }

  // Sanity: the engine output must satisfy the runtime schema.
  validatePuzzle(puzzle);
  previewPuzzle(puzzle);

  if (args.dryRun) {
    console.log('Dry run — nothing written.');
    return;
  }

  if (!args.yes) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = (
      await rl.question(
        `Write ${args.date}.json and update the manifest? [y/N] `
      )
    )
      .trim()
      .toLowerCase();
    rl.close();
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Aborted — nothing written.');
      return;
    }
  }

  fs.mkdirSync(args.out, { recursive: true });
  const outFile = path.join(args.out, `${args.date}.json`);
  fs.writeFileSync(outFile, JSON.stringify(puzzle, null, 2) + '\n');
  writeManifest(args.manifest, args.date);
  console.log(`Wrote ${outFile} and updated the manifest.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
