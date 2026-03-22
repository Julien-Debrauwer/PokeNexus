// Types bruts des réponses de l'API PokeAPI (https://pokeapi.co/api/v2/)

export interface PokeAPINamedResource {
  name: string;
  url: string;
}

// GET /api/v2/pokemon?limit=N
export interface PokeAPIPokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeAPINamedResource[];
}

// GET /api/v2/pokemon/{id}
export interface PokeAPITypeSlot {
  slot: number;
  type: PokeAPINamedResource;
}

export interface PokeAPIStat {
  base_stat: number;
  effort: number;
  stat: PokeAPINamedResource;
}

export interface PokeAPICries {
  latest: string;
  legacy: string | null;
}

export interface PokeAPIPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokeAPITypeSlot[];
  stats: PokeAPIStat[];
  cries: PokeAPICries;
}

// GET /api/v2/pokemon-species/{id}
export interface PokeAPIFlavorTextEntry {
  flavor_text: string;
  language: PokeAPINamedResource;
  version: PokeAPINamedResource;
}

export interface PokeAPIPokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: PokeAPIFlavorTextEntry[];
}
