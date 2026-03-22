import { capitalizeText } from "~/utils/capitalizeText";
import type { PokeAPIPokemon, PokeAPIPokemonSpecies } from "~/types/pokeapi";
import type { PokemonRandom } from "~/types/pokemon";

export default defineEventHandler(async (): Promise<PokemonRandom> => {
  const randomId = Math.floor(Math.random() * 151) + 1;

  let data: PokeAPIPokemon;
  try {
    data = await $fetch<PokeAPIPokemon>(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`,
    );
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: "PokeAPI unavailable",
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch pokemon data",
    });
  }

  let description: string | null = null;
  try {
    const species = await $fetch<PokeAPIPokemonSpecies>(
      `https://pokeapi.co/api/v2/pokemon-species/${data.id}`,
    );
    const frEntry = species.flavor_text_entries?.find(
      (e) => e.language.name === "fr",
    );
    if (frEntry) {
      description = frEntry.flavor_text
        .replace(/\f/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  } catch {
    // description remains null if species fetch fails
  }

  return {
    id: data.id,
    name: capitalizeText(data.name),
    description,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    types: data.types.map((t) => t.type.name),
    cries: data.cries
      ? { latest: data.cries.latest, legacy: data.cries.legacy }
      : null,
  };
});
