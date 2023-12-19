<script lang="ts" setup>

import { datadogRum } from '@datadog/browser-rum'

if(process.client && ['production', 'staging'].includes(useRuntimeConfig().public.VUE_APP_ENVIRONMENT)){
  datadogRum.init({
    applicationId: 'e1cc00a3-24a4-4b64-af20-d5653f203df7',
    clientToken: 'pub5e327407f462e8c7f771a2a6a4ed5b25',
    site: 'datadoghq.com',
    service: 'payfast',
    env: useRuntimeConfig().public.VUE_APP_ENVIRONMENT,
    version: useRuntimeConfig().public.VUE_APP_COMMIT_SHA, 
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
}

useSeoMeta({
  ogTitle: "Checkout",
  ogDescription: "Your payment platform!",
  ogType: "website",
  ogUrl: "https://paystatic.greenn.com.br/",
  ogImage: "https://paystatic.greenn.com.br/og-image_greenn.png",
  ogImageHeight: "500",
  ogImageWidth: "500",
  ogSiteName: "Checkout",
});
</script>

<template>
  <NuxtPage />
</template>
