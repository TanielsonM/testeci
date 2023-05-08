<script setup lang="ts">
const props = defineProps({
  notifications: {
    type: Object,
    required: false,
  },
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
  <section class="custom-notifications">
    <div class="checkout-notification flex items-center justify-between">
      <div class="notification flex items-center p-5">
        <div class="icon pr-3">🔥</div>
        <div class="content">
          <h3>{{ title }}</h3>
          <p class="txt-color">
            <span class="font-semibold">{{ name }}</span> acabou de comprar!
          </p>
        </div>
        <Icon name="mdi:close" class="close" />
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.custom-notifications {
  position: fixed;
  right: 10px;
  top: 10px;
  width: 400px;
  max-width: 90%;
  z-index: 999;

  .checkout-notification {
    min-height: 60px;
    border: 1px solid var(--main-color);
    border-radius: 5px;
    background-color: var(--background);
    margin-bottom: 1rem;

    .notification {
      background-color: var(--transparent);
      width: 100%;
      height: 100%;
      position: relative;

      .icon {
        font-size: 26px;
      }
      .content {
        h3 {
          color: var(--main-color);
          font-weight: 500;
          font-size: 0.9rem;
        }
        p {
          color: var(--txt-color);
        }
      }

      .close {
        right: 1rem;
        top: 1rem;
        position: absolute;
        font-size: 14px;
        color: var(--txt-color);
      }
    }
  }
}
</style>
