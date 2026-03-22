<template>
  <div class="flex-1 min-h-0 overflow-hidden p-[8px]">
    <div class="mx-auto max-w-7xl">
      <div v-if="pending" aria-live="polite" aria-busy="true">Chargement des Pokémon...</div>

      <ul
        v-else
        class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-[12px]"
        aria-label="List of the original 151 Pokémon"
        role="list"
      >
        <li v-for="pokemon in pokemons" :key="pokemon.id" class="col-span-1" role="listitem">
          <span class="text-xs font-medium" aria-hidden="true">
            #{{ String(pokemon.id).padStart(3, "0") }}
          </span>

          <img
            :src="pokemon.image"
            :alt="`Official artwork of ${pokemon.name}`"
            class="h-auto w-full object-contain"
            loading="lazy"
          />

          <h2 class="mt-[8px] font-semibold">{{ pokemon.name }}</h2>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PokemonListItem } from "~/types/pokemon";

const { data: pokemons, pending } = await useFetch<PokemonListItem[]>(
  "/api/pokemons",
);
</script>
