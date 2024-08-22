<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { formatMoney } from "@/utils/money";
import { type Sale, type ProductOffer } from "@/types";
import { useProductStore } from "~~/store/product";
import { useLeadsStore } from "@/store/modules/leads";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useModalStore } from "~~/store/modal/success";
import { useAmountStore } from "~~/store/modules/amount";
import { resetReservations } from "@/utils/validateBatch";
import { usePersonalStore } from "~/store/forms/personal";
import { usePixelStore } from "~/store/modules/pixel";

const productStore = useProductStore();
const amountStore = useAmountStore();
const checkoutStore = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const storeLead = useLeadsStore()
const { sales, productOffer } = storeToRefs(checkoutStore);
const { product } = useProductStore();
const { batches,  } = usePreCheckoutStore();
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
const personalStore = usePersonalStore();
const pixelStore = usePixelStore();

const {
  getEventsDefault,
  getPurchaseSuccess,
  getOrderBumpPurchaseSuccess,
  getStartTrial,
  getPurchasePaid,
  getOrderBumpPurchasePaid
} = storeToRefs(pixelStore);

const route: any = useRoute();
const modal = useModalStore();
const { t } = useI18n();

const queryKeys = Object.keys(route.query);
const isEvent = queryKeys.some(x => x.includes('ticket_id'));

const saleId = isEvent
  ? route.query.s_id ? route.query.s_id : route.query[queryKeys[0]].split("-s_id_")[1]
  : route.query.s_id;

const current_query = new URLSearchParams(route.query);

const runtimeConfig = useRuntimeConfig();

const data = ref({
  sale: {} as Sale,
  productOffer: {} as ProductOffer,
  bump: {} as Sale,
  order: {} as any,
  chc: "",
  pixOpened: 0,
  ticket: {} as any
});

onMounted(() => {
  if (window.localStorage.getItem('reservations')) {
    localStorage.removeItem('reservations');
  }
})

if (
  (!!route.query.s_id && !route.query.chc) ||
  (!!route.query.s_id && !!route.query.chc) ||
  (!!isEvent && !route.query.chc)
) {
  await checkoutStore.getSale(saleId);
  const sale: Sale = sales.value as Sale;
  data.value.sale = sale;

  const thankYouData = sale.sales[0].product.custom_thank_you_pages || [];

  const customUrl: any = ref({
    PIX: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-pix}`,
    BOLETO: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-boleto}`,
    PAYPAL: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-cartao}`,
    CREDIT_CARD: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-cartao}`,
    TWO_CREDIT_CARDS: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-cartao}`,
    FREE: !!product.thank_you_page ? product.thank_you_page : `${runtimeConfig.public.BASE_URL}/obrigado-pagamento-free}`,
  });

  thankYouData.forEach(element => {
    switch (element.type) {
      case "PIX":
        customUrl.value.PIX = element.url;
        break;
      case "BOLETO":
        customUrl.value.BOLETO = element.url;
        break;
      case "PAYPAL":
        customUrl.value.PAYPAL = element.url;
        break;
      case "CREDIT_CARD":
        customUrl.value.CREDIT_CARD = element.url;
        break;
      case "TWO_CREDIT_CARD": 
        customUrl.value.TWO_CREDIT_CARDS = element.url;
        break;
      case "FREE": 
        customUrl.value.FREE = element.url;
        break;
    }
  });

  switch (sale.sales[0].method) {
    case "BOLETO":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
    case "PIX":
      modal.setTitle(t("pg_obrigado.pix.text_header.info_completa"));
      break;
    case "PAYPAL":
    case "CREDIT_CARD": 
    case "FREE":
    case "TWO_CREDIT_CARDS":
      modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));
      break;
  }

  /**
  * Verifica se existem parametros pra adicionar
  * Se contiver, adiciona os parâmetros de consulta (`current_query`).
  */
  const addQueryParams = (url: string) => {
    const urlObj = new URL(url);

    current_query.forEach((value, key) => {
      urlObj.searchParams.append(key, value);
    });
    return urlObj.toString();
  };

  const closeAction = () => {
    if (customUrl.value[sale.sales[0].method]) {
      window.location.href = addQueryParams(customUrl.value[sale.sales[0].method]);
    } else {
      const redirectTo = sale.sales[0].product.thank_you_page 
        ? addQueryParams(sale.sales[0].product.thank_you_page)
        : `${runtimeConfig.public.BASE_URL}/checkout-obrigado?${current_query.toString()}`;

      window.location.href = redirectTo;
    }
  };

  modal.setAction(closeAction);

  if (!!customUrl.value[sale.sales[0].method]) {
    modal.setIframe(addQueryParams(customUrl.value[sale.sales[0].method]));
  } else {
    modal.setIframe(addQueryParams(sale.sales[0].product.thank_you_page));
  }
} else {
  const chc = route.query.chc;
  if (!!chc) data.value.chc = chc.toString();

  const offer = route.query.offer;

  await checkoutStore.getProductOffer(route.params.product_id, offer);
  const pdtOffer: ProductOffer = productOffer.value as ProductOffer;
  data.value.productOffer = pdtOffer;

  modal.setTitle(t("pg_obrigado.modal.text_header.info_completa"));

  const closeAction = () => {
    const current_query = new URLSearchParams(route.query);

    if(!data.value.productOffer.data.thank_you_page){
      window.location.href = `${runtimeConfig.public.BASE_URL}/checkout-obrigado?${current_query.toString()}`;  
    }else{
      window.location.href =
      data.value.productOffer.data.thank_you_page + `?${current_query.toString()}` || runtimeConfig.public.BASE_URL;
    }
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

if(sellerHasFeatureTickets){
  resetReservations();
}
const computedAmountPixel = computed(() => {
  const sale: Sale = sales.value as Sale;
  if(sale?.sales?.length) {
    return sale.sales[0].amount
  }
  return amountStore.getAmount || amountStore.getOriginalAmount
})

function openPix(id: number) {
  data.value.pixOpened = id;
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
        :amount="formatMoney(sale.type === 'SUBSCRIPTION' && sale.offer.no_interest_installments ? sale.offer.amount : sale.total || sale.amount || sale.product?.amount)"
        :last="i + 1 == data.sale.sales.length"
        :index="i"
        :name="sale.product.name"
        :shipping-amount="formatMoney(sale.shipping_amount)"
        :shipping-selected="JSON.parse(sale.shipping_selected)"
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
            @click="modal.closeAction"
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
        :id="data.sale?.order.id"
        :amount="formatMoney(data.sale?.order.total)"
        :only-buttons="true"
        :sales-length="1"
        :created-at="data.sale?.order.created_at.toString()"
        :has-order="true"
        :sales="data.sale.sales"
        :opened="data.pixOpened"
        @openedPixEvent="openPix"
      />
      <template v-else>
        <ModalPixInfos
          v-for="(sale, i) in data.sale.sales"
          :key="i"
          :name="sale.product.name"
          :code="sale.qrcode"
          :url="sale.imgQrcode"
          :id="sale.id"
          :amount="formatMoney(sale.total || sale.amount || sale.product?.amount)"
          :last="i + 1 == data.sale.sales.length"
          :only-buttons="data.sale.sales.length == 1"
          :sales-length="data.sale.sales.length"
          :created-at="sale.created_at.toString()"
          :shipping-amount="formatMoney(sale.shipping_amount)"
          :shipping-selected="sale.shipping_selected ? JSON.parse(sale.shipping_selected) : {}"
          :sales="data.sale.sales"
          :opened="data.pixOpened"
          @openedPixEvent="openPix"
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
        :shipping-amount="data.sale.sales && data.sale.sales.length ? formatMoney(data.sale.sales[0].shipping_amount) : 0"
        :shipping-selected="data.sale.sales[0].shipping_selected"
        :only-buttons="data.sale.sales.length == 1"
        :product="product"
        :batches="batches"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            @click="modal.closeAction"
          >
            {{ $t("pg_obrigado.modal.entendido") }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-if="data.sale.sales[0].method === 'FREE'"
    >
      <ModalFreeInfos
        :id="data.sale.sales[0].id.toString()"
        :name="data.sale.sales[0].product.name"
        :sales="data.sale.sales"
      />

      <div class="actions mt-12 flex content-end justify-end">
        <div class="action">
          <BaseButton
            color="blue"
            size="md"
            animation="pulse"
            class="col-span-12 lg:col-span-4"
            @click="modal.closeAction"
          >
            {{ $t("pg_obrigado.modal.entendido") }}
          </BaseButton>
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
          @click="modal.closeAction"
        >
          {{ $t("pg_obrigado.modal.entendido") }}
        </BaseButton>
      </div>
    </div>
  </div>

  <ClientOnly class="hidden">
    <PixelClient
      v-if="getEventsDefault && !(!data.sale?.sales?.length && !!data.productOffer?.data?.name)"
      :event="'conversion'"
      :product_id="productStore.product_id"
      :affiliate_id="checkoutStore.hasAffiliateId"
      :method="checkoutStore.method"
      :amount="computedAmountPixel"
      :original_amount="productStore.product.amount"
      :sale_id="saleId ? parseInt(saleId!.toString()) : undefined"
      :chc_id="parseInt(data.chc)"
      :product_name="productStore.productName"
      :productCategory="productStore.productCategory"
      :name="personalStore.name"
      :products="checkoutStore.sales"
      :email="personalStore.email"
      :cellphone="personalStore.cellphone"
      :uuid="storeLead.uuid"
      :address="storeLead.address"
      :seller_id="productStore.product.seller_id"
    />

    <PixelClient
      v-if="getPurchaseSuccess && !(!data.sale?.sales?.length && !!data.productOffer?.data?.name)"
      :event="'Purchase'"
      :product_id="productStore.product_id"
      :affiliate_id="checkoutStore.hasAffiliateId"
      :method="checkoutStore.method"
      :amount="computedAmountPixel"
      :original_amount="productStore.product.amount"
      :sale_id="saleId ? parseInt(saleId!.toString()) : undefined"
      :chc_id="parseInt(data.chc)"
      :product_name="productStore.productName"
      :productCategory="productStore.productCategory"
      :name="personalStore.name"
      :products="checkoutStore.sales"
      :email="personalStore.email"
      :cellphone="personalStore.cellphone"
      :uuid="storeLead.uuid"
      :address="storeLead.address"
      action="on_payment_success"
      :seller_id="productStore.product.seller_id"
    />

    <PixelClient
      v-if="(getPurchasePaid && checkoutStore.method === 'CREDIT_CARD') && !(!data.sale?.sales?.length && !!data.productOffer?.data?.name)"
      :event="'Purchase'"
      :product_id="productStore.product_id"
      :affiliate_id="checkoutStore.hasAffiliateId"
      :method="checkoutStore.method"
      :amount="computedAmountPixel"
      :original_amount="productStore.product.amount"
      :sale_id="saleId ? parseInt(saleId!.toString()) : undefined"
      :chc_id="parseInt(data.chc)"
      :product_name="productStore.productName"
      :productCategory="productStore.productCategory"
      :name="personalStore.name"
      :products="checkoutStore.sales"
      :email="personalStore.email"
      :cellphone="personalStore.cellphone"
      :uuid="storeLead.uuid"
      :address="storeLead.address"
      action="on_payment_paid"
      :seller_id="productStore.product.seller_id"
    />

    <template v-for="(bumpSale, i) in checkoutStore?.sales?.sales">
      <PixelClient
        v-if="i > 0 && getOrderBumpPurchaseSuccess && !(!data.sale?.sales?.length && !!data.productOffer?.data?.name) && checkoutStore?.sales?.sales?.length > 1"
        :key="bumpSale.product_id"
        :event="'OrderBumpPurchase'"
        :product_id="bumpSale.product_id"
        :affiliate_id="checkoutStore.hasAffiliateId"
        :method="checkoutStore.method"
        :amount="bumpSale.amount"
        :original_amount="bumpSale.original_amount"
        :sale_id="bumpSale.id"
        :chc_id="parseInt(data.chc)"
        :product_name="bumpSale.offer.name"
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :products="checkoutStore.sales"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_payment_success"
        :seller_id="productStore.product.seller_id"
      />
    </template>

    <template v-for="(bumpSale, i) in checkoutStore?.sales?.sales">
      <PixelClient
        v-if="i > 0 && (getOrderBumpPurchasePaid && checkoutStore.method === 'CREDIT_CARD') && !(!data.sale?.sales?.length && !!data.productOffer?.data?.name) && checkoutStore?.sales?.sales?.length > 1"
        :key="bumpSale.product_id"
        :event="'OrderBumpPurchase'"
        :product_id="bumpSale.product_id"
        :affiliate_id="checkoutStore.hasAffiliateId"
        :method="checkoutStore.method"
        :amount="bumpSale.amount"
        :original_amount="bumpSale.original_amount"
        :sale_id="bumpSale.id"
        :chc_id="parseInt(data.chc)"
        :product_name="bumpSale.offer.name"
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :products="checkoutStore.sales"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_payment_paid"
        :seller_id="productStore.product.seller_id"
      />
    </template>

    <PixelClient
      v-if="getStartTrial && !data.sale?.sales?.length && !!data.productOffer?.data?.name"
      :event="'StartTrial'"
      :product_id="productStore.product_id"
      :affiliate_id="checkoutStore.hasAffiliateId"
      :method="checkoutStore.method"
      :amount="computedAmountPixel"
      :original_amount="productStore.product.amount"
      :sale_id="saleId ? parseInt(saleId!.toString()) : undefined"
      :chc_id="parseInt(data.chc)"
      :product_name="productStore.productName"
      :productCategory="productStore.productCategory"
      :name="personalStore.name"
      :products="checkoutStore.sales"
      :email="personalStore.email"
      :cellphone="personalStore.cellphone"
      :uuid="storeLead.uuid"
      :address="storeLead.address"
      :seller_id="productStore.product.seller_id"
    />

  </ClientOnly>
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