<script setup>
const route = useRoute();
const fetchUrl = async () => {
  return await fetch(
    useRuntimeConfig().public.API_BASE_URL + `/link/${route.params.page}`
  ).then((res) => res.json());
};

onMounted(async () => {
  if (process.client) {
    await fetchUrl().then((res) => {
      const url = new URL(res.url);
      const currentQuery = new URLSearchParams(route.query);
      const query = new URLSearchParams(url.searchParams);
      if (currentQuery) {
        for (let [key, value] of currentQuery.entries()) {
          query.append(key, value);
        }
      }
      const fullURL = url.origin + url.pathname + "?" + query.toString();
      console.log(
        "Redirecting ->>>>>> " +
          JSON.stringify({ route: route, fullURL: fullURL })
      );
      if (fullURL) {
        navigateTo(fullURL, {
          external: true,
        });
      }
    });
  }
});
</script>

<template>
  <main class="flex h-full w-screen items-center justify-center">
    <h1 class="text-4xl">Aguarde...</h1>
  </main>
</template>
