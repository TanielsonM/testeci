<script setup>

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
      <div class="donation-text">
        <span class="donation-text-sos">SOS Rio Grande do Sul</span><br>
        <span class="donation-text-money mr-1">R$ 100,50</span>
        <span class="donation-text-sos">Doado</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .donation-card {
    position: absolute;
    top: 275px;
    width: 240px;
    margin-right: -15px;
    background-color: #006B63;
    border: solid 1px transparent;
    border-radius: 5px;
    display: flex;

    &::after {
      content: '';
      height: 15px;
      width: 15px;
      background-color: #044a46;
      position: absolute;
      bottom: -14px;
      right: 0;
      clip-path: polygon(100% 0, 0% 100%, 0 0)
    }
  }

  .donation-icon {
    padding: 5px;
    border: 1px solid #fff;
    border-radius: 50%;
    height: 40px;
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
    font-size: 19px;
    font-weight: 600;
  }
</style>