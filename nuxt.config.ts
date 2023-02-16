import { resolve } from 'path'
// Locales
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@nuxtjs/i18n",
    "@nuxt/image-edge",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  imports: {
    dirs: ["stores"],
  },
  plugins: ["~/plugins/vue-the-mask.js"],
  css: ["~/assets/scss/_global.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      title: "Loading... pay",
      meta: [
        {
          name: "description",
          content: "My amazing site.",
        },
      ],
      link: [],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: "https://greenn-back-2.innovaweb.com.br/api",
    },
  },
  i18n: {
    defaultLocale: "pt",
    vueI18n: {
      legacy: false,
      locale: "pt",
      messages: {
        pt,
        en,
        es,
      },
    },
  },
});
