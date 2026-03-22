import type { PokeAPIPokemon } from "~/types/pokeapi";
import type { PokemonDetail } from "~/types/pokemon";

export default defineEventHandler(async (event): Promise<PokemonDetail> => {
  const id = getRouterParam(event, "id");

  try {
    const data = await $fetch<PokeAPIPokemon>(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
      types: data.types.map((t) => t.type.name),
      height: data.height / 10, // metres
      weight: data.weight / 10, // kilogrammes
      cries: data.cries
        ? {
            latest: data.cries.latest,
            legacy: data.cries.legacy,
          }
        : null,
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Pokémon introuvable",
    });
  }
});
