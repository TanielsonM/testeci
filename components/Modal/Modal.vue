<script setup>
import { useModalStore } from "~~/store/modal/success";
const modal = useModalStore();
</script>
<template>
  <div class="default-modal">
    <div
      class="modal max-w-[90%] sm:max-w-[630px] md:max-w-[740px] lg:max-w-[800px]"
      data-anima="top"
    >
      <div class="content">
        <header>
          <h2 class="title">
            {{ modal.title }}
          </h2>
          <button @click="modal.closeAtion" class="close"></button>
        </header>
        <slot />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.default-modal {
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;

  position: absolute;
  display: flex;
  align-items: flex-start;

  background-color: rgba(0, 0, 0, 0.45);

  .modal {
    position: relative;
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    width: 100%;
    max-height: 95vh;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
    margin: 1.75rem auto;
    padding: 20px 30px;
    overflow: auto;
  }
}
</style>
