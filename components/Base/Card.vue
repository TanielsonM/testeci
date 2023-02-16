<template>
  <section class="card flex flex-col rounded-lg gap-4 bg-checkout w-full max-w-[1200px] h-auto">
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.card {
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.2);
}
</style>