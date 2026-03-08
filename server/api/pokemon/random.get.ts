export default defineEventHandler(async () => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const data: any = await $fetch(
    `https://pokeapi.co/api/v2/pokemon/${randomId}`,
  );
  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    types: data.types.map((t: any) => t.type.name),
    cries: data.cries
      ? { latest: data.cries.latest, legacy: data.cries.legacy }
      : null,
  };
});
