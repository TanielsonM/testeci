<script setup>
const route = useRoute();
await useRedirect(route.params.page);
</script>

<template>
  <main class="h-full w-screen flex justify-center items-center">
    <h1 class="text-4xl">Aguarde...</h1>
  </main>
</template>