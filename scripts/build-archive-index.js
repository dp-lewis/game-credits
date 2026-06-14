#!/usr/bin/env node
/**
 * Rebuild `public/puzzles/index.json` from the manifest + individual puzzle files.
 *
 * Usage: node scripts/build-archive-index.js [--out <dir>] [--manifest <file>]
 *
 * The index is `[{ date: "YYYY-MM-DD", theme: "..." }]`, sorted by date, and covers
 * every manifest date that has a corresponding puzzle file. Dates with no puzzle
 * file (or with no theme field) are skipped with a warning.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    out: path.join(ROOT, 'public/puzzles'),
    manifest: path.join(ROOT, 'public/puzzles/manifest.json'),
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') args.out = path.resolve(argv[++i]);
    else if (argv[i] === '--manifest') args.manifest = path.resolve(argv[++i]);
  }
  return args;
}

export function buildArchiveIndex(puzzleDir, manifestPath) {
  let ids;
  try {
    ids = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    ids = [];
  }
  if (!Array.isArray(ids)) ids = [];

  const entries = [];
  for (const date of ids) {
    const puzzleFile = path.join(puzzleDir, `${date}.json`);
    let puzzle;
    try {
      puzzle = JSON.parse(fs.readFileSync(puzzleFile, 'utf8'));
    } catch {
      console.warn(`Warning: no puzzle file for ${date} — skipping.`);
      continue;
    }
    if (!puzzle.theme) {
      console.warn(`Warning: puzzle ${date} has no theme — skipping.`);
      continue;
    }
    entries.push({ date, theme: puzzle.theme });
  }

  entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return entries;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const entries = buildArchiveIndex(args.out, args.manifest);
  const indexPath = path.join(args.out, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(entries, null, 2) + '\n');
  console.log(`Wrote ${indexPath} (${entries.length} entries).`);
}

main();
