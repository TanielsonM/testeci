<script setup>
const route = useRoute();
const router = useRouter();
await useApi()
  .read(`/link/${route.params.page}`)
  .then((res) => {
    const url = new URL(res.url);
    const currentQuery = new URLSearchParams(route.query);
    const query = new URLSearchParams(url.searchParams);
    if (currentQuery) {
      for (let [key, value] of currentQuery.entries()) {
        query.append(key, value);
      }
    }
    const fullURL = url.pathname + "?" + query.toString();
    if (fullURL) {
      router.push(fullURL);
    }
  });
</script>

<template>
  <main class="flex h-full w-screen items-center justify-center">
    <h1 class="text-4xl">Aguarde...</h1>
  </main>
</template>
