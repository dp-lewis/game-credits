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
  // ── Directors ──────────────────────────────────────────────────────────────
  [
    'spielberg',
    'Steven Spielberg',
    'troupe',
    [
      ['Saving Private Ryan', 1998],
      ['Catch Me If You Can', 2002],
      ['Bridge of Spies', 2015],
      ['The Post', 2017],
      ['Lincoln', 2012],
      ['Munich', 2005],
    ],
  ],
  [
    'fincher',
    'David Fincher',
    'troupe',
    [
      ['Fight Club', 1999],
      ['Se7en', 1995],
      ['The Social Network', 2010],
      ['Gone Girl', 2014],
      ['Zodiac', 2007],
      ['The Girl with the Dragon Tattoo', 2011],
    ],
  ],
  [
    'pt-anderson',
    'Paul Thomas Anderson',
    'troupe',
    [
      ['Boogie Nights', 1997],
      ['Magnolia', 1999],
      ['There Will Be Blood', 2007],
      ['The Master', 2012],
      ['Inherent Vice', 2014],
      ['Phantom Thread', 2017],
    ],
  ],
  [
    'ridley-scott',
    'Ridley Scott',
    'troupe',
    [
      ['Gladiator', 2000],
      ['Black Hawk Down', 2001],
      ['American Gangster', 2007],
      ['The Martian', 2015],
      ['Kingdom of Heaven', 2005],
      ['Prometheus', 2012],
    ],
  ],
  [
    'villeneuve',
    'Denis Villeneuve',
    'troupe',
    [
      ['Prisoners', 2013],
      ['Enemy', 2013],
      ['Sicario', 2015],
      ['Arrival', 2016],
      ['Blade Runner 2049', 2017],
      ['Dune', 2021],
    ],
  ],
  [
    'tim-burton',
    'Tim Burton',
    'troupe',
    [
      ['Batman', 1989],
      ['Batman Returns', 1992],
      ['Edward Scissorhands', 1990],
      ['Big Fish', 2003],
      ['Sweeney Todd: The Demon Barber of Fleet Street', 2007],
      ['Ed Wood', 1994],
    ],
  ],
  // ── Franchises ─────────────────────────────────────────────────────────────
  [
    'star-wars',
    'Star Wars',
    'franchise',
    [
      ['Star Wars', 1977],
      ['The Empire Strikes Back', 1980],
      ['Return of the Jedi', 1983],
      ['Star Wars: The Force Awakens', 2015],
      ['Rogue One: A Star Wars Story', 2016],
      ['Star Wars: The Last Jedi', 2017],
    ],
  ],
  [
    'harry-potter',
    'Harry Potter',
    'franchise',
    [
      ["Harry Potter and the Philosopher's Stone", 2001],
      ['Harry Potter and the Chamber of Secrets', 2002],
      ['Harry Potter and the Prisoner of Azkaban', 2004],
      ['Harry Potter and the Goblet of Fire', 2005],
      ['Harry Potter and the Order of the Phoenix', 2007],
      ['Harry Potter and the Half-Blood Prince', 2009],
    ],
  ],
  [
    'lord-of-the-rings',
    'The Lord of the Rings',
    'franchise',
    [
      ['The Lord of the Rings: The Fellowship of the Ring', 2001],
      ['The Lord of the Rings: The Two Towers', 2002],
      ['The Lord of the Rings: The Return of the King', 2003],
      ['The Hobbit: An Unexpected Journey', 2012],
      ['The Hobbit: The Desolation of Smaug', 2013],
      ['The Hobbit: The Battle of the Five Armies', 2014],
    ],
  ],
  [
    'mission-impossible',
    'Mission: Impossible',
    'franchise',
    [
      ['Mission: Impossible', 1996],
      ['Mission: Impossible II', 2000],
      ['Mission: Impossible III', 2006],
      ['Mission: Impossible - Ghost Protocol', 2011],
      ['Mission: Impossible - Rogue Nation', 2015],
      ['Mission: Impossible - Fallout', 2018],
    ],
  ],
  [
    'james-bond',
    'James Bond',
    'franchise',
    [
      ['Casino Royale', 2006],
      ['Quantum of Solace', 2008],
      ['Skyfall', 2012],
      ['Spectre', 2015],
      ['No Time to Die', 2021],
      ['GoldenEye', 1995],
    ],
  ],
  [
    'oceans',
    "Ocean's",
    'franchise',
    [
      ["Ocean's Eleven", 2001],
      ["Ocean's Twelve", 2004],
      ["Ocean's Thirteen", 2007],
    ],
  ],
  // ── Genre / Era ────────────────────────────────────────────────────────────
  [
    'horror',
    'Horror',
    'genre',
    [
      ['Get Out', 2017],
      ['Nope', 2022],
      ['Hereditary', 2018],
      ['A Quiet Place', 2018],
      ['A Quiet Place Part II', 2021],
      ['The Conjuring', 2013],
    ],
  ],
  [
    'action-80s',
    '80s Action',
    'genre',
    [
      ['Die Hard', 1988],
      ['Predator', 1987],
      ['Lethal Weapon', 1987],
      ['RoboCop', 1987],
      ['Total Recall', 1990],
      ['Beverly Hills Cop', 1984],
    ],
  ],
  [
    'heist',
    'Heist',
    'genre',
    [
      ['Heat', 1995],
      ['The Italian Job', 2003],
      ['Inside Man', 2006],
      ['The Town', 2010],
      ['Baby Driver', 2017],
      ['Logan Lucky', 2017],
    ],
  ],
  [
    'sci-fi',
    'Sci-Fi',
    'genre',
    [
      ['The Matrix', 1999],
      ['Aliens', 1986],
      ['The Martian', 2015],
      ['Edge of Tomorrow', 2014],
      ['Avatar', 2009],
      ['Elysium', 2013],
    ],
  ],
  [
    'rom-com',
    'Rom-Com',
    'genre',
    [
      ['When Harry Met Sally...', 1989],
      ['Notting Hill', 1999],
      ['Four Weddings and a Funeral', 1994],
      ["Bridget Jones's Diary", 2001],
      ['Love Actually', 2003],
      ['About Time', 2013],
    ],
  ],
  // ── Shared-Actor ───────────────────────────────────────────────────────────
  [
    'tom-hanks',
    'Tom Hanks',
    'shared-actor',
    [
      ['Forrest Gump', 1994],
      ['Cast Away', 2000],
      ['Philadelphia', 1993],
      ['The Green Mile', 1999],
      ['Captain Phillips', 2013],
      ['Sully', 2016],
    ],
  ],
  [
    'samuel-l-jackson',
    'Samuel L. Jackson',
    'shared-actor',
    [
      ['Unbreakable', 2000],
      ['Split', 2016],
      ['Glass', 2019],
      ['A Time to Kill', 1996],
      ['Die Hard with a Vengeance', 1995],
      ['Kong: Skull Island', 2017],
    ],
  ],
  [
    'meryl-streep',
    'Meryl Streep',
    'shared-actor',
    [
      ['Kramer vs. Kramer', 1979],
      ["Sophie's Choice", 1982],
      ['The Devil Wears Prada', 2006],
      ['Doubt', 2008],
      ['Julie & Julia', 2009],
      ['Florence Foster Jenkins', 2016],
    ],
  ],
  [
    'denzel-washington',
    'Denzel Washington',
    'shared-actor',
    [
      ['Training Day', 2001],
      ['Man on Fire', 2004],
      ['The Equalizer', 2014],
      ['Flight', 2012],
      ['Fences', 2016],
      ['The Manchurian Candidate', 2004],
    ],
  ],
  [
    'brad-pitt',
    'Brad Pitt',
    'shared-actor',
    [
      ['Moneyball', 2011],
      ['The Big Short', 2015],
      ['12 Years a Slave', 2013],
      ['Troy', 2004],
      ['Snatch', 2000],
      ['The Assassination of Jesse James by the Coward Robert Ford', 2007],
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
