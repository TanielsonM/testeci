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
  bump: {} as Sale,
  chc: "",
};

if (!!route.query.s_id && !route.query.chc) {
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
    case "PAYPAL":
    case "CREDIT_CARD":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
  }

  const closeAction = () => {
    window.location.href =
      sale.sales[0].product.thank_you_page || "https://greenn.com.br";
  };

  modal.setAction(closeAction);
  modal.setIframe(sale.sales[0].product.thank_you_page);
} else {
  const chc = route.query.chc;
  if (!!chc) data.chc = chc.toString();

  const offer = route.query.offer;

  await checkout.getProductOffer(route.params.product_id, offer);
  const pdtOffer: ProductOffer = productOffer.value as ProductOffer;
  data.productOffer = pdtOffer;

  modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));

  const closeAction = () => {
    window.location.href =
      data.productOffer.data.thank_you_page || "https://greenn.com.br";
  };

  modal.setAction(closeAction);
  modal.setIframe(data.productOffer.data.thank_you_page);

  const saleId = route.query.s_id;
  if (!!saleId) {
    await checkout.getSale(saleId);
    const sale: Sale = sales.value as Sale;
    data.productOffer.data.amount = sale.sales[0].amount;
    data.chc = sale.sales[0].id.toString();
  }

  const queryKeys = Object.keys(route.query);
  await Promise.all(
    queryKeys.map(async (x) => {
      if (x.substr(0, 4) === "b_id") {
        if (route.query[x]?.includes("-s_id_")) {
          const query = route.query[x] as String;
          const saleId = query.split("-s_id_")[1];
          await checkout.getSale(saleId);
          const bump: Sale = sales.value as Sale;
          data.bump = bump;
        }
      }
    })
  );
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
        :index="i"
        :name="sale.product.name"
        :shipping-amount="formatMoney(sale.shipping_amount)"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            @click="modal.closeAtion"
            >{{ $t("pg_obrigado.modal.entendido") }}</BaseButton
          >
        </div>
      </div>
    </div>
    <div class="container" v-if="data.sale.sales[0].method == 'PIX'">
      <ModalPixInfos
        v-for="(sale, i) in data.sale.sales"
        :name="sale.product.name"
        :code="sale.qrcode!"
        :url="sale.imgQrcode!"
        :id="sale.id.toString()"
        :amount="formatMoney(sale.amount)"
        :last="i + 1 == data.sale.sales.length"
        :only-buttons="data.sale.sales.length == 1"
        :length="data.sale.sales.length"
        :created-at="sale.created_at.toString()"
        :shipping-amount="formatMoney(sale.shipping_amount)"
        :shipping-selected="sale.shipping_selected"
      />
    </div>
    <div
      class="container"
      v-if="
        data.sale.sales[0].method == 'CREDIT_CARD' ||
        data.sale.sales[0].method == 'PAYPAL'
      "
    >
      <ModalCardInfos
        :id="data.sale.sales[0].id.toString()"
        :amount="formatMoney(data.sale.sales[0].amount)"
        :name="data.sale.sales[0].product.name"
        :installments="data.sale.sales[0].installments"
        :shipping-amount="formatMoney(data.sale.sales[0].shipping_amount)"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            @click="modal.closeAtion"
            >{{ $t("pg_obrigado.modal.entendido") }}</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="!!data.productOffer?.data?.name">
    <div class="container">
      <ModalTrialInfos
        :name="data.productOffer.data.name"
        :amount="formatMoney(data.productOffer.data.amount)"
        :shipping-amount="
          formatMoney(data.productOffer.data.amount_fixed_shipping_fee)
        "
        :id="data.chc"
        :period="data.productOffer.data.trial"
        :bump="data.bump"
      />
    </div>
    <div class="actions mt-12 flex content-end justify-end">
      <div class="action">
        <BaseButton
          color="blue"
          size="md"
          animation="pulse"
          class="col-span-12 lg:col-span-4"
          @click="modal.closeAtion"
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
