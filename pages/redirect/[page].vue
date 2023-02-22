<script setup>
const route = useRoute();
await useRedirect(route.params.page);
</script>

<template>
  <main class="flex h-full w-screen items-center justify-center">
    <h1 class="text-4xl">Aguarde...</h1>
  </main>
</template>
