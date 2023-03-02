<script setup>
const route = useRoute();
await useApi()
  .read(`/link/${route.params.page}`)
  .then((res) => {
    if (res.value.url)
      navigateTo(res.value.url, {
        external: true,
      });
  });
</script>

<template>
  <main class="flex h-full w-screen items-center justify-center">
    <h1 class="text-4xl">Aguarde...</h1>
  </main>
</template>
