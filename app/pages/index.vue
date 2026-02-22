<template>
  <div class="min-h-screen bg-background p-[8px]">
    <div class="mx-auto max-w-7xl">
      <h1 class="mb-[16px] text-4xl font-bold">PokeNexus</h1>

      <div v-if="pending">Chargement des Pokémon...</div>

      <ul
        v-else
        class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-[12px]"
      >
        <li v-for="pokemon in pokemons" :key="pokemon.id" class="col-span-1">
          <span class="text-xs font-medium">
            #{{ String(pokemon.id).padStart(3, "0") }}
          </span>

          <img
            :src="pokemon.image"
            :alt="pokemon.name"
            class="h-full w-full object-contain"
            loading="lazy"
          />

          <h2 class="mt-[8px] font-semibold">{{ pokemon.name }}</h2>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
// Nuxt appelle notre route interne au moment du rendu de la page
// 'data' contiendra le tableau, 'pending' nous dit si ça charge
const { data: pokemons, pending } = await useFetch("/api/pokemons");
</script>
