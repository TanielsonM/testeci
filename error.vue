<script setup>
const error = useError();
</script>

<template>
  <main class="flex h-screen w-screen flex-col items-center">
    <section
      class="flex h-[80px] w-full items-center justify-center bg-red-600"
    >
      <p class="text-base font-semibold text-white">{{ error.message }}</p>
    </section>
    <section class="flex h-full items-center justify-center">
      <img
        src="~/assets/logos/logo.png"
        alt="Logo do greenn"
        width="150"
        height="50"
      />
    </section>
  </main>
</template>
