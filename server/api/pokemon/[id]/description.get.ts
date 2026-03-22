import type { PokeAPIPokemonSpecies } from "~/types/pokeapi";
import type { PokemonDescription } from "~/types/pokemon";

export default defineEventHandler(
  async (event): Promise<PokemonDescription> => {
    const id = getRouterParam(event, "id");

    try {
      const data = await $fetch<PokeAPIPokemonSpecies>(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`,
      );

      const frEntry = data.flavor_text_entries?.find(
        (e) => e.language.name === "fr",
      );

      if (!frEntry) {
        throw createError({
          statusCode: 404,
          statusMessage: "Description en français non disponible",
        });
      }

      const description = frEntry.flavor_text
        .replace(/\f/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return { description };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error as { statusCode: number }).statusCode === 404
      ) {
        throw error;
      }
      throw createError({
        statusCode: 404,
        statusMessage: "Pokémon introuvable",
      });
    }
  },
);
