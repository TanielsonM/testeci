<script setup>
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
            },
          ],
        });
      }
      if (window.grecaptcha) {
        try {
          window.grecaptcha.render(recaptcha.value, {
            sitekey: config.public.RECAPTCHA_KEY,
            callback: recaptchaCallback,
            size: "invisible",
          });
        } catch (err) {
          console.error(err);
          loadRecaptcha();
        }
      } else {
        setTimeout(() => {
          loadRecaptcha();
        }, 1000);
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
