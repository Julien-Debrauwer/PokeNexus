export default defineEventHandler(async (event) => {
  // 1. On appelle l'API externe (limitons à la 1ère génération pour commencer)
  // On utilise $fetch qui est l'outil natif de Nuxt (basé sur ofetch)
  const response: any = await $fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151",
  );

  // 2. On nettoie et on transforme la donnée pour le Front-End
  const pokemons = response.results.map((pokemon: any) => {
    // Astuce : La PokéAPI ne donne pas l'ID directement dans la liste,
    // mais il est à la fin de l'URL (ex: ".../pokemon/25/"). On l'extrait.
    const urlParts = pokemon.url.split("/");
    const id = urlParts[urlParts.length - 2];

    return {
      id: Number(id),
      // On met une majuscule à la première lettre du nom
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      // On génère l'URL de l'image officielle HD directement sans refaire d'appel API !
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  // 3. On renvoie le tableau propre
  return pokemons;
});
