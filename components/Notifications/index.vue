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
    <img
      class="icon"
      src="@/assets/icons/notify_success.svg"
      alt="greenn check circle icon"
    />
    <div class="content">
      <h3 class="font-semibold">{{ title }}</h3>
      <p>
        <span>{{ name }}</span> acabou de comprar!
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.notification {
  .icon {
    align-self: flex-start;
    width: 20px;
    height: 20px;
    margin-right: 15px;
    line-height: 1.5;
  }
  .content {
    h3 {
      color: var(--notification-title-color);
      display: flex;
      flex-wrap: wrap;
    }
    p {
      color: var(--notification-text-color);
    }
  }
}
</style>
