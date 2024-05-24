<template>
  <div>
    <p class="mb-3 text-[16px] font-[700] text-main-color">
      {{ $t("pre_checkout.payment_methods") }}
    </p>
    <div
      class="flex items-center justify-center"
      style="filter: grayscale(1); opacity: 0.6"
    >
      <img src="@/assets/paymentMethods/greenn.svg" alt="greenn" />
      <img src="@/assets/paymentMethods/visa.svg" alt="visa" />
      <img src="@/assets/paymentMethods/master-card.svg" alt="master-card" />
      <img src="@/assets/paymentMethods/hipercard.svg" alt="hipercard" />
      <img src="@/assets/paymentMethods/diners-club.svg" alt="diners-club" />
      <img src="@/assets/paymentMethods/elo.svg" alt="elo" />
      <img src="@/assets/paymentMethods/boleto.svg" alt="boleto" />
      <img src="@/assets/paymentMethods/pix.svg" alt="pix" />
    </div>
  </div>
</template>
