<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <header class="container py-[8px] flex items-center justify-between shrink-0" aria-label="Site header">
      <NuxtLink to="/" class="flex items-center gap-[10px]" aria-label="PokeNexus — Home">
        <img src="/logo.svg" alt="" aria-hidden="true" class="w-[34px] h-[34px]" />
        <h1 class="text-[24px] font-bold">PokeNexus</h1>
      </NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink to="/pokemons" class="flex items-center gap-[10px]">
          Pokémon list
        </NuxtLink>
      </nav>
    </header>
    <NuxtRouteAnnouncer />
    <main class="flex-1 min-h-0 flex flex-col overflow-hidden" id="main-content">
      <NuxtPage />
    </main>
    <footer class="py-[8px] shrink-0" aria-label="Site footer">
    <div class="container flex items-center justify-between">
      <a
        href="https://github.com/Julien-Debrauwer/PokeNexus"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        aria-label="PokeNexus GitHub repository (opens in new tab)"
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
