<script setup>
// Imgs
import visa from "@/assets/card/visa.png";
import amex from "@/assets/card/amex.png";
import mastercard from "@/assets/card/mastercard.png";
import discover from "@/assets/card/discover.png";
import troy from "@/assets/card/troy.png";

const props = defineProps({
  card_number: {
    type: String,
    default: () => "",
  },
  card_holder_name: {
    type: String,
    default: () => "",
  },
  card_month: {
    type: String,
    default: () => "",
  },
  card_year: {
    type: String,
    default: () => "",
  },
  card_cvv: {
    type: String,
    default: () => "",
  },
});

// Variables
const amexCardMask = ref("•••• •••••• •••••");
const defaultCardMask = ref("**** **** **** ****");

// Computed functions
const getCardType = computed(() => {
  let number = props.card_number;
  let re = new RegExp("^4");
  if (number.match(re) != null) return "visa";

  re = new RegExp("^(34|37)");
  if (number.match(re) != null) return "amex";

  re = new RegExp("^5[1-5]");
  if (number.match(re) != null) return "mastercard";

  re = new RegExp("^6011");
  if (number.match(re) != null) return "discover";

  re = new RegExp("^9792");
  if (number.match(re) != null) return "troy";

  return "visa"; // default type
});

// Functions
function getImg(type) {
  switch (type) {
    case "amex":
      return amex;
    case "troy":
      return troy;
    case "discover":
      return discover;
    case "mastercard":
      return mastercard;
    default:
      return visa;
  }
}
</script>

<template>
  <section class="flex w-full max-w-[430px] justify-start">
    <section
      class="card flex h-[208px] w-full flex-col justify-between rounded-lg border border-main-color bg-greenn-transparent-color p-5"
    >
      <header class="flex h-10 w-full justify-end">
        <Transition name="slide-fade-up" mode="out-in">
          <img
            v-bind:src="getImg(getCardType)"
            v-if="getCardType"
            v-bind:key="getCardType"
            alt="Bandeira do cartao"
            class="h-full w-full max-w-[50px] object-contain invert"
          />
        </Transition>
      </header>
      <CreditCardLabel
        :label="$t('checkout.pagamento.metodos.um_cartao.card.numero')"
      >
        <p class="w-full text-txt-color" v-if="getCardType === 'amex'"></p>
        <span v-else class="flex w-full text-txt-color">
          <p
            v-for="(n, index) in defaultCardMask.replaceAll(' ', '').length"
            :key="index"
          >
            <Transition name="slide-fade-up" mode="out-in">
              <span class="min-w-2">
                {{
                  n < 5 || n > 12
                    ? card_number.replaceAll(" ", "")[index]
                      ? card_number.replaceAll(" ", "")[index]
                      : "*"
                    : "*"
                }}
                <span class="block w-5" v-if="n % 4 === 0" />
              </span>
            </Transition>
          </p>
        </span>
      </CreditCardLabel>
      <section class="flex w-full items-center justify-between">
        <CreditCardLabel
          :label="$t('checkout.pagamento.metodos.um_cartao.card.nome')"
        >
          <Transition name="slide-fade-up" mode="out-in">
            <p
              class="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold uppercase leading-none text-txt-color"
              v-if="card_holder_name"
            >
              {{ card_holder_name }}
            </p>
            <p
              v-else
              class="text-ellipsis whitespace-nowrap text-[13px] font-semibold uppercase leading-none text-txt-color"
            >
              {{ $t("checkout.pagamento.metodos.um_cartao.card.nome_holder") }}
            </p>
          </Transition>
        </CreditCardLabel>
        <CreditCardLabel
          :label="$t('checkout.pagamento.metodos.um_cartao.card.validade')"
        >
          <Transition name="slide-fade-up" mode="out-in">
            <span v-if="card_month" v-bind:key="card_month">{{
              card_month
            }}</span>
            <span v-else key="2">••</span>
          </Transition>
          /
          <Transition name="slide-fade-up" mode="out-in">
            <span v-if="card_year" v-bind:key="card_year">{{
              String(card_year).slice(2, 4)
            }}</span>
            <span v-else key="2">••</span>
          </Transition>
        </CreditCardLabel>
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped></style>
