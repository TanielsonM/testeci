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
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  imports: {
    dirs: ["store"],
  },
  plugins: ["~/plugins/vue-the-mask.js"],
  css: ["~/assets/scss/_global.scss", "~/assets/tailwind.css"],
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
    },
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: "https://greenn-back-2.innovaweb.com.br/api",
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
  hooks: {
    "pages:extend"(pages) {
      pages.push({
        name: "has-offer",
        path: "/:product_id/offer/:hash",
        file: resolve(__dirname, "/pages/[product_id]/index.vue"),
      });
    },
  },
});
