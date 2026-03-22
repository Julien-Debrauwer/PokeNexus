<template>
  <div
    class="bg-background flex-1 min-h-0 flex flex-col py-[80px] overflow-hidden"
  >
    <p v-if="pending" class="flex items-center justify-center" aria-live="polite" aria-busy="true">
      Chargement du Pokémon...
    </p>
    <article v-else class="flex-1 min-h-0 flex flex-col overflow-hidden w-full" aria-live="polite">
      <template v-if="pokemon">
        <div class="grid-responsive grid-gap min-h-0 flex-1 overflow-hidden">
          <div class="col-span-4 lg:col-span-6 min-h-0 overflow-hidden">
            <img
              :src="pokemon.image"
              :alt="`Official artwork of ${pokemon.name}`"
              loading="lazy"
              class="h-full w-full object-contain min-h-0"
            />
          </div>
          <div class="col-span-4 lg:col-span-6 min-h-0 overflow-hidden">
            <h2 class="mt-[8px] font-semibold font-geist text-[72px]">
              {{ pokemon?.name }}
            </h2>
            <p class="text-lgajou text-muted-foreground">
              # {{ String(pokemon?.id).padStart(3, "0") }}
            </p>
            <p
              v-if="pokemon.description"
              class="mt-4 max-w-xl text-muted-foreground"
            >
              {{ pokemon.description }}
            </p>
          </div>
        </div>
      </template>
    </article>
  </div>
</template>
<script setup lang="ts">
import type { PokemonRandom } from "~/types/pokemon";

const { data: pokemon, pending } = await useFetch<PokemonRandom>(
  "/api/pokemon/random",
);
</script>
