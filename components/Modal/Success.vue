<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { formatMoney } from "@/utils/money";
import { Sale, ProductOffer } from "@/types";
import { useCheckoutStore } from "~~/store/checkout";
import { useModalStore } from "~~/store/modal/success";
import { useAmountStore } from "~~/store/modules/amount";

const productStore = useProductStore();
const amountStore = useAmountStore();
const checkoutStore = useCheckoutStore();
const { sales, productOffer } = storeToRefs(checkoutStore);

const route = useRoute();
const modal = useModalStore();
const { t } = useI18n();
const saleId = route.query.s_id;
const data = ref({
  sale: {} as Sale,
  productOffer: {} as ProductOffer,
  bump: {} as Sale,
  order: {} as any,
  chc: "",
});

if (
  (!!route.query.s_id && !route.query.chc) ||
  (!!route.query.s_id && !!route.query.chc)
) {
  const saleId = route.query.s_id;
  await checkoutStore.getSale(saleId);
  const sale: Sale = sales.value as Sale;
  data.value.sale = sale;

  switch (sale.sales[0].method) {
    case "BOLETO":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
    case "PIX":
      modal.setTitle(t("pg_obrigado.pix.text_header.info_completa"));
      break;
    case "PAYPAL":
    case "CREDIT_CARD":
    case "TWO_CREDIT_CARDS":
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
  if (!!chc) data.value.chc = chc.toString();

  const offer = route.query.offer;

  await checkoutStore.getProductOffer(route.params.product_id, offer);
  const pdtOffer: ProductOffer = productOffer.value as ProductOffer;
  data.value.productOffer = pdtOffer;

  modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));

  const closeAction = () => {
    window.location.href =
      data.value.productOffer.data.thank_you_page || "https://greenn.com.br";
  };

  modal.setAction(closeAction);
  modal.setIframe(data.value.productOffer.data.thank_you_page);

  const saleId = route.query.s_id;
  if (!!saleId) {
    await checkoutStore.getSale(saleId);
    const sale: Sale = sales.value as Sale;
    data.value.productOffer.data.total = sale.sales[0].total;
    data.value.chc = sale.sales[0].id.toString();
  }

  const queryKeys = Object.keys(route.query);

  await Promise.all(
    queryKeys.map(async (x) => {
      if (x.substr(0, 4) === "b_id") {
        if (route.query[x]?.includes("-s_id_")) {
          const query = route.query[x] as String;
          const saleId = query.split("-s_id_")[1];
          await checkoutStore.getSale(saleId);
          const bump: Sale = sales.value as Sale;
          data.value.bump = bump;
        }
      }
    })
  );
}
</script>

<template>
  <div v-if="data.sale?.sales?.length">
    <div class="container" v-if="data.sale.sales[0].method === 'BOLETO'">
      <ModalTicketInfos
        v-for="(sale, i) in data.sale.sales"
        :key="i"
        :code="data.sale?.order?.boleto_barcode ?? sale.boleto_barcode"
        :url="data.sale?.order?.boleto_url ?? sale.boleto_url"
        :id="sale.id.toString()"
        :installments="sale?.installments"
        :amount="formatMoney(sale.total || sale.amount || sale.product?.amount)"
        :last="i + 1 == data.sale.sales.length"
        :index="i"
        :name="sale.product.name"
        :shipping-amount="formatMoney(sale.shipping_amount)"
        :order="data.sale.order"
        :status="sale.status"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            @click="modal.closeAtion"
          >
            {{ $t("pg_obrigado.modal.entendido") }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-if="
        data.sale.sales[0].method === 'PIX' ||
        data.sale?.order?.method === 'PIX'
      "
    >
      <ModalPixInfos
        v-if="data.sale?.order"
        :code="data.sale?.order.qrcode"
        :url="data.sale?.order.imgQrcode"
        :id="data.sale?.order.id.toString()"
        :amount="formatMoney(data.sale?.order.total)"
        :only-buttons="true"
        :sales-length="1"
        :created-at="data.sale?.order.created_at.toString()"
        :has-order="true"
        :sales="data.sale.sales"
      />
      <template v-else>
        <ModalPixInfos
          v-for="(sale, i) in data.sale.sales"
          :key="i"
          :name="sale.product.name"
          :code="sale.qrcode"
          :url="sale.imgQrcode"
          :id="sale.id.toString()"
          :amount="
            formatMoney(sale.total || sale.amount || sale.product?.amount)
          "
          :last="i + 1 == data.sale.sales.length"
          :only-buttons="data.sale.sales.length == 1"
          :sales-length="data.sale.sales.length"
          :created-at="sale.created_at.toString()"
          :shipping-amount="formatMoney(sale.shipping_amount)"
          :shipping-selected="sale.shipping_selected"
        />
      </template>
    </div>
    <div
      class="container"
      v-if="
        data.sale.sales[0].method === 'CREDIT_CARD' ||
        data.sale.sales[0].method === 'TWO_CREDIT_CARDS' ||
        data.sale.sales[0].method === 'PAYPAL'
      "
    >
      <ModalCardInfos
        :id="data.sale.sales[0].id.toString()"
        :name="data.sale.sales[0].product.name"
        :installments="data.sale.sales[0].installments"
        :sales="data.sale.sales"
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
        :amount="
          formatMoney(
            data.productOffer.data.total || data.productOffer.data.amount
          )
        "
        :shipping-amount="
          data.productOffer.data.has_shipping_fee ??
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
        >
          {{ $t("pg_obrigado.modal.entendido") }}
        </BaseButton>
      </div>
    </div>
    <ClientOnly>
      <PixelClient
        :event="'conversion'"
        :product_id="productStore.product_id"
        :affiliate_id="checkoutStore.hasAffiliateId"
        :method="checkoutStore.method"
        :amount="data.productOffer.data.total"
        :original_amount="amountStore.getOriginalAmount"
        :sale_id="parseInt(saleId!.toString())"
        :chc_id="parseInt(data.chc)"
      />
    </ClientOnly>
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
      color: var(--txt-color);
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
