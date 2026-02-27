<template>
  <div class="min-h-screen bg-background p-[8px]">
    <div class="mx-auto max-w-7xl">
      <div v-if="pending" class="text-muted-foreground">
        Chargement de l'encyclopédie...
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <Card
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          class="flex flex-col overflow-hidden transition-all hover:border-primary hover:shadow-md"
        >
          <CardHeader class="p-4 pb-2 text-center">
            <span class="text-xs font-bold text-muted-foreground">
              #{{ String(pokemon.id).padStart(3, "0") }}
            </span>
            <CardTitle class="text-lg">{{ pokemon.name }}</CardTitle>
          </CardHeader>

          <CardContent class="flex flex-col items-center p-4 pt-0">
            <img
              :src="pokemon.image"
              :alt="pokemon.name"
              class="h-24 w-24 object-contain drop-shadow-sm transition-transform hover:scale-110"
              loading="lazy"
            />

            <div class="mt-4 flex gap-1">
              <Badge
                v-for="type in pokemon.types"
                :key="type"
                variant="secondary"
                class="capitalize"
              >
                {{ type }}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// Nuxt appelle notre route interne au moment du rendu de la page
// 'data' contiendra le tableau, 'pending' nous dit si ça charge
const { data: pokemons, pending } = await useFetch("/api/pokemons");
</script>
