<template>
  <div
    class="bg-background flex-1 min-h-0 flex flex-col py-[80px] overflow-hidden"
  >
    <p v-if="pending" class="flex items-center justify-center">
      Chargement du Pokémon...
    </p>
    <article v-else class="flex-1 min-h-0 flex flex-col overflow-hidden w-full">
      <template v-if="pokemon">
        <div class="grid-responsive grid-gap min-h-0 flex-1 overflow-hidden">
          <div class="col-span-4 lg:col-span-6 min-h-0 overflow-hidden">
            <img
              :src="pokemon.image"
              :alt="pokemon?.name"
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
            <audio
              v-if="cryUrl"
              ref="cryAudioRef"
              :src="cryUrl"
              preload="auto"
              class="sr-only"
              @canplay="onCryCanPlay"
            />
            <button
              v-if="cryUrl"
              type="button"
              class="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              @click="playCry"
            >
              <span aria-hidden="true">🔊</span>
              Écouter le cri
            </button>
          </div>
        </div>
      </template>
    </article>
  </div>
</template>
<script setup lang="ts">
type PokemonRandom = {
  id: number;
  name: string;
  image: string;
  types: string[];
  cries: { latest: string; legacy: string } | null;
};
const { data: pokemon, pending } = await useFetch<PokemonRandom>(
  "/api/pokemon/random",
);

const cryUrl = computed(() => {
  const c = pokemon.value?.cries;
  if (!c) return null;
  return c.latest || null;
});

const cryAudioRef = ref<HTMLAudioElement | null>(null);
const hasAutoPlayedForCry = ref<string | null>(null);

function playCry() {
  if (!cryAudioRef.value) return;
  cryAudioRef.value.play().catch(() => {});
}

function onCryCanPlay() {
  const url = cryUrl.value;
  if (!url || hasAutoPlayedForCry.value === url) return;
  hasAutoPlayedForCry.value = url;
  playCry();
}

watch(cryUrl, (url) => {
  if (!url) hasAutoPlayedForCry.value = null;
});
</script>
