<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="notification flex items-center">
    <div class="icon pr-7">🔥</div>
    <div class="content">
      <h3>{{ title }}</h3>
      <p>
        <span class="font-semibold">{{ name }}</span> acabou de comprar!
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.notification {
  .icon {
    font-size: 22px;
  }
  .content {
    h3 {
      color: white;
    }
    p {
      color: white;
    }
  }
}

.Vue-Toastification__toast--default {
  &.custom {
  }
}
</style>
