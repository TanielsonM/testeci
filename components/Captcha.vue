<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";

const checkStore = useCheckoutStore();
const { captcha_code, captchaEnabled } = storeToRefs(checkStore);
const recaptcha = ref(null);

onMounted(() => {
  if (process.client) {
    const config = useRuntimeConfig();
    window.recaptchaIsLoading = false;
    const loadRecaptcha = () => {
      if (!window.recaptchaIsLoading) {
        window.recaptchaIsLoading = true;
        useHead({
          script: [
            {
              id: "recaptcha",
              src: `https://www.google.com/recaptcha/api.js`,
              async: true,
              defer: true,
              onload: () => {
                window.grecaptcha.ready(function () {
                  window.grecaptcha.render(recaptcha.value, {
                    sitekey: config.public.RECAPTCHA_KEY,
                    callback: recaptchaCallback,
                    size: "invisible",
                  });
                });
              },
            },
          ],
        });
      }
    };

    if (captchaEnabled.value) {
      loadRecaptcha();
    }
  }
});

function recaptchaCallback(response) {
  captcha_code.value = response;
  window.dispatchEvent(new CustomEvent("myRecaptchaCallback"));
}

</script>

<template>
  <div class="hidden" id="recaptcha" ref="recaptcha"></div>
</template>
