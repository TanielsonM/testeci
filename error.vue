<script setup>
const error = useError();
</script>

<template>
  <main class="h-screen w-screen flex flex-col items-center">
    <section class="w-full h-[80px] bg-red-600 flex justify-center items-center">
      <p class="text-base text-white font-semibold">{{ error.message }}</p>
    </section>
    <section class="h-full flex justify-center items-center">
      <img src="~/assets/logos/logo.png" alt="Logo do greenn" width="150" height="50">
    </section>
  </main>
</template>