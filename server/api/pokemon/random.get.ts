export default defineEventHandler(async () => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const data: any = await $fetch(
    `https://pokeapi.co/api/v2/pokemon/${randomId}`,
  );

  let description: string | null = null;
  try {
    const species: any = await $fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${data.id}`,
    );
    const frEntry = species.flavor_text_entries?.find(
      (e: { language: { name: string } }) => e.language.name === "fr",
    );
    if (frEntry) {
      description = (frEntry.flavor_text as string)
        .replace(/\f/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  } catch {
    // pas de description si l’espèce échoue
  }

  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    description,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    types: data.types.map((t: any) => t.type.name),
    cries: data.cries
      ? { latest: data.cries.latest, legacy: data.cries.legacy }
      : null,
  };
});
