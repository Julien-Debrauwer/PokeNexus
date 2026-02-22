export default defineCachedEventHandler(
  async (event) => {
    console.log(
      "Fetching depuis l'API externe (tu ne devrais voir ça qu'une fois !)",
    );

    // 1. Récupération de la liste de base
    const response: any = await $fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );

    // 2. On récupère les détails de TOUS les Pokémon en parallèle
    // C'est lourd, mais grâce au cache, on ne le fera qu'une seule fois !
    const detailedPokemons = await Promise.all(
      response.results.map(async (pokemon: any) => {
        const details: any = await $fetch(pokemon.url);

        return {
          id: details.id,
          name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`,
          // On extrait un tableau simple des types (ex: ["grass", "poison"])
          types: details.types.map((t: any) => t.type.name),
        };
      }),
    );

    return detailedPokemons;
  },
  {
    // CONFIGURATION DU CACHE NITRO ⚡️
    maxAge: 60 * 60 * 24, // Garde le résultat en mémoire pendant 24 heures
    name: "pokemons-list-cache", // Nom de la clé de cache
  },
);
