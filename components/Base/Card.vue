<template>
  <section
    class="card flex h-auto w-full max-w-[771.66px] flex-col gap-4 rounded-lg bg-checkout"
  >
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.card {
  -webkit-box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.05);
  box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.05);
}
</style>
