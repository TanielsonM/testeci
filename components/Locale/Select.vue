<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { useProductStore } from "~~/store/product";

// Store
const checkout = useCheckoutStore();
const productStore = useProductStore();
// Composables
const { locale } = useI18n();
const { global_settings } = storeToRefs(checkout);
const { product } = storeToRefs(productStore);
const { alphabetical, searcher } = useCountrys();
// Computeds
const defaultCountry = computed(
  () =>
    alphabetical
      .filter((item) => item.sigla === global_settings.value.country)
      .pop() || searcher("OTHERS").pop()
);

// Variables
const selectedCountry = ref(defaultCountry.value);
const opened = ref(false);
const search = ref("");

// State
const currentCountryAcronym = useState(
  "currentCountry",
  () => selectedCountry.value.sigla
);

// Code Here
locale.value = selectedCountry.value.language;

const selectCountry = (country) => {
  if(product?.offer_redirect_id) {
    const urlAtual = new URL(window.location.href);
    const parametros = `/${product.offer_redirect.product_id}/offer/${product.offer_redirect.hash}`;
    const queries = `${urlAtual.search}&country=${this.global_settings.country}`;
    const novaRota = useRuntimeConfig().public.HEAVEN_CHECKOUT_PAGE;
    const novaUrl = `${novaRota}${parametros}${queries}`;
    window.location.href = novaUrl;
  }

  search.value = "";
  opened.value = !opened.value;
  selectedCountry.value = country;
  locale.value = country.language;
  currentCountryAcronym.value = country.sigla;
  global_settings.value.country = country.sigla;

  setTimeout(() => {
    checkout.init(true);
  }, 20);
};
</script>

<template>
  <section class="relative">
    <button
      class="locale-focused flex h-[40px] items-center justify-between gap-5 bg-transparent pl-8 text-txt-color"
      @click="opened = !opened"
    >
      <span class="flex items-center gap-3 text-xs">
        <img
          :src="selectedCountry.img"
          width="20"
          height="20"
          alt="Selected country logo"
        />
        {{
          !opened
            ? $t("components.locales.change_country")
            : $t("general.close")
        }}
      </span>
      <Icon
        name="ic:round-arrow-drop-down"
        class="duration-500"
        :class="{ 'rotate-180': opened }"
      />
    </button>
    <ul
      data-anima="top"
      v-if="opened"
      class="absolute -left-[150px] z-50 max-h-[400px] w-max max-w-[300px] overflow-y-auto rounded bg-checkout p-5 shadow md:-left-[70px]"
    >
      <section
        class="mb-3 box-border flex items-center gap-4 rounded border border-gray-400 p-2 transition-colors duration-300 hover:border-gray-100"
      >
        <Icon name="ic:sharp-search" class="h-[20px] w-[20px] text-txt-color" />
        <input
          type="text"
          :placeholder="$t('components.locales.search_country')"
          v-model="search"
          class="w-full bg-checkout text-txt-color outline-none"
        />
      </section>
      <li
        @click="selectCountry(country)"
        v-for="(country, index) in searcher(search)"
        :key="index"
        class="locale-focused flex flex-nowrap items-center gap-3 px-3 py-3 text-xs text-txt-color"
      >
        <img
          :src="country.img"
          class="max-h-full"
          width="20"
          height="20"
          :alt="`logo from ${country.sub}`"
        />
        {{ country.sub }} | {{ country.pais }}
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.locale-focused {
  cursor: pointer;
  transition: 100ms ease-in;
  &:hover {
    color: var(--main-color);
    &::before {
      content: "";
      background: var(--main-color);
      border-radius: 50%;
      position: absolute;
      left: 15px;
      width: 8px;
      height: 8px;
    }
  }
}
</style>
