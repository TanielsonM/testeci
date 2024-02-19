import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {

  const config = useRuntimeConfig();
  
  nuxtApp.vueApp.use(fpjsPlugin, {
      loadOptions: {
        apiKey: config.public.FINGERPRINT_API_KEY,
      },
    } as FpjsVueOptions);
  });

