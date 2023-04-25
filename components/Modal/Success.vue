<script setup lang="ts">
import { storeToRefs } from "pinia";
import { formatMoney } from "@/utils/money";
import { useCheckoutStore } from "~~/store/checkout";
import { useModalStore } from "~~/store/modal/success";
import { useI18n } from "vue-i18n";
import { Sale, ProductOffer } from "@/types";

const route = useRoute();
const checkout = useCheckoutStore();
const modal = useModalStore();
const { sales, productOffer } = storeToRefs(checkout);
const { t } = useI18n();

defineProps({
  type: {
    type: String,
    default: "ticket",
  },
});

const data = {
  sale: {} as Sale,
  productOffer: {} as ProductOffer,
  chc: "",
};

if (!!route.query.s_id) {
  const saleId = route.query.s_id;
  await checkout.getSale(saleId);
  const sale: Sale = sales.value as Sale;
  data.sale = sale;

  switch (sale.sales[0].method) {
    case "BOLETO":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
    case "PIX":
      modal.setTitle(t("pg_obrigado.pix.text_header.info_completa"));
      break;
    case "CREDIT_CARD":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
  }
} else {
  const chc = route.query.chc;
  if (!!chc) data.chc = chc.toString();

  const offer = route.query.offer;

  await checkout.getProductOffer(route.params.product_id, offer);
  const pdtOffer: ProductOffer = productOffer.value as ProductOffer;
  data.productOffer = pdtOffer;

  modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
  console.log(data.productOffer);
}
</script>
<template>
  <div v-if="!!data.sale?.sales?.length">
    <div class="container" v-if="data.sale.sales[0].method == 'BOLETO'">
      <ModalTicketInfos
        v-for="(sale, i) in data.sale.sales"
        :code="sale.boleto_barcode!"
        :url="sale.boleto_url!"
        :id="sale.id.toString()"
        :amount="formatMoney(sale.amount)"
        :last="i + 1 == data.sale.sales.length"
        :name="sale.product.name"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            >{{ $t("pg_obrigado.modal.entendido") }}</BaseButton
          >
        </div>
      </div>
    </div>
    <div class="container" v-if="data.sale.sales[0].method == 'PIX'">
      <ModalPixInfos
        v-for="(sale, i) in data.sale.sales"
        :code="sale.qrcode!"
        :url="sale.imgQrcode!"
        :id="sale.id.toString()"
        :amount="formatMoney(sale.amount)"
        :last="i + 1 == data.sale.sales.length"
        :only-buttons="data.sale.sales.length == 1"
        :length="data.sale.sales.length"
        :created-at="sale.created_at.toString()"
      />
    </div>
    <div class="container" v-if="data.sale.sales[0].method == 'CREDIT_CARD'">
      <ModalCardInfos
        :id="data.sale.sales[0].id.toString()"
        :amount="formatMoney(data.sale.sales[0].amount)"
        :name="data.sale.sales[0].product.name"
        :installments="data.sale.sales[0].installments"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            >{{ $t("pg_obrigado.modal.entendido") }}</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="!!data.productOffer">
    <div class="container">
      <ModalTrialInfos
        :name="data.productOffer.data.name"
        :amount="formatMoney(data.productOffer.data.amount)"
        :id="data.chc"
        :period="data.productOffer.data.trial"
      />
    </div>
    <div class="actions mt-12 flex content-end justify-end">
      <div class="action">
        <BaseButton
          color="blue"
          size="md"
          animation="pulse"
          class="col-span-12 lg:col-span-4"
          >{{ $t("pg_obrigado.modal.entendido") }}</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content {
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    padding: 1rem 1rem 0rem 1rem;

    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
      max-width: 300px;
    }

    .close {
      background-image: url(../../assets/modal/close.svg);
      background-repeat: no-repeat;
      background-position: right;

      width: 50px;
      height: 20px;
    }
  }

  .container {
    padding: 1rem 1rem;

    .subtitle {
      font-weight: 600;
      font-size: 15px;
    }

    .paragraph {
      line-height: 1.5;
      color: var(--text-color);
      margin-top: 7px;
      font-size: 14px;
      font-weight: 400;

      &.small {
        font-size: 13px;
      }

      &.bold {
        font-weight: 600;
      }

      .timer {
        color: #3483fa;
        font-weight: 600;
      }

      span {
        font-weight: 600;
      }
    }

    .details {
      .title {
        font-weight: 600;
        margin: 0;
        color: #3483fa;
        margin: 15px 0;
        font-size: 1rem;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        p {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          line-height: 2;
        }
      }
    }
  }
}
</style>
