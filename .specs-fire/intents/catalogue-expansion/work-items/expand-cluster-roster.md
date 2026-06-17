---
id: expand-cluster-roster
title: Expand Cluster Roster
intent: catalogue-expansion
complexity: medium
mode: autopilot
status: pending
depends_on: []
created: 2026-06-17T00:00:00Z
---

# Work Item: Expand Cluster Roster

## Description

Edit the `CLUSTERS` array in `scripts/build-theme-catalogue.js` to add ~20 new themed clusters across all four styles, bringing the total from 8 to ~28. Each cluster needs 6–8 films with genuine cross-cast overlap (shared actors between films) so the `assemblePuzzle` oracle can produce traps.

New clusters to add:

**Directors (6)**
- `spielberg` — Steven Spielberg (Saving Private Ryan, Schindler's List, Catch Me If You Can, Munich, Jurassic Park, Indiana Jones and the Last Crusade)
- `fincher` — David Fincher (Fight Club, Se7en, The Social Network, Zodiac, Gone Girl, The Girl with the Dragon Tattoo)
- `pt-anderson` — Paul Thomas Anderson (Boogie Nights, Magnolia, There Will Be Blood, The Master, Phantom Thread, Inherent Vice)
- `ridley-scott` — Ridley Scott (Gladiator, Black Hawk Down, American Gangster, The Martian, Kingdom of Heaven, Robin Hood)
- `villeneuve` — Denis Villeneuve (Arrival, Blade Runner 2049, Dune, Sicario, Prisoners, Enemy)
- `tim-burton` — Tim Burton (Batman, Edward Scissorhands, Big Fish, Sweeney Todd, Ed Wood, Big Eyes)

**Franchises (6)**
- `star-wars` — Star Wars (A New Hope, The Empire Strikes Back, Return of the Jedi, The Force Awakens, Rogue One, The Last Jedi)
- `harry-potter` — Harry Potter (Philosopher's Stone, Chamber of Secrets, Prisoner of Azkaban, Goblet of Fire, Order of the Phoenix, Half-Blood Prince)
- `lord-of-the-rings` — The Lord of the Rings (The Fellowship of the Ring, The Two Towers, The Return of the King, The Hobbit: An Unexpected Journey, The Hobbit: The Desolation of Smaug, The Hobbit: The Battle of the Five Armies)
- `mission-impossible` — Mission: Impossible (Mission: Impossible, M:I 2, M:I III, Ghost Protocol, Rogue Nation, Fallout)
- `james-bond` — James Bond (Casino Royale, Quantum of Solace, Skyfall, Spectre, No Time to Die, GoldenEye)
- `oceans` — Ocean's (Ocean's Eleven, Ocean's Twelve, Ocean's Thirteen)

**Genre (5)**
- `horror` — Horror classics (Get Out, Hereditary, The Shining, A Quiet Place, It, The Witch)
- `action-80s` — 80s Action (Die Hard, Predator, Lethal Weapon, Beverly Hills Cop, RoboCop, Total Recall)
- `heist` — Heist films (Heat, The Italian Job, Inside Man, Rififi, The Town, Baby Driver)
- `sci-fi` — Sci-Fi (The Matrix, Aliens, Terminator 2, Blade Runner, 2001: A Space Odyssey, Ex Machina)
- `rom-com` — Rom-Coms (When Harry Met Sally, Notting Hill, Four Weddings and a Funeral, Bridget Jones's Diary, Love Actually, About Time)

**Costars (5)**
- `tom-hanks` — Tom Hanks (Forrest Gump, Cast Away, Philadelphia, The Green Mile, Captain Phillips, Sully)
- `samuel-l-jackson` — Samuel L. Jackson (Pulp Fiction, Jackie Brown, Unbreakable, Django Unchained, The Hateful Eight, Glass)
- `meryl-streep` — Meryl Streep (Kramer vs. Kramer, Sophie's Choice, The Devil Wears Prada, Doubt, Julie & Julia, Florence Foster Jenkins)
- `denzel-washington` — Denzel Washington (Training Day, Man on Fire, The Equalizer, Flight, American Gangster, Fences)
- `brad-pitt` — Brad Pitt (Fight Club, Se7en, Ocean's Eleven, Inglourious Basterds, Moneyball, Once Upon a Time in Hollywood)

## Acceptance Criteria

- [ ] All ~20 new clusters added to `CLUSTERS` array in `scripts/build-theme-catalogue.js`
- [ ] Each cluster has 6–8 films with correct `[title, year]` format
- [ ] Ocean's cluster has only 3 films (that's fine — C(3,3)=1 trio)
- [ ] Films within each cluster genuinely share cast members (troupe/franchise by definition; genre/costar clusters chosen for known ensemble overlap)
- [ ] No duplicate film entries across the CLUSTERS array that would break slug uniqueness
- [ ] File lints cleanly (`npm run lint` passes on the script)

## Technical Notes

Edit only `scripts/build-theme-catalogue.js` — the CLUSTERS array starting at line 35. No other files change in this work item. The verification step (work item 2) will catch any clusters that don't assemble.

Note: Samuel L. Jackson and Brad Pitt both appear in Pulp Fiction and other Tarantino films — their costar clusters will naturally overlap with the tarantino cluster, which is fine and actually creates good cross-cluster traps.

## Dependencies

(none)
