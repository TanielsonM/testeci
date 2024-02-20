import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
 
  nuxtApp.vueApp.use(fpjsPlugin, {
      loadOptions: {
        apiKey: useRuntimeConfig().public.FINGERPRINT_API_KEY2,
        endpoint: 'https://greenn.com.br/MpFh1my3UHgTqbwv/VhwMjtqarZYKuK11',
      scriptUrlPattern: 'https://greenn.com.br/MpFh1my3UHgTqbwv/Aq8T1FUNXnsDlYEq',
      },
    } as FpjsVueOptions);
    console.log(fpjsPlugin);
  });

