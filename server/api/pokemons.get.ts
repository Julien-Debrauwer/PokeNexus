import { capitalizeText } from "~/utils/capitalizeText";
import type { PokeAPIPokemonList, PokeAPIPokemon } from "~/types/pokeapi";
import type { PokemonListItem } from "~/types/pokemon";

export default defineCachedEventHandler(
  async (): Promise<PokemonListItem[]> => {
    const response = await $fetch<PokeAPIPokemonList>(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );

    const detailedPokemons = await Promise.all(
      response.results.map(async (pokemon) => {
        const details = await $fetch<PokeAPIPokemon>(pokemon.url);

        return {
          id: details.id,
          name: capitalizeText(details.name),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`,
          types: details.types.map((typeDetail) => typeDetail.type.name),
        };
      }),
    );

    return detailedPokemons;
  },
  {
    // NITRO CACHE ⚡️
    maxAge: 60 * 60 * 24, // 24 hours
    name: "pokemons-list-cache", // cache key
  },
);
