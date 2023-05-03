import { resolve } from "path";
import { createCommonJS } from "mlly";
const { __dirname } = createCommonJS(import.meta.url);
// Locales
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

export default defineNuxtConfig({
  ssr: true,
  image: {
    presets: {
      default: {
        quality: 75,
        width: 1200,
        height: 1200,
      },
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@nuxtjs/i18n",
    "@nuxt/image-edge",
    "@nuxtjs/robots",
    "@nuxt/devtools",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
  ],
  imports: {
    dirs: ["store"],
  },
  plugins: [
    "~/plugins/vue-toast.ts",
    "~/plugins/veevalidate-components.ts",
    "~/plugins/veevalidate-rules.ts",
  ],
  css: ["~/assets/scss/_global.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
      title: "Loading... pay",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content: "Your payment platform!",
        },
        {
          "http-equiv": "x-ua-compatible",
          content: "IE=edge",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_HOST,
      CHECKOUT_PAGE: process.env.VUE_CHECKOUT_PAGE,
      HEAVEN_CHECKOUT_PAGE: process.env.VUE_CHECKOUT_HEAVEN_PAGE,
      PAYPAL_CLIENT_ID_NATIONAL: process.env.PAYPAL_CLIENT_ID_NATIONAL,
      PAYPAL_CLIENT_ID_INTERNATIONAL:
        process.env.PAYPAL_CLIENT_ID_INTERNATIONAL,
    },
  },
  i18n: {
    defaultLocale: "pt",
    vueI18n: {
      locale: "pt",
      messages: {
        pt,
        en,
        es,
      },
    },
  },
  hooks: {
    "pages:extend"(pages) {
      pages.push({
        name: "has-offer",
        path: "/:product_id/offer/:hash",
        file: resolve(__dirname, "/pages/[product_id]/index.vue"),
      });
    },
  },
  typescript: {
    strict: true,
  },
  tailwindcss: {
    cssPath: "~/assets/tailwind.css",
    configPath: "tailwind.config",
  },
});
