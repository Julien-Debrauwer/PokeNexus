import { capitalizeText } from "~/utils/capitalizeText";

export default defineCachedEventHandler(
  async () => {
    const response: any = await $fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );

    const detailedPokemons = await Promise.all(
      response.results.map(async (pokemon: any) => {
        const details: any = await $fetch(pokemon.url);

        return {
          id: details.id,
          name: capitalizeText(details.name),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`,
          types: details.types.map((typeDetail: any) => typeDetail.type.name),
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
