// Types retournés par les routes de l'API Nuxt (/api/pokemon/*)

export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonCries {
  latest: string;
  legacy: string | null;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  cries: PokemonCries | null;
  stats: PokemonStat[];
}

export interface PokemonRandom {
  id: number;
  name: string;
  description: string | null;
  image: string;
  types: string[];
  cries: PokemonCries | null;
}

export interface PokemonDescription {
  description: string;
}
