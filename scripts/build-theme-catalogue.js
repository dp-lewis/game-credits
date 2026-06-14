#!/usr/bin/env node
/**
 * Build-time only: resolve TMDB ids for the themed clusters, fetch their casts,
 * VERIFY each cluster can assemble a unique 3x4 trio with >=1 trap, and write
 * `scripts/lib/tmdb-themes.json` (+ a flat `tmdb-films.json` for back-compat).
 *
 * Usage:
 *   node scripts/build-theme-catalogue.js            # verify + report only
 *   node scripts/build-theme-catalogue.js --write    # also write the catalogue
 *
 * The TMDB key is read from the environment / .env and sent only to TMDB.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchFilmCast } from './lib/tmdb.js';
import { assemblePuzzle } from '../src/lib/curation.js';
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
const KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
const WRITE = process.argv.includes('--write');

// Cluster roster (titles + years; ids resolved from TMDB below).
const CLUSTERS = [
  [
    'nolan',
    'Christopher Nolan',
    'troupe',
    [
      ['Inception', 2010],
      ['The Dark Knight', 2008],
      ['Interstellar', 2014],
      ['Oppenheimer', 2023],
      ['The Prestige', 2006],
      ['Dunkirk', 2017],
    ],
  ],
  [
    'wes-anderson',
    'Wes Anderson',
    'troupe',
    [
      ['The Grand Budapest Hotel', 2014],
      ['The Royal Tenenbaums', 2001],
      ['Moonrise Kingdom', 2012],
      ['The Life Aquatic with Steve Zissou', 2004],
      ['Asteroid City', 2023],
      ['The French Dispatch', 2021],
    ],
  ],
  [
    'tarantino',
    'Quentin Tarantino',
    'troupe',
    [
      ['Pulp Fiction', 1994],
      ['Django Unchained', 2012],
      ['Inglourious Basterds', 2009],
      ['Once Upon a Time in Hollywood', 2019],
      ['The Hateful Eight', 2015],
      ['Kill Bill: Vol. 1', 2003],
    ],
  ],
  [
    'scorsese',
    'Martin Scorsese',
    'troupe',
    [
      ['Goodfellas', 1990],
      ['The Departed', 2006],
      ['The Wolf of Wall Street', 2013],
      ['Casino', 1995],
      ['The Irishman', 2019],
      ['Gangs of New York', 2002],
    ],
  ],
  [
    'coen',
    'The Coen Brothers',
    'troupe',
    [
      ['Fargo', 1996],
      ['The Big Lebowski', 1998],
      ['No Country for Old Men', 2007],
      ['Burn After Reading', 2008],
      ['Hail, Caesar!', 2016],
      ['O Brother, Where Art Thou?', 2000],
    ],
  ],
  [
    'mcu',
    'The MCU',
    'franchise',
    [
      ['Iron Man', 2008],
      ['Thor', 2011],
      ['Captain America: The First Avenger', 2011],
      ['Doctor Strange', 2016],
      ['Guardians of the Galaxy', 2014],
      ['Black Panther', 2018],
      ['The Avengers', 2012],
    ],
  ],
  [
    'apatow',
    'Apatow comedies',
    'genre',
    [
      ['Knocked Up', 2007],
      ['Superbad', 2007],
      ['Pineapple Express', 2008],
      ['This Is the End', 2013],
      ['Forgetting Sarah Marshall', 2008],
      ['Step Brothers', 2008],
    ],
  ],
  [
    'dicaprio',
    'Leonardo DiCaprio',
    'shared-actor',
    [
      ['The Revenant', 2015],
      ['Shutter Island', 2010],
      ['Catch Me If You Can', 2002],
      ['Blood Diamond', 2006],
      ['The Aviator', 2004],
      ['The Great Gatsby', 2013],
    ],
  ],
];

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function resolveId(title, year) {
  const url = `${BASE}/search/movie?query=${encodeURIComponent(title)}&year=${year}&api_key=${encodeURIComponent(KEY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`search failed for ${title} (${res.status})`);
  const data = await res.json();
  const hits = data.results || [];
  const exact = hits.find((h) =>
    (h.release_date || '').startsWith(String(year))
  );
  const pick = exact || hits[0];
  if (!pick) throw new Error(`no TMDB match for ${title} (${year})`);
  return pick.id;
}

// Try several random trios from a cluster; return how many assemble + a sample.
function verifyCluster(filmsWithCast) {
  const rng = mulberry32(12345);
  let ok = 0;
  let sample = null;
  for (let t = 0; t < 12; t++) {
    const trio = shuffle(filmsWithCast, rng).slice(0, 3);
    const p = assemblePuzzle(trio, {
      id: 'verify',
      filmCount: 3,
      groupSize: 4,
      rng,
    });
    if (p) {
      ok++;
      const traps = p.actors.filter((a) => a.alsoIn?.length).length;
      if (!sample || traps > (sample.traps ?? 0)) {
        sample = { films: p.films.map((f) => f.title), traps };
      }
    }
  }
  return { ok, sample };
}

async function main() {
  if (!KEY) {
    console.error('TMDB_API_KEY not set (need it to resolve ids + casts).');
    process.exit(1);
  }
  const catalogue = [];
  const flat = [];
  for (const [id, theme, style, films] of CLUSTERS) {
    const resolved = [];
    for (const [title, year] of films) {
      const tmdbId = await resolveId(title, year);
      resolved.push({ id: slug(title), title, year, tmdbId });
    }
    const withCast = await Promise.all(resolved.map((f) => fetchFilmCast(f)));
    const { ok, sample } = verifyCluster(withCast);
    const flag = ok >= 4 ? 'OK ' : ok >= 1 ? '~~ ' : 'XX ';
    console.log(
      `${flag}${theme} (${style}): ${ok}/12 trios assemble` +
        (sample
          ? ` — e.g. [${sample.films.join(' / ')}], ${sample.traps} traps`
          : '')
    );
    catalogue.push({ id, theme, style, films: resolved });
    for (const f of resolved)
      if (!flat.find((x) => x.id === f.id)) flat.push(f);
  }

  if (WRITE) {
    fs.writeFileSync(
      path.join(__dirname, 'lib/tmdb-themes.json'),
      JSON.stringify(catalogue, null, 2) + '\n'
    );
    fs.writeFileSync(
      path.join(__dirname, 'lib/tmdb-films.json'),
      JSON.stringify(flat, null, 2) + '\n'
    );
    console.log(
      `\nWrote tmdb-themes.json (${catalogue.length} clusters) + tmdb-films.json (${flat.length} films).`
    );
  } else {
    console.log('\n(dry run — pass --write to save the catalogue)');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
