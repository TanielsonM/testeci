<script setup>
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePaymentStore } from "~~/store/modules/payment";
import { useStepStore } from "~~/store/modules/steps";
import { useAmountStore } from "~~/store/modules/amount";

// Stores
const customCheckoutStore = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const address = useAddressStore();
const payment = usePaymentStore();
const stepsStore = useStepStore();
const amountStore = useAmountStore();

// Variables
const { t, locale } = useI18n();
const { product, hasTicketInstallments } = storeToRefs(productStore);
const { sameAddress, charge, shipping } = storeToRefs(address);
const {
  method,
  allowed_methods,
  captchaEnabled,
  hasAffiliateId,
  product_id,
  selectedCountry,
} = storeToRefs(checkout);
const { currentStep, countSteps, isMobile } = storeToRefs(stepsStore);
const { error_message } = storeToRefs(payment);
const { isOneStep } = storeToRefs(customCheckoutStore);

// Refs
const alert_modal = ref(false);
const pixelComponentKey = 1;

// Computeds
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
          label: "Boleto",
          icon: "fa-solid:file-invoice-dollar",
        };
      case "PAYPAL":
        return {
          value: item,
          label: "Paypal",
          icon: "mdi:paypal",
        };
      /* case "SAFETYPAY-CASH":
        return {
          value: item,
          label: "SAFETYPAY-CASH",
          icon: "bi:credit-card-fill",
        };
      case "EFT":
        return {
          value: item,
          label: "EFT",
          icon: "bi:credit-card-fill",
        };
      case "BANKTRANSFER":
        return {
          value: item,
          label: "BANKTRANSFER",
          icon: "bi:credit-card-fill",
        };
      case "DEBITCARD":
        return {
          value: item,
          label: t("checkout.pagamento.metodos.cartao_debito"),
          icon: "bi:credit-card-fill",
        };
      case "EFECTY":
        return {
          value: item,
          label: "EFECTY",
          icon: "bi:credit-card-fill",
        };
      case "MULTICAJA":
        return {
          value: item,
          label: "MULTICAJA",
          icon: "bi:credit-card-fill",
        };
      case "SENCILLITO":
        return {
          value: item,
          label: "SENCILLITO",
          icon: "bi:credit-card-fill",
        };
      case "SERVIPAG":
        return {
          value: item,
          label: "SERVIPAG",
          icon: "bi:credit-card-fill",
        };
      case "PAGOSNET":
        return {
          value: item,
          label: "PAGOSNET",
          icon: "bi:credit-card-fill",
        };
      case "RAPIPAGO":
        return {
          value: item,
          label: "RAPIPAGO",
          icon: "bi:credit-card-fill",
        };
      case "PAGOFACIL":
        return {
          value: item,
          label: "PAGOFACIL",
          icon: "bi:credit-card-fill",
        };
      case "WEBPAY":
        return {
          value: item,
          label: "WEBPAY",
          icon: "bi:credit-card-fill",
        };
      case "OXXO":
        return {
          value: item,
          label: "OXXO",
          icon: "bi:credit-card-fill",
        };
      case "SPEI":
        return {
          value: item,
          label: "SPEI",
          icon: "bi:credit-card-fill",
        }; */
      case "PIX":
        return {
          value: item,
          label: "Pix",
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
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("myRecaptchaCallback", () => {
      payment.payment(locale.value);
    });
    setInternationalURL()
  }
});

onBeforeUnmount(() => {
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

watch(currentStep, (step) => {
  if (step === countSteps.value) {
    stepsStore.changePaypalStep(true);
    return;
  }
  stepsStore.changePaypalStep(false);
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
  alert_modal.value = false;
  error_message.value = "";
}

async function callPayment() {
  if (captchaEnabled.value) {
    //não colocar await pois nenhuma dessa funções retornam promises
    //https://developers.google.com/recaptcha/docs/display?hl=pt-br#js_api
    window.grecaptcha.reset();
    window.grecaptcha.execute();
  } else {
    payment.payment(locale.value);
  }
}

function incrementSteps() {
  if (countSteps.value != 3) {
    stepsStore.incrementCount();
  }
}

function decreaseCount() {
  console.log("decreaseCount");
  if (countSteps.value === 3) {
    stepsStore.decreaseCount();
  }
}

if (hasAffiliateId.value) {
  const affiliate_id = useCookie(`affiliate_${product_id.value}`);
  const affiliate = useCookie("affiliate");
  affiliate_id.value = hasAffiliateId.value;
  affiliate.value = hasAffiliateId.value;
}

await checkout.init();
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Checkout</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <NuxtLayout>
    <section
      class="flex w-full max-w-[520px] flex-col gap-10 lg:max-w-[780px] xl:min-w-[780px]"
    >
      <!-- Purchase card -->
      <BaseCard class="w-full p-5 md:px-[60px] md:py-[50px]">
        <BaseButton
          color="transparent"
          size="sm"
          class="mb-4"
          v-if="currentStep > 1 && currentStep <= 3 && isMobile && !isOneStep"
          @click="stepsStore.back()"
        >
          <div class="flex items-start justify-start text-left">
            <Icon name="mdi:arrow-left" class="mr-4" size="20" />
            <p class="text-left">{{ $t("checkout.steps.back") }}</p>
          </div>
        </BaseButton>
        <!-- Personal form -->
        <Steps
          :title="$t('components.steps.personal_data')"
          step="01"
          v-if="(isMobile && currentStep == 1) || !isMobile || isOneStep"
        >
          <template #end-line>
            <LocaleSelect />
          </template>
          <template #content>
            <FormPersonal :class="product?.method !== 'FREE' ? 'mb-8' : ''" />
          </template>
        </Steps>

        <!-- Address form -->
        <Steps
          :title="$t('components.steps.address')"
          step="02"
          v-if="
            (checkout.showAddressStep &&
              ((isMobile && currentStep == 2) || !isMobile)) ||
            (isOneStep && checkout.showAddressStep)
          "
          @vnode-mounted="incrementSteps"
          @vnode-before-unmount="decreaseCount"
        >
          <template #content>
            <FormAddress />
            <BaseToogle
              v-if="checkout.hasPhysicalProduct && product?.method !== 'FREE'"
              class="my-5"
              v-model:checked="sameAddress"
              id="address-form"
              :label="$t('general.address_toogle_label')"
            />
            <Steps
              :title="$t('general.delivery_address')"
              icon="📦"
              v-if="!sameAddress"
            >
              <template #content>
                <br />
                <FormAddress type="shipping" />
              </template>
            </Steps>
            <FormShippingOption
              v-if="
                product?.has_shipping_fee === 1 &&
                product?.type_shipping_fee == 'DYNAMIC'
              "
              :options="product.shipping_options ?? []"
            />
          </template>
        </Steps>
        <!-- Purchase Form -->
        <Steps
          :title="$t('checkout.pagamento.title')"
          :step="checkout.showAddressStep ? '03' : '02'"
          :free="product?.method !== 'FREE' ? false : true"
          v-if="
            (isMobile && currentStep == (checkout.showAddressStep ? 3 : 2)) ||
            !isMobile ||
            isOneStep
          "
        >
          <template #content>
            <section class="flex w-full flex-col gap-8">
              <template v-if="product?.method !== 'FREE'">
                <BaseTabs v-model="method" :tabs="tabs" :is-mobile="isMobile" />
                <template v-if="method !== 'PIX'">
                  <FormPurchase />
                </template>
              </template>
            </section>
            <!-- Bumps -->
            <template
              v-if="checkout.getBumpList.length && !hasTicketInstallments && product?.method !== 'FREE' && !checkout.hasFreeBump"
            >
              <p class="my-5 w-full text-txt-color">
                {{
                  customCheckoutStore.hasCustomBump
                    ? customCheckoutStore.bump_options.title
                    : `${$t("checkout.pagamento.bump.title")} 🔥`
                }}
              </p>
              <OrderBumps
                v-for="(bump, index) in checkout.getBumpList"
                :key="index"
                :bump="bump"
                :class="{ 'mb-5': checkout.getBumpList.length !== index + 1 }"
              />
            </template>

            <!-- Payment button -->
            <section>
              <BaseButton
                @click="callPayment"
                v-if="method !== 'PAYPAL'"
                class="my-7"
              >
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
        <BaseButton
          @click="stepsStore.setStep(currentStep + 1)"
          v-if="
            isMobile &&
            currentStep < (checkout.showAddressStep ? 3 : 2) &&
            !isOneStep &&
            method !== 'FREE'
          "
        >
          <span class="text-[15px] font-semibold">
            {{ $t("checkout.steps.next_step") }}
          </span>
        </BaseButton>
        <!-- Payment button -->
        <template
          v-if="
            isMobile &&
            currentStep < (checkout.showAddressStep ? 3 : 2) &&
            !isOneStep &&
            method === 'FREE'
          "
        >
          <BaseButton
            @click="callPayment"
            class="my-7"
          >
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
      <img
        v-if="customCheckoutStore.bottomThumb"
        :src="customCheckoutStore.bottomThumb"
        alt="Thumb inferior"
        class="w-full max-w-[771.66px] rounded-lg object-contain"
      />
      <!-- End bottom thumb (custom checkout) -->
      <FooterSafe />
      <!-- Payment methods -->
      <FormFooter />
    </section>

    <!-- Product Card -->
    <section
      class="flex w-full flex-col gap-10 lg:max-w-[370px] xl:min-w-[370px]"
    >
      <ProductCard :product="product" />
      <!-- Side Thumb -->
      <img
        v-if="customCheckoutStore.sideThumb"
        :src="customCheckoutStore.sideThumb"
        alt="Thumb lateral"
        class="hidden w-full rounded-lg lg:block"
      />
      <!-- End side Thumb -->
    </section>

    <!-- Alert modal -->
    <BaseModal :title="product.name" :is-open="alert_modal" @close="closeModal">
      <section class="flex w-full max-w-[400px] flex-col gap-5">
        <h6 class="text-[15px] font-semibold text-txt-color">
          {{ $t("checkout.dados_pessoais.title_error") }}
        </h6>
        <p class="text-txt-color">{{ $t(error_message) }}</p>
        <section class="mt-10 flex w-full justify-end">
          <BaseButton
            color="blue"
            class="w-[40%] text-txt-color"
            @click="closeModal"
          >
            {{ $t("checkout.dados_pessoais.btn_error") }}
          </BaseButton>
        </section>
      </section>
    </BaseModal>

    <!-- Client Only section -->
    <ClientOnly class="hidden">
      <LeadsClient />
      <PixelClient
        :key="pixelComponentKey"
        :event="'view'"
        :product_id="productStore.product_id"
        :affiliate_id="hasAffiliateId"
        :method="checkout.method"
        :amount="amountStore.getAmount"
        :original_amount="amountStore.getOriginalAmount"
        :product_name="productStore.productName"
      />
      <Captcha />
    </ClientOnly>
    <!-- End Client Only section -->
    <LeadsServer />
    <!-- <NotificationsCustom title="oi" name="Gabriel Reis" /> -->
  </NuxtLayout>
</template>
