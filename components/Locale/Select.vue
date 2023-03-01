<script setup>
import { storeToRefs } from "pinia";
/* Import and instance checkout store */
import { useCheckoutStore } from "~~/store/checkout";
const checkout = useCheckoutStore();
const { global_settings } = storeToRefs(checkout);
/* import locale */
const { locale } = useI18n();
/* import country list */
const { alphabetical, searcher } = useCountrys();
/* Use locale cookie and set default value*/
const cookie = useCookie("locale", {
  default: () =>
    alphabetical
      .filter((item) => item.sigla === global_settings.value.country)
      .pop(),
  watch: true,
});
/* set default value in locale */
locale.value = cookie.value.language;
/* set default value in use state */
const currentCountryAcronym = useState(
  "currentCountry",
  () => cookie.value.sigla
);
/* Get current country */
const currentCountry = computed(() =>
  alphabetical.filter((item) => item.sigla === cookie.value.sigla).pop()
);
/* set current country in controller variable */
const selectedCountry = ref(currentCountry.value);
const opened = ref(false);
const search = ref("");
/* Function to set new country after selected */
const selectCountry = (country) => {
  opened.value = !opened.value;
  search.value = "";
  locale.value = country.language;
  cookie.value = JSON.stringify(country);
  selectedCountry.value = country;
  currentCountryAcronym.value = country.sigla;
  setTimeout(() => {
    checkout.init();
  }, 20);
};
</script>

<template>
  <section class="relative">
    <button
      class="text-txt-color locale-focused flex h-[40px] items-center justify-between gap-5 bg-transparent pl-8"
      @click="opened = !opened"
    >
      <span class="flex items-center gap-3 text-xs">
        <img
          loading="lazy"
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
      <Icon name="fluent:chevron-up-down-20-regular" />
    </button>
    <ul
      data-anima="top"
      v-if="opened"
      class="bg-checkout absolute -left-[150px] z-10 max-h-[400px] w-max max-w-[300px] overflow-y-auto rounded p-5 shadow md:-left-[70px]"
    >
      <section
        class="mb-3 box-border flex items-center gap-4 rounded border border-gray-400 p-2 transition-colors duration-300 hover:border-gray-100"
      >
        <Icon name="ic:sharp-search" class="text-txt-color h-[20px] w-[20px]" />
        <input
          type="text"
          :placeholder="$t('components.locales.search_country')"
          v-model="search"
          class="bg-checkout text-txt-color w-full outline-none"
        />
      </section>
      <li
        @click="selectCountry(country)"
        v-for="(country, index) in searcher(search)"
        :key="index"
        class="locale-focused text-txt-color flex flex-nowrap items-center gap-3 py-3 px-3 text-xs"
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
    @apply text-main-color;
    &::before {
      @apply bg-main-color rounded-full;
      content: "";
      position: absolute;
      left: 15px;
      width: 8px;
      height: 8px;
    }
  }
}
</style>
