<script lang="ts" setup>
interface Props {
  title: string;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(["close"]);
</script>
<template>
  <main class="modal" v-if="isOpen">
    <section class="modal__overlay" @click="emit('close')"></section>
    <BaseCard class="modal__content">
      <header class="modal__content__header">
        <slot name="header">
          <span class="text-txt-color">{{ title }}</span>
        </slot>
        <Icon
          name="mdi:close"
          class="cursor-pointer text-gray-400"
          size="25"
          @click="emit('close')"
        />
      </header>
      <!-- Body -->
      <slot></slot>
    </BaseCard>
  </main>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  padding: 50px 20px;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  animation: fade-in 500ms;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__content {
    width: auto !important;
    padding: 20px 30px;
    z-index: 1000;
    animation: slideFromBottom 500ms;

    &__header {
      min-height: 60px;
      min-width: 200px;
      width: 100%;
      font-weight: 600;
      font-size: 16px;

      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__footer {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>