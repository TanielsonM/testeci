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
  flip_card: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  on_focus: {
    type: String,
    required: false,
    default: () => null,
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
  <section class="flip-card max-w-[400px]" :class="{ 'show-back': flip_card }">
    <section class="flip-card-inner">
      <section
        class="flip-card-front card flex h-[208px] w-full flex-col justify-between rounded-lg border border-main-color bg-main-transparent p-5"
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
          :class="{ 'on-focus': on_focus === 'number' }"
          :label="$t('checkout.pagamento.metodos.um_cartao.card.numero')"
        >
          <p class="w-full text-txt-color" v-if="getCardType === 'amex'"></p>
          <span v-else class="flex w-full font-semibold text-txt-color">
            <p
              v-for="(n, index) in defaultCardMask.replaceAll(' ', '').length"
              :key="index"
            >
              <Transition name="slide-fade-up" mode="out-in">
                <span class="min-w-2" :class="{ 'pr-3': n % 4 === 0 }">
                  {{
                    n < 5 || n > 12
                      ? card_number.replaceAll(" ", "")[index]
                        ? card_number.replaceAll(" ", "")[index]
                        : "*"
                      : "*"
                  }}
                </span>
              </Transition>
            </p>
          </span>
        </CreditCardLabel>
        <section class="flex w-full items-center justify-between">
          <CreditCardLabel
            :class="{ 'on-focus': on_focus === 'name' }"
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
                {{
                  $t("checkout.pagamento.metodos.um_cartao.card.nome_holder")
                }}
              </p>
            </Transition>
          </CreditCardLabel>
          <CreditCardLabel
            :label="$t('checkout.pagamento.metodos.um_cartao.card.validade')"
          >
            <Transition name="slide-fade-up" mode="out-in">
              <span
                class="font-semibold text-txt-color"
                v-if="card_month"
                v-bind:key="card_month"
                >{{ card_month }}</span
              >
              <span class="text-txt-color" v-else key="2">••</span>
            </Transition>
            <span class="font-semibold text-txt-color">/</span>
            <Transition name="slide-fade-up" mode="out-in">
              <span
                class="font-semibold text-txt-color"
                v-if="card_year"
                v-bind:key="card_year"
                >{{ String(card_year).slice(2, 4) }}</span
              >
              <span class="text-txt-color" v-else key="2">••</span>
            </Transition>
          </CreditCardLabel>
        </section>
      </section>
      <section
        class="flip-card-back card flex h-[208px] w-full flex-col justify-between rounded-lg border border-main-color bg-main-transparent p-5 pt-8"
      >
        <span class="card-target card-target-size"></span>

        <CreditCardLabel
          :class="{ 'on-focus': on_focus === 'cvv' }"
          class="cvv-position mt-6"
          :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
          :isBack="true"
        >
          <Transition name="slide-fade-up" mode="out-in">
            <span
              class="font-semibold text-txt-color"
              v-if="card_cvv"
              v-bind:key="card_cvv"
            >
              {{ String(card_cvv).slice(0, 3) }}
            </span>
            <span class="font-semibold text-txt-color" v-else key="3">•••</span>
          </Transition>
        </CreditCardLabel>

        <Transition name="slide-fade-up" mode="out-in">
          <img
            v-bind:src="getImg(getCardType)"
            v-if="getCardType"
            v-bind:key="getCardType"
            alt="Bandeira do cartao"
            class="float-left max-w-[50px] object-contain invert"
          />
        </Transition>
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.on-focus {
  border: 1px solid #49ebbb;
  border-radius: 6px;
  padding: 7px;
}
.flip-card {
  background-color: transparent;
  width: 600px;
  height: 200px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card.show-back .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}

.cvv-position {
  top: 2.3rem;
  position: relative;
}
.card-target {
  display: block;
  background: rgba(0, 0, 19, 0.8);
  height: 45px;
}

@media (min-width: 1280px) {
  .card-target-size {
    width: 114.9%;
    margin-left: -1.29rem;
  }
}
@media (max-width: 1279px) {
  .card-target-size {
    width: 110.7%;
    margin-left: -1.31rem;
  }
}
</style>
