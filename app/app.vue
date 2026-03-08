<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <header class="container py-[8px] flex items-center justify-between shrink-0">
      <NuxtLink to="/" class="flex items-center gap-[10px]">
        <img src="/logo.svg" alt="PokeNexus" class="w-[34px] h-[34px]" />
        <h1 class="text-[24px] font-bold">PokeNexus</h1>
      </NuxtLink>
      <NuxtLink to="/pokemons" class="flex items-center gap-[10px]">
        Pokemons
      </NuxtLink>
    </header>
    <NuxtRouteAnnouncer />
    <main class="flex-1 min-h-0 flex flex-col overflow-hidden">
      <NuxtPage />
    </main>
    <footer class="py-[8px] shrink-0">
    <div class="container flex items-center justify-between">
      <a
        href="https://github.com/Julien-Debrauwer/PokeNexus"
        target="_blank"
        class="underline"
      >
        Github
      </a>
      <p class="text-sm text-center">
        &copy; {{ new Date().getFullYear() }} PokeNexus. Tous droits réservés.
      </p>
    </div>
    </footer>
  </div>
</template>
