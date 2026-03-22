import type { PokeAPIPokemon, PokeAPIPokemonSpecies } from "~/types/pokeapi";
import type { PokemonRandom } from "~/types/pokemon";

export default defineEventHandler(async (): Promise<PokemonRandom> => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const data = await $fetch<PokeAPIPokemon>(
    `https://pokeapi.co/api/v2/pokemon/${randomId}`,
  );

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
    // pas de description si l'espèce échoue
  }

  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    description,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    types: data.types.map((t) => t.type.name),
    cries: data.cries
      ? { latest: data.cries.latest, legacy: data.cries.legacy }
      : null,
  };
});
