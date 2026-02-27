<template>
  <div class="min-h-screen flex flex-col">
    <header class="p-[16px] shrink-0 flex items-center">
      <nav class="flex items-center justify-between w-full">
        <div class="flex items-center gap-[10px]">
          <img src="/logo.svg" alt="PokeNexus" class="w-[34px] h-[34px]" />
          <h1 class="text-[24px] font-bold">PokeNexus</h1>
        </div>
        <NuxtLink
          to="/playground"
          class="text-sm font-medium hover:text-primary flex items-center"
        >
          Aller au Playground 🧪
        </NuxtLink>
      </nav>
    </header>
    <main class="w-full flex-1 flex items-center justify-center">
      <NuxtPage />
    </main>
  </div>
</template>
