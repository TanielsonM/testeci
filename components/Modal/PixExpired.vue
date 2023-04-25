<script setup lang="ts">
import { useModalStore } from "~~/store/modal/success";
import timer from "~~/assets/modal/timer.svg";

const modal = useModalStore();
</script>
<template>
  <p class="paragraph">
    {{ $t("pg_obrigado.pix.pix_expirado") }}
  </p>
  <div class="grid grid-cols-12 py-5">
    <div class="col-span-3">
      <div class="no-code">
        <img :src="timer" />
        <p class="paragraph bold">{{ $t("pg_obrigado.pix.expirou") }}</p>
      </div>
    </div>
    <div class="col-span-1"></div>
    <div class="col-span-8">
      <h2 class="title">{{ $t("pg_obrigado.pix.prazo_expirado") }}</h2>
      <p class="paragraph py-2">{{ $t("pg_obrigado.pix.expirado_1") }}</p>
      <p class="paragraph py-2">{{ $t("pg_obrigado.pix.expirado_2") }}</p>

      <BaseButton color="blue" size="vsm" class="my-5 md:max-w-[300px]">
        {{ $t("pg_obrigado.pix.gerar_novo") }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss">
.no-code {
  width: 178px;
  height: 178px;
  margin: 0 auto;
  text-align: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background: rgba(52, 131, 250, 0.05);
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 10px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}
.paragraph {
  &.bold {
    font-size: .8rem!important;
    color: #3483fa!important;
  }
}
</style>
