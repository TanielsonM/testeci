<script setup>
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useAddressStore } from "@/store/forms/address";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePaymentStore } from "~~/store/modules/payment";
import { useStepStore } from "~~/store/modules/steps";
import { useAmountStore } from "~~/store/modules/amount";
import { showUnloadAlertCheckout, showBeforeBackNavigation } from "@/utils/validateBatch";
import { storeToRefs } from "pinia";
import { useLeadsStore } from "@/store/modules/leads";
import { usePersonalStore } from "~/store/forms/personal";
import { usePurchaseStore } from "~/store/forms/purchase";
import { usePixelStore } from "~/store/modules/pixel";

const nuxtApp = useNuxtApp();


// Stores
const purchase = usePurchaseStore();
const customCheckoutStore = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const address = useAddressStore();
const payment = usePaymentStore();
const stepsStore = useStepStore();
const amountStore = useAmountStore();
const storeLead = useLeadsStore()
const route = useRoute();
const personalStore = usePersonalStore()
const purchaseStore = usePurchaseStore()
const pixelStore = usePixelStore()
// Variables
const { t, locale } = useI18n();
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
const { product, hasTicketInstallments } = storeToRefs(productStore);
const { sameAddress, charge, shipping } = storeToRefs(address);
const { first, second } = storeToRefs(purchase);
const { product_list, assoc_ticket } = storeToRefs(checkout);
const { $moment } = useNuxtApp();
const {
  getEventsDefault,
  getPageView,
  getViewContent,
  getInitiateCheckoutOnAccess,
  getInitiateCheckoutOnFilledData,
  getAddPaymentInfo,
  getAddToCartOnMainProduct,
  getAddToCartOnOrderBump,
  getPurchaseTry,
  getOrderBumpPurchaseTry,
  getSwitchProductList,
} = storeToRefs(pixelStore);
const { isFormValidWithoutDocument } = storeToRefs(personalStore)
const { isPurchaseFormValid } = storeToRefs(purchaseStore)

const {
  method,
  allowed_methods,
  captchaEnabled,
  hasAffiliateId,
  product_id,
  selectedCountry,
  hasCustomCheckout,
  getMethodChange
} = storeToRefs(checkout);

const { currentStep, getCountSteps, isMobile } = storeToRefs(stepsStore);
const { error_message, isPaymentLoading, isPaymentFetching } = storeToRefs(payment);
const {
  isOneStep,
  custom_checkout,
  hasNotifications
} = storeToRefs(customCheckoutStore);

// Refs
const pixelComponentKey = 1;
const alert_modal = ref(false);
const hasClickPayment = ref(false);


// Computeds
const pixelProductIds = computed(()=> {
  return product_list.value
    .filter((item) => item.product_id != productStore.product_id)
    .map((item) => item.product_id);
})

const tabs = computed(() => {
  return allowed_methods.value.map((item) => {
    switch (item) {
      case "CREDIT_CARD":
        return {
          value: [item, "TWO_CREDIT_CARDS"],
          label: t("checkout.pagamento.metodos.cartao_credito"),
          icon: "bi:credit-card-fill",
        };
      case "BOLETO":
        return {
          value: item,
          label: t("checkout.pagamento.metodos.boleto"),
          icon: "fa-solid:file-invoice-dollar",
        };
      case "PAYPAL":
        return {
          value: item,
          label: t("checkout.pagamento.metodos.paypal.paypal"),
          icon: "mdi:paypal",
        };
      case "PIX":
        return {
          value: item,
          label: t("checkout.pagamento.metodos.pix.pix"),
          icon: "material-symbols:qr-code",
        };
    }
  });
});

const handleResize = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches;
};

function setInternationalURL() {
  if (selectedCountry.value !== "BR" && !!product.value.seller.is_heaven && !(useRuntimeConfig().public.INTERNATIONAL_URL).includes('localhost')) {
    let currentUrl = new URL(window.location.href);
    const international_url = new URL(useRuntimeConfig().public.INTERNATIONAL_URL);
    currentUrl.host = international_url.host;
    currentUrl.protocol = international_url.protocol;
    currentUrl.port = "";
    window.location = currentUrl.href;
  }
}

onMounted(() => {
  if (process.client) {
    // validar se for evento presencial e localStorage estiver vazio e pinia tb das reservas, jogar de volta pro precheckout
    if (product?.value?.product_type_id == 3 && sellerHasFeatureTickets?.value) {
      // Quando o usuário clica em voltar no navegador
      window.addEventListener('popstate', showBeforeBackNavigation);

      if (product_list?.value?.length) {
        window.addEventListener('beforeunload', showUnloadAlertCheckout);
        checkout.setCoupon(true);
      } else {
        const route = useRoute();
        const queryParams = new URLSearchParams(route.query).toString();
        navigateTo(`/pre-checkout/${route.params?.product_id}${queryParams ? `?${queryParams}` : ''}`);
      }
      if (sellerHasFeatureTickets.value && product_list.value.length == 1) {
        checkout.setAssocTicket(true);
      } else {
        checkout.setAssocTicket(false);
      }
        
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("myRecaptchaCallback", () => {
      payment.payment(locale.value);
    });
    setInternationalURL()
  }
});

onBeforeUnmount(() => {
  if (product?.value?.product_type_id == 3 && sellerHasFeatureTickets?.value) {
    window.removeEventListener('popstate', showBeforeBackNavigation);
    window.removeEventListener('beforeunload', showUnloadAlertCheckout);
  }
  window.removeEventListener("resize", handleResize);
});

// Watch`s
watch(method, (method) => {
  checkout.setMethod(method);
});

watch(selectedCountry, () => {
  if (process.client) {
    setInternationalURL()
  }
});

watch(error_message, (val) => {
  if (val) alert_modal.value = true;
});

watch(sameAddress, (val) => {
  if (!val) {
    shipping.value.zipcode = "";
    shipping.value.number = "";
    shipping.value.street = "";
    shipping.value.neighborhood = "";
    shipping.value.city = "";
    shipping.value.state = "";
    shipping.value.complement = "";
  }
  checkout.calculateShipping(
    val ? charge.value.zipcode : shipping.value.zipcode
  );
});

// Functions
function closeModal() {
  payment.setPaymentLoading(false);
  payment.setPaymentFetching(false);
  alert_modal.value = false;
  error_message.value = "";
}

const timeStemp = ref(null);

async function callPayment() {
  hasClickPayment.value = true

  const newDateTimeStemp = new Date();
  
  if(timeStemp.value && (newDateTimeStemp.getTime() - timeStemp.value) < 1000) return
  timeStemp.value = newDateTimeStemp.getTime();
  if(!isPaymentFetching.value) {
    if (captchaEnabled.value) {
      //não colocar await pois nenhuma dessa funções retornam promises
      //https://developers.google.com/recaptcha/docs/display?hl=pt-br#js_api
      window.grecaptcha.reset();
      window.grecaptcha.execute();
    } else {
      await payment.payment(locale.value).finally(() => {
        payment.setPaymentLoading(false);
        payment.setPaymentFetching(false);
      })
    }
  }
}

function incrementSteps() {
  if (getCountSteps.value != 3) {
    stepsStore.incrementCount();
  }
}

function decreaseCount() {
  if (getCountSteps.value === 3) {
    stepsStore.decreaseCount();
  }
}

if (hasAffiliateId.value) {
  const affiliate_id = useCookie(`affiliate_${product_id.value}`);
  const affiliate = useCookie("affiliate");
  affiliate_id.value = hasAffiliateId.value;
  affiliate.value = hasAffiliateId.value;
}

if (selectedCountry.value !== "BR" && !!product.value.seller.is_heaven) {
  if (process.client) {
    window.location.href = `https://payu.greenn.com.br/${product_id.value}`;
  }
}

const dateEvent = computed(() => {
  return formatEventStartDate(product.value?.start_date);
});

function formatEventStartDate(Date) {
    const startDate = $moment(Date); 
    const dayOfWeek = startDate.format('ddd'); 
    const dateFormatted = startDate.format('D MMM, YYYY'); 
    const startDateConcat = `${dayOfWeek}, ${dateFormatted}`; 
    return startDateConcat;
}

await checkout.init().then(() => {
  let ogTitle = product?.value?.format == "EVENT" && product?.value?.product_type_id == 3 && sellerHasFeatureTickets?.value ? "Greenn Tickets" : "Greenn";
  if (product?.value?.name && product?.value?.format == "EVENT" && product?.value?.product_type_id == 3 && sellerHasFeatureTickets?.value) {
    ogTitle = `${product?.value?.name} | ${dateEvent.value} | Greenn Tickets`;
  }else{
    ogTitle = `${product?.value?.name} | Greenn`;
  }
  let ogDescription = "A plataforma de pagamento simples";
  if (product?.value?.description) {
    ogDescription = product.value.description;
  }

  let currentUrlOg = ""
  if (!process.client) {
    currentUrlOg = `https://payfast.greenn.com.br/${route.fullPath}`
  } else {
    currentUrlOg = window.location.href;
  }
  let urlForOG = new URL(currentUrlOg);
  urlForOG.searchParams.forEach((value, key) => urlForOG.searchParams.delete(key));



  nuxtApp.runWithContext(() =>
    useSeoMeta({
      ogTitle: ogTitle,
      ogDescription: ogDescription,
      ogType: "website",
      ogUrl: urlForOG.href,
      ogImage: product?.value?.images[0]?.path || "https://paystatic.greenn.com.br/og-image_greenn.png",
      ogImageHeight: "500",
      ogImageWidth: "500",
      ogSiteName: "Greenn - A plataforma de pagamentos simples",
    })
  );
});

onMounted(() => {
  if (process.client) {
    if (!!hasCustomCheckout.value && !!hasNotifications.value) {
      customCheckoutStore.setNotifications(
        `${custom_checkout.value.maximum_purchase_notification_interval}, ${custom_checkout.value.minimum_purchase_notification_interval}`,
        custom_checkout.value.how_get_purchase_notification,
        custom_checkout.value.quantity_purchase_notification,
        custom_checkout.value.type_purchase_notification
      );
    }
  }
});

const isCustomOne = computed(() => {
  if(isOneStep?.value){
    if(checkout?.showAddressStep){
      return true;
    }
    return checkout?.showAddressStep;
  }
  return isOneStep?.value;
});
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Greenn</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <NuxtLayout>
    <section class="flex w-full max-w-[520px] flex-col gap-10 lg:max-w-[780px] xl:min-w-[780px]">
      <!-- Purchase card -->
      <BaseCard class="w-full p-5 md:px-[60px] md:py-[50px]">
        <BaseButton color="transparent" size="sm" class="mb-4" v-if="currentStep > 1 && currentStep <= 3 && isMobile && !isOneStep" @click="stepsStore.back()">
          <div class="flex items-start justify-start text-left">
            <Icon name="mdi:arrow-left" class="mr-4" size="20" />
            <p class="text-left">{{ $t("checkout.steps.back") }}</p>
          </div>
        </BaseButton>
        <!-- Personal form -->
        <Steps :title="$t('components.steps.personal_data')" step="01" v-if="(isMobile && currentStep == 1) || !isMobile || isOneStep">
          <template #end-line>
            <LocaleSelect />
          </template>
          <template #content>
            <FormPersonal :class="product?.method !== 'FREE' ? 'mb-8' : ''" />
          </template>
        </Steps>
        <!-- Address form -->
        <Steps :title="$t('components.steps.address')" step="02" v-if="
        (checkout.showAddressStep && ((isMobile && currentStep == 2) || !isMobile) || isCustomOne)
          " @mounted="incrementSteps">
          <template #content>
            <FormAddress />
            <BaseToogle v-if="checkout.hasPhysicalProduct && product?.method !== 'FREE'" class="my-5" v-model:checked="sameAddress" id="address-form" :label="$t('general.address_toogle_label')" />
            <Steps :title="$t('general.delivery_address')" icon="📦" v-if="!sameAddress">
              <template #content>
                <br />
                <FormAddress type="shipping" />
              </template>
            </Steps>
            <FormShippingOption v-if="product?.has_shipping_fee === 1 &&
              product?.type_shipping_fee == 'DYNAMIC'
              " :options="product.shipping_options ?? []" />
          </template>
        </Steps>
        <!-- Purchase Form -->
        <Steps :title="$t('checkout.pagamento.title')" :step="checkout.showAddressStep ? '03' : '02'" :free="product?.method !== 'FREE' ? false : true" v-if="(isMobile && currentStep == (checkout.showAddressStep ? 3 : 2)) ||
          !isMobile ||
          isOneStep
          ">
          <template #content>
            <section class="flex w-full flex-col gap-8">
              <template v-if="product?.method !== 'FREE'">
                <BaseTabs v-model="method" :tabs="tabs" :is-mobile="isMobile" />
                <template v-if="method !== 'PIX'">
                  <FormPurchase />
                </template>
              </template>
            </section>
            <div v-if="method == 'TWO_CREDIT_CARDS'" class="information-cards">
              <span class="information-cards-span"> 
                {{$t('checkout.pagamento.metodos.dois_cartoes.cards_information.start')}}
                {{`
                  ${first.amount} ${$t("checkout.pagamento.metodos.dois_cartoes.cards_information.middle")} ${first.number.length == 19 ? first.number.slice(-4) : '****'}${$t("checkout.pagamento.metodos.dois_cartoes.cards_information.middle_2")}
                  ${second.amount} ${$t("checkout.pagamento.metodos.dois_cartoes.cards_information.end")} ${second.number.length == 19 ? second.number.slice(-4) : '****'}.
                `}}
              </span>
            </div>
            <!-- Bumps -->
            <template v-if="checkout.getBumpList.length && !hasTicketInstallments && product?.method !== 'FREE' && !checkout.hasFreeBump">
              <p class="my-5 w-full text-txt-color">
                {{
                  customCheckoutStore.hasCustomBump
                  ? customCheckoutStore.bump_options.title
                  : `${$t("checkout.pagamento.bump.title")} 🔥`
                }}
              </p>
              <OrderBumps v-for="(bump, index) in checkout.getBumpList" :key="index" :bump="bump" :class="{ 'mb-5': checkout.getBumpList.length !== index + 1 }" />
            </template>
            <!-- assoc ticket automation -->
            <BaseCheckbox
               v-if="sellerHasFeatureTickets && product_list.length == 1 "
              :saveData="true"
              v-model:checked="assoc_ticket"
              :label="$t('checkout.checkbox.info')"
              :id="'assocTicketCheckbox'"
            />
            <!-- Payment button -->
            <section>
              <BaseButton @click="callPayment" v-if="method !== 'PAYPAL'" class="my-7" :loading="isPaymentLoading" :disabled="isPaymentLoading">
                <span class="text-[15px] font-semibold">
                  {{
                    customCheckoutStore.purchase_text ||
                    $t("checkout.footer.btn_compra")
                  }}
                </span>
              </BaseButton>
            </section>

            <!-- Pix purchase infos -->
            <template v-if="method === 'PIX'">
              <FormPurchasePix />
            </template>

            <span class="flex items-center gap-3">
              <Icon name="fa6-solid:lock" class="text-main-color" />
              <p class="text-[13px] font-normal text-txt-color">
                {{ $t("checkout.footer.info_seguranca") }}
              </p>
            </span>
          </template>
        </Steps>

        <!-- Next step buttom -->
        <BaseButton @click="stepsStore.setStep(currentStep + 1)" v-if="isMobile &&
          currentStep < (checkout.showAddressStep ? 3 : 2) &&
          !isOneStep &&
          method !== 'FREE'
          ">
          <span class="text-[15px] font-semibold">
            {{ $t("checkout.steps.next_step") }}
          </span>
        </BaseButton>
        <!-- Payment button -->
        <template v-if="isMobile &&
          currentStep < (checkout.showAddressStep ? 3 : 2) &&
          !isOneStep &&
          method === 'FREE'
          ">
          <BaseButton @click="callPayment" class="my-7" :loading="isPaymentLoading" :disabled="isPaymentLoading">
            <span class="text-[15px] font-semibold">
              {{
                customCheckoutStore.purchase_text ||
                $t("checkout.footer.btn_compra")
              }}
            </span>
          </BaseButton>
          <span class="flex items-center gap-3">
            <Icon name="fa6-solid:lock" class="text-main-color" />
            <p class="text-[13px] font-normal text-txt-color">
              {{ $t("checkout.footer.info_seguranca") }}
            </p>
          </span>
        </template>
      </BaseCard>
      <!-- End purchase card -->

      <!-- Bottom thumb (custom checkout) -->
      <img v-if="customCheckoutStore.bottomThumb" :src="customCheckoutStore.bottomThumb" alt="Thumb inferior" class="w-full max-w-[771.66px] rounded-lg object-contain" />
      <!-- End bottom thumb (custom checkout) -->
      <FooterSafe />
      <!-- Payment methods -->
      <FormFooter />
    </section>

    <!-- Product Card -->
    <section class="flex w-full flex-col gap-10 lg:max-w-[370px] xl:min-w-[370px]">
      <ProductCard :product="product" />
      <!-- Side Thumb -->
      <img v-if="customCheckoutStore.sideThumb" :src="customCheckoutStore.sideThumb" alt="Thumb lateral" class="hidden w-full rounded-lg lg:block" />
      <!-- End side Thumb -->
      <!-- Side Thumb Mobile -->
      <img v-if="customCheckoutStore.sideThumbMobile" :src="customCheckoutStore.sideThumbMobile" alt="Thumb lateral mobile" class="w-full rounded-lg lg:hidden" />
      <!-- End side Thumb Mobile-->
    </section>

    <!-- Alert modal -->
    <BaseModal :title="product.name" :is-open="alert_modal" @close="closeModal" :close-button="false">
      <section class="flex w-full max-w-[400px] flex-col gap-5">
        <h6 class="text-[15px] font-semibold text-txt-color text-center">
          {{ $t("checkout.dados_pessoais.title_error") }}
        </h6>
        <p class="text-txt-color text-center">{{ $t(error_message) }}</p>
        <section class="mt-10 flex w-full ml-1">
          <BaseButton color="blue" class="w-[40%] bg-main-color text-txt-color " @click="closeModal">
            {{ $t("checkout.dados_pessoais.btn_error") }}
          </BaseButton>
        </section>
      </section>
    </BaseModal>

    <template v-if="product.product_type_id == 3 && sellerHasFeatureTickets">
      <EventExpiredSessionModal />
      <EventGoBackWarningModal />
    </template>

    <!-- Client Only section -->
    <ClientOnly class="hidden">
      <ModalCloseUp />
      <LeadsClient />
      
      <Captcha />

      <PixelClient 
        v-if="getEventsDefault"
        :key="pixelComponentKey"
        :event="'view'"
        :product_id="productStore.product_id"
        :affiliate_id="hasAffiliateId"
        :method="checkout.method"
        :amount="amountStore.getAmount"
        :original_amount="productStore.product.amount"
        :product_name="productStore.productName"
        :productCategory="productStore.productCategory"
        :uuid="storeLead.uuid"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getPageView"
        :key="pixelComponentKey" 
        :event="'PageView'" 
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method" 
        :amount="amountStore.getAmount" 
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :uuid="storeLead.uuid"
        :seller_id="productStore.product.seller_id"
        action="on_checkout_page"
      />

      <PixelClient 
        v-if="getViewContent"
        :key="pixelComponentKey" 
        :event="'ViewContent'" 
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method" 
        :amount="amountStore.getAmount" 
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :uuid="storeLead.uuid"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getInitiateCheckoutOnAccess"
        :key="pixelComponentKey" 
        :event="'InitiateCheckout'" 
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method" 
        :amount="amountStore.getAmount" 
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :uuid="storeLead.uuid"
        action="on_access"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getInitiateCheckoutOnFilledData && isFormValidWithoutDocument"
        :key="pixelComponentKey" 
        :event="'InitiateCheckout'"
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method" 
        :amount="amountStore.getAmount" 
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_filled_data"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getAddPaymentInfo && ((checkout.method === 'CREDIT_CARD' && isPurchaseFormValid) || checkout.method != 'CREDIT_CARD') && getMethodChange"
        :key="pixelComponentKey" 
        :event="'AddPaymentInfo'"
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method" 
        :amount="amountStore.getAmount" 
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getAddToCartOnMainProduct"
        :key="pixelComponentKey"
        :event="'AddToCart'"
        :product_id="productStore.product_id"
        :affiliate_id="hasAffiliateId"
        :method="checkout.method"
        :amount="amountStore.getAmount"
        :original_amount="productStore.product.amount"
        :product_name="productStore.productName"
        :productCategory="productStore.productCategory"
        :uuid="storeLead.uuid"
        action="on_main_product"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getAddToCartOnOrderBump && (getSwitchProductList && product_list.length > 1)"
        :key="pixelComponentKey"
        :event="'AddToCart'"
        :product_id="productStore.product_id"
        :affiliate_id="hasAffiliateId"
        :method="checkout.method"
        :products="pixelProductIds"
        :amount="amountStore.getAmount"
        :original_amount="productStore.product.amount"
        :product_name="productStore.productName"
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_orderbump"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getPurchaseTry && hasClickPayment"
        :key="pixelComponentKey" 
        :event="'Purchase'"
        :product_id="productStore.product_id"
        :affiliate_id="hasAffiliateId"
        :method="checkout.method"
        :amount="amountStore.getAmount"
        :original_amount="productStore.product.amount"
        :product_name="productStore.productName"
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_payment_try"
        :seller_id="productStore.product.seller_id"
      />

      <PixelClient 
        v-if="getOrderBumpPurchaseTry && hasClickPayment && product_list.length > 1"
        :key="pixelComponentKey" 
        :event="'OrderBumpPurchase'"
        :product_id="productStore.product_id" 
        :affiliate_id="hasAffiliateId" 
        :method="checkout.method"
        :products="pixelProductIds"
        :amount="amountStore.getAmount"
        :original_amount="productStore.product.amount" 
        :product_name="productStore.productName" 
        :productCategory="productStore.productCategory"
        :name="personalStore.name"
        :email="personalStore.email"
        :cellphone="personalStore.cellphone"
        :uuid="storeLead.uuid"
        :address="storeLead.address"
        action="on_payment_try"
        :seller_id="productStore.product.seller_id"
      />
    </ClientOnly>
    <!-- End Client Only section -->
    <LeadsServer />
    <!-- <NotificationsCustom title="oi" name="Gabriel Reis" /> -->
  </NuxtLayout>
</template>
<style lang="scss">
  .information-cards{
    width: 49%;
    text-align: justify;
  }
  .information-cards-span{
    color: var(--txt-color);
    font-size: 12px;
    font-weight: 400;
  }
  @media(max-width: 1024px) {
    .information-cards{
      width: 100%;
    }
  }
</style>