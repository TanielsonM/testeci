<script setup>
const route = useRoute();
const router = useRouter();
const isExternalPage = ref(false);
const externalPage = ref("");

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
    
    isExternalPage.value = !["payfast.greenn", "pay.greenn", "payu.greenn"].includes(url.hostname);
    
    externalPage.value = url.origin + "?" + query.toString();
    const fullURL = url.pathname + "?" + query.toString();
    if (fullURL && !isExternalPage.value) {
      router.push(fullURL);
    }
  });

onMounted(() => {
  if(process.client) {
    window.location.href = externalPage.value;
  }
})
</script>

<template>
  <main class="flex h-screen w-screen items-center justify-center flex-col gap-5">
    <img src="@/assets/logos/logo.png" alt="Logo do Greenn" class="w-[200px]">
    <section class="custom-loading">
      <span class="loading"></span>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.custom-loading {
  width: 250px;
  height: 5px;
  border-radius: 20px;
  background: #eee;
  display: flex;
  align-items: center;
  position: relative;

  .loading {
    position: absolute;
    display: block;
    height: 80%;
    width: 70px;
    border-radius: 20px;
    background: #003e53;
    transition: all ease-in-out 200ms;
    animation: loading 1.5s infinite alternate;
  }
}

@keyframes loading {
  0% {
    transform: translateX(240px); // .loading width - custom-loading width
    width: 10px;
  }
  50% {
    width: 100px;
  }
  100% {
    transform: translateX(0);
    width: 10px;
  }
}
</style>