<script setup lang="ts">
import { useModalStore } from "~~/store/modal/success";
const modal = useModalStore();

defineProps({
  code: {
    type: String,
    default: "",
    required: true,
  },
  url: {
    type: String,
    default: "",
    required: true,
  },
  id: {
    type: String,
    default: "",
    required: true,
  },
  amount: {
    type: String,
    default: "",
    required: true,
  },
  last: {
    type: Boolean,
    default: false,
  },
  onlyButtons: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
});

const openTicket = (url: any) => {
  window.open(url);
};

const copy = async (code: string) => {
  await navigator.clipboard.writeText(code);
};
</script>
<template>
  <div v-if="!modal.expiredPix">
    <p class="paragraph" v-if="(!onlyButtons && !last) || length == 1">
      {{ $t("pg_obrigado.pix.efetuando") }} GD Marketing e Tecnologia LTDA
      {{ $t("pg_obrigado.pix.ref") }};
    </p>
    <hr class="my-5" v-if="(!onlyButtons && !last) || length == 1" />
    <p class="paragraph" v-if="onlyButtons || !last">
      {{ $t("pg_obrigado.pix.cole") }}
    </p>
    <div class="pix-data my-5 grid grid-cols-3 gap-3">
      <div
        v-if="length == 1"
        class="col-span-3 flex h-full flex-col items-center md:col-span-1 md:max-w-[200px]"
      >
        <img :src="url" v-if="!modal.expiredPix" />
        <p class="paragraph small" v-if="!modal.expiredPix">
          {{ $t("pg_obrigado.pix.expira_em") }}
          <ModalCounter :countdown-date="createdAt.toString()" />
        </p>
        <BaseButton
          v-if="!modal.expiredPix"
          color="blue"
          size="md"
          animation="pulse"
          class="col-span-2 mt-3 w-full lg:col-span-1 lg:max-w-[180px]"
          @click="($event) => copy(code)"
          >{{ $t("pg_obrigado.pix.btn_text") }}</BaseButton
        >
        <BaseButton
          v-if="!modal.expiredPix"
          color="bordered"
          size="md"
          animation="pulse"
          class="col-span-2 mt-3 block w-full md:hidden lg:col-span-1 lg:max-w-[180px]"
          >{{ $t("pg_obrigado.pix.ver_codigo") }}</BaseButton
        >
      </div>
      <div
        class="col-span-3 flex h-full flex-col content-between justify-between"
        :class="length > 1 ? 'md:col-span-3' : 'md:col-span-2'"
        v-if="!modal.expiredPix"
      >
        <div v-if="!last || onlyButtons">
          <h6 class="subtitle my-3">
            {{ $t("pg_obrigado.pix.escaneie") }}
          </h6>
          <p class="paragraph">
            <span>01.</span> {{ $t("pg_obrigado.pix.step_01") }}
          </p>
          <p class="paragraph">
            <span>02.</span> {{ $t("pg_obrigado.pix.step_02") }}
          </p>
          <p class="paragraph mb-3">
            <span>03.</span> {{ $t("pg_obrigado.pix.step_03") }}
          </p>
          <p class="paragraph mb-5">
            ⚡ {{ $t("pg_obrigado.pix.creditado_na_hora") }}
          </p>
        </div>
        <div class="details py-5" v-if="!onlyButtons">
          <h6 class="title" v-if="!last">
            {{ $t("pg_obrigado.modal.detalhes_compra") }}
          </h6>

          <div class="item">
            <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
            <p>#{{ id }}</p>
          </div>
          <div class="item">
            <p>Venda</p>
            <p>{{ amount }}</p>
          </div>
        </div>

        <div
          v-if="!modal.expiredPix"
          class="grid grid-cols-2 gap-3"
          :class="!onlyButtons ? 'pb-5' : ''"
        >
          <BaseButton
            color="bordered"
            :size="!onlyButtons ? 'vsm' : 'md'"
            animation="pulse"
            class="col-span-2 hidden md:col-span-1 md:block"
            >{{
              !onlyButtons
                ? $t("pg_obrigado.pix.btn_visualizar_qr")
                : $t("pg_obrigado.pix.ver_codigo")
            }}</BaseButton
          >
          <BaseButton
            :color="!onlyButtons ? 'blue' : 'bordered'"
            :size="!onlyButtons ? 'vsm' : 'md'"
            animation="pulse"
            class="col-span-2 md:col-span-1"
            @click="($event) => copy(code)"
            >{{
              !onlyButtons
                ? $t("pg_obrigado.pix.btn_text")
                : $t("pg_obrigado.pix.ja_fiz")
            }}</BaseButton
          >
        </div>
      </div>
    </div>
    <hr v-if="!last" />
  </div>
  <ModalPixExpired
    v-if="modal.expiredPix"
  />
</template>
