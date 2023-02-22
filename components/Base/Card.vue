<template>
  <section
    class="card bg-checkout flex h-auto w-full max-w-[1200px] flex-col gap-4 rounded-lg"
  >
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.card {
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.2);
}
</style>
