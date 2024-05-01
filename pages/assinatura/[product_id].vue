<script setup>
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePaymentStore } from "~~/store/modules/payment";
import { useStepStore } from "~~/store/modules/steps";
import { showUnloadAlertCheckout, showBeforeBackNavigation } from "@/utils/validateBatch";
import { storeToRefs } from "pinia";

// Stores
const customCheckoutStore = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const payment = usePaymentStore();
const stepsStore = useStepStore();
const route = useRoute();

// Variables
const { t, locale } = useI18n();
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
const { product } = storeToRefs(productStore);
const { product_list } = storeToRefs(checkout);

const {
  method,
  captchaEnabled,
  hasAffiliateId,
  product_id,
  selectedCountry,
  hasCustomCheckout
} = storeToRefs(checkout);

const { currentStep, isMobile } = storeToRefs(stepsStore);
const { error_message, isPaymentLoading, isPaymentFetching } = storeToRefs(payment);
const {
  isOneStep,
  custom_checkout,
  hasNotifications
} = storeToRefs(customCheckoutStore);

// Refs
const alert_modal = ref(false);

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
    if (product?.value?.product_type_id === 3 && sellerHasFeatureTickets?.value) {
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
  if (product?.value?.product_type_id === 3 && sellerHasFeatureTickets?.value) {
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

// Functions
function closeModal() {
  payment.setPaymentLoading(false);
  alert_modal.value = false;
  error_message.value = "";
}

const timeStemp = ref(null);

async function callPayment() {
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

await checkout.init().then(() => {

  let ogTitle = "Greenn";
  if (product?.value?.name) {
    ogTitle = `${product.value.name} | Greenn`;
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



  useSeoMeta({
    ogTitle: ogTitle,
    ogDescription: ogDescription,
    ogType: "website",
    ogUrl: urlForOG.href,
    ogImage: product?.value?.images[0]?.path || "https://paystatic.greenn.com.br/og-image_greenn.png",
    ogImageHeight: "500",
    ogImageWidth: "500",
    ogSiteName: "Greenn - A plataforma de pagamentos simples",
  });
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
            <FormPersonal  :urlSubscription="true" :class="product?.method !== 'FREE' ? 'mb-8' : ''" />
          </template>
        </Steps>
        <!-- Purchase Form -->
        <Steps :title="$t('checkout.pagamento.title')" :step="checkout.showAddressStep ? '03' : '02'" :free="product?.method !== 'FREE' ? false : true" v-if="(isMobile && currentStep == (checkout.showAddressStep ? 3 : 2)) ||
          !isMobile ||
          isOneStep
          ">
          <template #content>
            <section class="flex w-full flex-col gap-8">
              <template v-if="method !== 'PIX'">
                <FormPurchase :urlSubscription="true" />
              </template>
            </section>

            <!-- Payment button -->
            <section>
              <BaseButton @click="callPayment" v-if="method !== 'PAYPAL'" class="my-7" :loading="isPaymentLoading" :disabled="isPaymentLoading">
                <span class="text-[15px] font-semibold">
                  {{ $t("checkout.footer.btn_renovar_assinatura") }}
                </span>
              </BaseButton>
            </section>


            <span class="flex items-center gap-3">
              <Icon name="fa6-solid:lock" class="text-main-color" />
              <p class="text-[13px] font-normal text-txt-color">
                {{ $t("checkout.footer.info_seguranca") }}
              </p>
            </span>
          </template>
        </Steps>
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
      <ProductCard :urlSubscription="true" :product="product" />
    </section>

    <!-- Alert modal -->
    <BaseModal :title="product.name" :is-open="alert_modal" @close="closeModal" :close-button="false">
      <section class="flex w-full max-w-[400px] flex-col gap-5">
        <h6 class="text-[15px] font-semibold text-txt-color">
          {{ $t("checkout.dados_pessoais.title_error") }}
        </h6>
        <p class="text-txt-color">{{ $t(error_message) }}</p>
        <section class="mt-10 flex w-full justify-end">
          <BaseButton color="blue" class="w-[40%] bg-main-color text-txt-color" @click="closeModal">
            {{ $t("checkout.dados_pessoais.btn_error") }}
          </BaseButton>
        </section>
      </section>
    </BaseModal>
  </NuxtLayout>
</template>
