<script setup lang="ts">
import { useModalStore } from "~~/store/modal/success";
import { useStepStore } from "~~/store/modules/steps";
import { ShippingSelected } from "@/types";
import * as Toast from "vue-toastification";

const { t } = useI18n();
const modal = useModalStore();
const stepsStore = useStepStore();

const { isMobile } = storeToRefs(stepsStore);
const emit = defineEmits(['openedPixEvent']);
const props = defineProps({
  name: {
    type: String,
    default: "",
    required: false,
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
    type: Number,
    default: 0,
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
  salesLength: {
    type: Number,
    required: true,
  },
  sales: {
    type: Array,
    required: false,
    default: () => {},
  },
  hasOrder: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  opened: {
    type: Number,
    required: false,
    default: 0,
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

const data = ref({
  shippingSelected: JSON.parse(props.shippingSelected) as ShippingSelected,
  showCode: false,
});

const displayCode = () => {
  emit("openedPixEvent", props.opened === props.id ? 0 : props.id);
};

const handleResize = () => {
  stepsStore.isMobile = window.matchMedia("(max-width: 768px)").matches;
};

onMounted(() => {
  if(process.client){
    handleResize();
    window.addEventListener("resize", handleResize);
  }
});

onBeforeUnmount(() => {
  if(process.client){
    window.removeEventListener("resize", handleResize);
  }
});
</script>
<template>
  <div v-if="!modal.expiredPix">
    <p class="paragraph" v-if="(!onlyButtons && !last) || salesLength == 1">
      {{ $t("pg_obrigado.pix.efetuando") }} Greenn Pagamentos e Tecnologia LTDA
      {{ $t("pg_obrigado.pix.ref") }};
    </p>
    <hr class="my-5" v-if="(!onlyButtons && !last) || salesLength == 1" />
    <p class="paragraph" v-if="onlyButtons || !last">
      {{ $t("pg_obrigado.pix.cole") }}
    </p>
    <div class="pix-data my-5 grid grid-cols-3 gap-3">
      <div
        v-if="salesLength == 1"
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
          class="col-span-2 mt-3 w-full md:hidden lg:col-span-1 lg:max-w-[180px]"
          >{{
            opened === id
              ? $t("pg_obrigado.pix.fechar_codigo")
              : $t("pg_obrigado.pix.ver_codigo")
          }}</BaseButton
        >

        <div
          class="w-full"
          v-if="opened === id && salesLength == 1 && isMobile"
        >
          <BaseTextarea
            class="my-5 w-full"
            :input-id="`ticket_${id}`"
            :disabled="true"
            :model-value="code"
            custom-class="readonly-button"
            :responsive="true"
          />
        </div>
      </div>
      <div
        class="col-span-3 flex h-full flex-col content-between justify-between"
        :class="salesLength > 1 ? 'md:col-span-3' : 'md:col-span-2'"
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
          <div class="item" v-if="!!shippingAmount || (!shippingAmount && shippingSelected.service_name === 'GRÁTIS')">
            <p>{{ $t("pg_obrigado.modal.frete") }}</p>
            <p>{{ shippingAmount || `Grátis` }}</p>
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
                : opened === id
                ? $t("pg_obrigado.pix.fechar_codigo")
                : $t("pg_obrigado.pix.ver_codigo")
            }}</BaseButton
          >
          <BaseButton
            :color="!onlyButtons ? 'blue' : 'bordered'"
            :size="!onlyButtons ? 'vsm' : 'md'"
            animation="pulse"
            class="col-span-2 md:col-span-1"
            @click="!onlyButtons ? copy(code) : modal.closeAction()"
            >{{
              !onlyButtons
                ? $t("pg_obrigado.pix.btn_text")
                : $t("pg_obrigado.pix.ja_fiz")
            }}</BaseButton
          >
        </div>
      </div>
    </div>
    <div class="w-full" v-if="opened === id && salesLength == 1 && !isMobile">
      <BaseTextarea
        class="w-full"
        :input-id="`ticket_${id}`"
        :disabled="true"
        :model-value="code"
        custom-class="readonly-button"
        :responsive="true"
      />
    </div>

    <div
      v-if="opened === id && salesLength > 1"
      class="flex w-full items-center justify-center"
    >
      <img :src="url" />
    </div>
    <hr v-if="!last" />
    <div class="details py-5" v-if="hasOrder">
      <h6 class="title">
        {{ $t("pg_obrigado.modal.detalhes_compra") }}
      </h6>
      <section v-for="(item, index) in sales" :key="index">
        <section class="item">
          <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
          <p>#{{ item.id }}</p>
        </section>
        <section class="item">
          <p>{{ item.offer.name }}</p>
          <p>{{ formatMoney(item.amount) }}</p>
        </section>
        <section class="item" v-if="item.shipping_amount">
          <p>{{ $t("pg_obrigado.modal.frete") }}</p>
          <p>{{ formatMoney(item.shipping_amount) }}</p>
        </section>
        <span
          class="my-[15px] flex h-[1px] w-full bg-gray-300"
          v-if="index + 1 !== sales.length"
        ></span>
      </section>
    </div>
    <div class="details py-5" v-if="onlyButtons && !hasOrder">
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
      <div class="item" v-if="!!shippingAmount">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ shippingAmount }}</p>
      </div>
    </div>
    <div
      class="details py-5"
      v-if="!!shippingAmount && onlyButtons && data?.shippingSelected"
    >
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
