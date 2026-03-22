export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    const data: any = await $fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    );

    const frEntry = data.flavor_text_entries?.find(
      (e: { language: { name: string } }) => e.language.name === "fr",
    );

    if (!frEntry) {
      throw createError({
        statusCode: 404,
        statusMessage: "Description en français non disponible",
      });
    }

    const description = (frEntry.flavor_text as string)
      .replace(/\f/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return { description };
  } catch (error: any) {
    if (error.statusCode === 404) throw error;
    throw createError({
      statusCode: 404,
      statusMessage: "Pokémon introuvable",
    });
  }
});
