<script setup>
const checkStore = useCheckoutStore();
const { captcha_code } = storeToRefs(checkStore);
const recaptcha = ref(null);

onMounted(() => {
  if (process.client) {
    const config = useRuntimeConfig();

    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.render(recaptcha.value, {
          sitekey: config.public.RECAPTCHA_KEY,
          callback: recaptchaCallback,
          size: "invisible",
        });
      } else {
        setTimeout(() => {
          loadRecaptcha();
        }, 100);
      }
    };

    loadRecaptcha();
  }
});

function recaptchaCallback(response) {
  captcha_code.value = response;
}
</script>

<template>
  <div class="hidden" id="recaptcha" ref="recaptcha"></div>
</template>


