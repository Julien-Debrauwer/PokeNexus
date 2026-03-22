# PokeNexus — Règles Claude Code

## TypeScript : interdiction de `any`

- Ne jamais utiliser `any`. Toujours typer explicitement.
- Pour les réponses `$fetch` vers PokeAPI, utiliser le générique : `$fetch<PokeAPIPokemon>(url)`.
- Pour les réponses `useFetch` côté client, utiliser le générique : `useFetch<PokemonRandom>(url)`.
- Pour les erreurs `catch`, utiliser `unknown` et réduire le type avec `instanceof` ou un type guard.

## Où sont les types

- **`~/types/pokeapi.ts`** — types bruts des réponses PokeAPI (`PokeAPIPokemon`, `PokeAPIPokemonSpecies`, `PokeAPIPokemonList`, etc.)
- **`~/types/pokemon.ts`** — types retournés par notre API Nuxt (`PokemonListItem`, `PokemonDetail`, `PokemonRandom`, `PokemonDescription`)

Avant de créer un nouveau type, vérifier que `~/types/pokeapi.ts` ou `~/types/pokemon.ts` ne le contient pas déjà.

## Architecture

- Framework : Nuxt 4 (Vue 3) avec TypeScript
- Routes serveur : `server/api/` (handlers Nitro)
- Pages : `app/pages/`
- Composables partagés : `app/composables/`
- Utilitaires : `app/utils/` (ex. `capitalizeText`)

## Style

- Utiliser les composables existants (`useCapitalize`) avant d'en créer de nouveaux.
- Ne pas ajouter de dépendances sans accord explicite.
