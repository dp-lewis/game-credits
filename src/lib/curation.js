import { shuffle } from './shuffle.js';

/**
 * Pure puzzle-curation engine (build-time only; never imported by the client).
 *
 * Assembles a crossover puzzle from films-with-casts and **proves** it has a
 * unique solution before returning it. The hard guarantee — exactly one valid
 * partition given each actor's real film memberships — lives in
 * {@link countPartitions}, used as an oracle while assembling.
 */

/**
 * Count valid partitions: assignments placing every actor into one film they
 * appear in, with each film receiving exactly `groupSize` actors. Early-exits
 * once `capAt` is reached (callers only need "unique vs not").
 *
 * @param {{films: string[]}[]} actors  Each actor's member films (subset of `filmIds`).
 * @param {string[]} filmIds
 * @param {number} groupSize
 * @param {number} [capAt=2]
 * @returns {number} Partition count, capped at `capAt`.
 */
export function countPartitions(actors, filmIds, groupSize, capAt = 2) {
  const capacity = new Map(filmIds.map((f) => [f, groupSize]));
  // Most-constrained-actor-first ordering prunes the search hard.
  const order = actors
    .map((_, i) => i)
    .sort((a, b) => actors[a].films.length - actors[b].films.length);

  let count = 0;
  const rec = (k) => {
    if (count >= capAt) return;
    if (k === order.length) {
      count += 1;
      return;
    }
    for (const film of actors[order[k]].films) {
      if (capacity.get(film) > 0) {
        capacity.set(film, capacity.get(film) - 1);
        rec(k + 1);
        capacity.set(film, capacity.get(film) + 1);
        if (count >= capAt) return;
      }
    }
  };
  rec(0);
  return count;
}

/** Does this exact actor set / membership graph have a single solution? */
export function hasUniqueSolution(actors, filmIds, groupSize) {
  return countPartitions(actors, filmIds, groupSize, 2) === 1;
}

/**
 * Order members by prominence — billing `order` ascending (leads first) when
 * every member has it, otherwise fall back to a deterministic shuffle. This is
 * what keeps generated puzzles full of recognizable names rather than deep-cut
 * character actors.
 */
function byProminence(list, rng) {
  if (list.length > 0 && list.every((m) => typeof m.order === 'number')) {
    return [...list].sort(
      (a, b) => a.order - b.order || (a.id < b.id ? -1 : 1)
    );
  }
  return shuffle(list, rng);
}

/**
 * @typedef {Object} FilmWithCast
 * @property {string} id
 * @property {string} title
 * @property {number} [year]
 * @property {{id: string, name: string}[]} cast
 */

/**
 * Assemble a unique-solution crossover puzzle.
 *
 * Strategy: fill each chosen film with `groupSize` single-film **anchors**
 * (trivially unique), then greedily swap anchors for **crossover** actors —
 * keeping a swap only while the solution stays unique. Always returns a solvable
 * puzzle (worst case all anchors), with real `alsoIn` traps when the data allows.
 *
 * @param {FilmWithCast[]} pool  Available films (uses the first `filmCount`).
 * @param {Object} opts
 * @param {string} opts.id  Puzzle id / date key.
 * @param {number} [opts.filmCount=3]
 * @param {number} [opts.groupSize=4]
 * @param {number} [opts.maxMistakes=4]
 * @param {() => number} [opts.rng=Math.random]
 * @param {number} [opts.maxTraps]  Cap on crossover traps (default filmCount).
 * @returns {object|null} A schema-shaped puzzle, or null if no valid assembly.
 */
export function assemblePuzzle(pool, opts) {
  const {
    id,
    filmCount = 3,
    groupSize = 4,
    maxMistakes = 4,
    rng = Math.random,
    maxTraps,
  } = opts;

  if (!Array.isArray(pool) || pool.length < filmCount) return null;
  const films = pool.slice(0, filmCount);
  const filmIds = films.map((f) => f.id);
  const filmIdSet = new Set(filmIds);

  // Membership: actorId → { name, films, order } where `order` is the best
  // (lowest) billing across the films they're in — a prominence proxy.
  const members = new Map();
  for (const film of films) {
    for (const actor of film.cast || []) {
      if (!members.has(actor.id)) {
        members.set(actor.id, {
          id: actor.id,
          name: actor.name,
          films: new Set(),
          order: actor.order,
        });
      }
      const m = members.get(actor.id);
      m.films.add(film.id);
      if (typeof actor.order === 'number') {
        m.order =
          typeof m.order === 'number'
            ? Math.min(m.order, actor.order)
            : actor.order;
      }
    }
  }

  const anchorsByFilm = new Map(filmIds.map((f) => [f, []]));
  const crossovers = [];
  for (const m of members.values()) {
    const memberFilms = [...m.films].filter((f) => filmIdSet.has(f));
    if (memberFilms.length === 1) {
      anchorsByFilm.get(memberFilms[0]).push(m);
    } else if (memberFilms.length >= 2) {
      crossovers.push({ ...m, films: memberFilms });
    }
  }

  // Need at least groupSize anchors per film for the guaranteed baseline.
  for (const f of filmIds) {
    if (anchorsByFilm.get(f).length < groupSize) return null;
  }

  // Baseline: the groupSize most prominent anchors per film.
  /** @type {Map<string, {id:string,name:string,filmId:string,memberFilms:string[],order:number|undefined}>} */
  const selected = new Map();
  for (const f of filmIds) {
    const picks = byProminence(anchorsByFilm.get(f), rng).slice(0, groupSize);
    for (const a of picks) {
      selected.set(a.id, {
        id: a.id,
        name: a.name,
        filmId: f,
        memberFilms: [f],
        order: a.order,
      });
    }
  }

  // Inject traps: swap an anchor for a crossover whose solution film is one it
  // appears in, keeping the swap only while uniqueness holds.
  const trapLimit = maxTraps ?? filmCount;
  let traps = 0;
  for (const x of byProminence(crossovers, rng)) {
    if (traps >= trapLimit) break;
    if (selected.has(x.id)) continue;
    for (const solutionFilm of shuffle(x.films, rng)) {
      // Drop the LEAST prominent single-film anchor of solutionFilm, so adding a
      // trap doesn't cost us a lead.
      const candidates = [...selected.values()].filter(
        (s) => s.filmId === solutionFilm && s.memberFilms.length === 1
      );
      if (candidates.length === 0) continue;
      const droppable = candidates.sort(
        (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
      )[candidates.length - 1];

      const trial = new Map(selected);
      trial.delete(droppable.id);
      trial.set(x.id, {
        id: x.id,
        name: x.name,
        filmId: solutionFilm,
        memberFilms: x.films,
        order: x.order,
      });

      const actorsForOracle = [...trial.values()].map((s) => ({
        films: s.memberFilms,
      }));
      if (hasUniqueSolution(actorsForOracle, filmIds, groupSize)) {
        selected.clear();
        for (const [k, v] of trial) selected.set(k, v);
        traps += 1;
        break;
      }
    }
  }

  // Final safety check.
  const finalOracle = [...selected.values()].map((s) => ({
    films: s.memberFilms,
  }));
  if (!hasUniqueSolution(finalOracle, filmIds, groupSize)) return null;

  const actors = shuffle([...selected.values()], rng).map((s) => {
    const alsoIn = s.memberFilms.filter((f) => f !== s.filmId);
    return {
      id: s.id,
      name: s.name,
      filmId: s.filmId,
      ...(alsoIn.length > 0 ? { alsoIn } : {}),
    };
  });

  return {
    id,
    date: id,
    maxMistakes,
    films: films.map((f) => ({
      id: f.id,
      title: f.title,
      ...(f.year !== undefined ? { year: f.year } : {}),
    })),
    actors,
  };
}
