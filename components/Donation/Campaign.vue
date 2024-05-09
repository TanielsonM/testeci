<script setup>
import { useProductStore } from "~/store/product";

const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const donation_tax = product?.value?.seller?.donation_tax

const linkInfo = () => {
  window.open('https://greenn.com.br/riograndedosul', '_blank');
};

</script>

<template>
  <div class="w-full flex justify-end">
    <div class="donation-card">
      <div class="donation-icon mx-3 my-2">
        <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.2758 18.1402L2.55978 10.2452C-2.17716 5.50827 4.78615 -3.58667 11.2758 3.77138C17.7654 -3.58667 24.6972 5.53986 19.9917 10.2452L11.2758 18.1402Z"/>
          <path d="M11.2758 18.1402L2.55978 10.2452C-2.17716 5.50827 4.78615 -3.58667 11.2758 3.77138C17.7654 -3.58667 24.6972 5.53986 19.9917 10.2452L11.2758 18.1402Z"/>
          <path d="M11.2758 18.1402L2.55978 10.2452C-2.17716 5.50827 4.78615 -3.58667 11.2758 3.77138C17.7654 -3.58667 24.6972 5.53986 19.9917 10.2452L11.2758 18.1402Z" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M11.2758 18.1402L2.55978 10.2452C-2.17716 5.50827 4.78615 -3.58667 11.2758 3.77138C17.7654 -3.58667 24.6972 5.53986 19.9917 10.2452L11.2758 18.1402Z" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="donation-text mr-3">
        <span style="line-height: 100%;">
          <span class="donation-text-sos">SOS Rio Grande do Sul</span>
          <div class="donation-info" @click="linkInfo">?</div>
          <br>
          <span class="donation-text-money mr-1">{{ donation_tax }}%</span>
          <span class="donation-text-sale">do lucro dessa venda será doado</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .donation-card {
    position: absolute;
    top: 275px;
    margin-right: -13px;
    background-color: #006B63;
    border: solid 1px transparent;
    border-radius: 10px 10px 0 10px;
    display: flex;

    &::after {
      content: '';
      height: 15px;
      width: 13px;
      background-color: #044a46;
      position: absolute;
      bottom: -15px;
      margin-right: -1.3px;
      right: 0;
      clip-path: polygon(100% 0, 0% 100%, 0 0)
    }
  }

  .donation-info {
    color: #fff;
    font-size: 10px;
    border: solid 1px #fff;
    border-radius: 100px;
    padding: 0 5px 0 5px;
    margin-right: 12px;
    position: absolute;
    bottom: 32px;
    right: 0;
    cursor: pointer;
  }

  .donation-icon {
    padding: 5px;
    border: 1px solid #fff;
    border-radius: 50%;
    height: 38px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    svg path{
      stroke: #fff;
      fill: #006B63;
    }
    &:first-of-type svg {
      margin: 3px 0 0 1px;
    }
  }

  .donation-text {
    color: #fff;
  }

  .donation-text-sos {
    font-size: 12px;
  }
  .donation-text-money {
    font-size: 16px;
    font-weight: 600;
  }
  .donation-text-sale {
    font-size: 11px;
  }
</style>