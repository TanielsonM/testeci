<script setup>
const { locale } = useI18n();
const { alphabetical } = useCountrys();
const cookie = useCookie("locale", {
  default: () =>
    alphabetical.filter((item) => item.language === locale.value).pop(),
  watch: true,
});
locale.value = cookie.value.language;
const currentCountryAcronym = useState(
  "currentCountry",
  () => cookie.value.sigla
);
const currentCountry = computed(() =>
  alphabetical.filter((item) => item.sigla === cookie.value.sigla).pop()
);
const selectedCountry = ref(currentCountry.value);
const opened = ref(false);
const search = ref("");

const selectCountry = (country) => {
  opened.value = !opened.value;
  search.value = "";
  locale.value = country.language;
  cookie.value = JSON.stringify(country);
  selectedCountry.value = country;
  currentCountryAcronym.value = country.sigla;
};
</script>

<template>
  <section class="relative">
    <button
      class="
        bg-transparent
        h-[40px]
        flex
        justify-between
        items-center
        pl-8
        gap-5
        text-txt-color
        locale-focused
      "
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
        {{ !opened ? $t("locales.change_country") : $t("general.close") }}
      </span>
      <Icon name="fluent:chevron-up-down-20-regular" />
    </button>
    <ul
      data-anima="top"
      v-if="opened"
      class="
        absolute
        -left-[150px]
        md:-left-[70px]
        z-10
        rounded
        bg-checkout
        w-max
        max-w-[300px]
        shadow
        max-h-[400px]
        overflow-y-auto
        p-5
      "
    >
      <section
        class="
          box-border
          flex
          gap-4
          items-center
          border border-gray-400
          transition-colors
          duration-300
          hover:border-gray-100
          p-2
          rounded
          mb-3
        "
      >
        <Icon name="ic:sharp-search" class="w-[20px] h-[20px] text-txt-color"/>
        <input
          type="text"
          :placeholder="$t('locales.search_country')"
          v-model="search"
          class="w-full outline-none bg-checkout text-txt-color"
        />
      </section>
      <li
        @click="selectCountry(country)"
        v-for="(country, index) in alphabetical.filter((item) =>
          item.sub.toLowerCase().includes(search)
        )"
        :key="index"
        class="
          flex flex-nowrap
          items-center
          locale-focused
          py-3
          text-xs
          px-3
          text-txt-color
          gap-3
        "
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