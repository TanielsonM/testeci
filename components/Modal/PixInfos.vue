<script setup lang="ts">
import { useModalStore } from "~~/store/modal/success";
import { ShippingSelected } from "@/types";
import * as Toast from "vue-toastification";

const { t } = useI18n();
const modal = useModalStore();

const props = defineProps({
  name: {
    type: String,
    default: "",
    required: true,
  },
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
  shippingAmount: {
    type: String,
    default: null,
    required: false,
  },
  shippingSelected: {
    type: String,
    default: null,
    required: false,
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

const copy = async (code: string) => {
  await navigator.clipboard.writeText(code);
  const toast = Toast.useToast();
  toast.info(
    `${t("pg_obrigado.modal.copiado")}\n${t(
      "pg_obrigado.modal.codigo_copiado"
    )}`
  );
};

let data = {
  shippingSelected: JSON.parse(props.shippingSelected) as ShippingSelected,
  showCode: false,
};

const displayCode = () => {
  data.showCode = !data.showCode;
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
          @click="copy(code)"
          >{{ $t("pg_obrigado.pix.btn_text") }}</BaseButton
        >
        <BaseButton
          v-if="!modal.expiredPix"
          color="bordered"
          size="md"
          animation="pulse"
          @click="displayCode"
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
            <p>{{ name }}</p>
            <p>{{ amount }}</p>
          </div>
          <div class="item" v-if="!!shippingAmount">
            <p>{{ $t("pg_obrigado.modal.frete") }}</p>
            <p>{{ shippingAmount }}</p>
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
            @click="displayCode()"
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
            @click="!onlyButtons ? copy(code) : modal.closeAtion()"
            >{{
              !onlyButtons
                ? $t("pg_obrigado.pix.btn_text")
                : $t("pg_obrigado.pix.ja_fiz")
            }}</BaseButton
          >
        </div>
      </div>
    </div>
    <div v-if="data.showCode">
      <BaseTextarea
        class="w-full"
        :input-id="`ticket_${id}`"
        :readonly="true"
        :model-value="code"
        custom-class="readonly-button"
      />
    </div>
    <hr v-if="!last" />
    <div class="details py-5" v-if="!!shippingAmount">
      <h6 class="title">
        {{ $t("pg_obrigado.modal.detalhes_compra") }}
      </h6>

      <div class="item">
        <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
        <p>#{{ id }}</p>
      </div>
      <div class="item">
        <p>{{ name }}</p>
        <p>{{ amount }}</p>
      </div>
      <div class="item">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ shippingAmount }}</p>
      </div>
    </div>
    <div class="details py-5" v-if="!!shippingAmount">
      <h6 class="title">
        {{ $t("pg_obrigado.modal.frete_selecionado") }}
      </h6>

      <div class="item frete">
        <div class="grid grid-cols-12 items-center gap-3">
          <div class="col-span-4">
            <img
              :src="data.shippingSelected.frete.company.picture"
              width="80"
            />
          </div>
          <div class="col-span-4">
            {{ data.shippingSelected.frete.name }}
          </div>
          <div class="col-span-4">
            {{ data.shippingSelected.frete.delivery_range.min }}
            {{ $t("checkout.address.at") }}
            {{ data.shippingSelected.frete.delivery_range.max }}
            {{ $t("checkout.address.working_days") }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalPixExpired v-if="modal.expiredPix" />
</template>
<style lang="scss">
.frete {
  background: #f7f7f7;
  border-radius: 5px;
  padding: 15px;

  div {
    font-size: 0.93rem;
  }
}
</style>
