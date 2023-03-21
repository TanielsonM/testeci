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
  <section class="w-full flex justify-start">
    <section
      class="card w-full h-1/2 rounded-lg border border-main-color bg-main-transparent p-5 flex flex-col justify-between"
    >
      <header class="w-full flex justify-end h-10">
        <Transition name="slide-fade-up" mode="out-in">
          <img
            v-bind:src="getImg(getCardType)"
            v-if="getCardType"
            v-bind:key="getCardType"
            alt="Bandeira do cartao"
            class="w-full h-full max-w-[50px] invert object-contain"
          />
        </Transition>
      </header>
      <section>
        <p class="text-txt-color text-[10px] opacity-70 mb-1">
          {{ $t("checkout.pagamento.metodos.um_cartao.card.numero") }}
        </p>
        <p class="w-full text-txt-color" v-if="getCardType === 'amex'"></p>
        <span v-else class="w-full text-txt-color flex">
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
                <span class="w-5 block" v-if="n % 4 === 0" />
              </span>
            </Transition>
          </p>
        </span>
      </section>
      <!-- Holder name and validate -->
      <section class="w-full flex justify-between items-center">
        <!-- Holder name -->
        <span>
          <p class="text-txt-color text-[10px] opacity-70 mb-1">
            {{ $t("checkout.pagamento.metodos.um_cartao.card.nome") }}
          </p>
          <Transition name="slide-fade-up" mode="out-in">
            <p class="text-txt-color text-[13px] leading-none whitespace-nowrap text-ellipsis uppercase font-semibold" v-if="card_holder_name">
              {{ card_holder_name }}
            </p>
            <p v-else class="text-txt-color text-[13px] leading-none whitespace-nowrap text-ellipsis uppercase font-semibold">
              {{ $t("checkout.pagamento.metodos.um_cartao.card.nome_holder") }}
            </p>
          </Transition>
        </span>
        <!-- Validate -->
        <span>
          <p>
            {{ $t("checkout.pagamento.metodos.um_cartao.card.validade") }}
          </p>
        </span>
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped>
</style>