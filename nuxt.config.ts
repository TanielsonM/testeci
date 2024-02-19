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
    "@vue-macros/nuxt",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
  ],
  devtools: { componentInspector: false },
  imports: {
    dirs: ["store"],
  },
  plugins: [
    "~/plugins/maska.ts",
    "~/plugins/vue-toast.ts",
    "~/plugins/veevalidate-components.ts",
    "~/plugins/veevalidate-rules.ts",
    "~/plugins/fingerprint.ts",
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
        {
          "data-wd": "{{wd}}",
        },
      ],
      link: [
        {
          rel: "dns-prefetch",
          href: "fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "preload",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap",
          as: "style",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_HOST,
      API_BASE_URL: process.env.API_HOST,
      RECAPTCHA_KEY: process.env.VUE_KEY_CAPTCHA,
      CHECKOUT_PAGE: process.env.VUE_CHECKOUT_PAGE,
      HEAVEN_CHECKOUT_PAGE: process.env.VUE_CHECKOUT_HEAVEN_PAGE,
      PAYPAL_CLIENT_ID_NATIONAL: process.env.PAYPAL_CLIENT_ID_NATIONAL,
      PAYPAL_CLIENT_ID_INTERNATIONAL:
        process.env.PAYPAL_CLIENT_ID_INTERNATIONAL,
      CUSTOM_CHARGES_EXCEPTION: process.env.CUSTOM_CHARGES_EXCEPTION,
      PORT: process.env.PORT,
      INTERNATIONAL_URL: process.env.INTERNATIONAL_URL,
      MERCADOPAGO_API_PUBLIC_KEY: process.env.MERCADOPAGO_API_PUBLIC_KEY,
      VUE_APP_ENVIRONMENT: process.env.VUE_APP_ENVIRONMENT,
      VUE_APP_COMMIT_SHA: process.env.VUE_APP_COMMIT_SHA,
      FINGERPRINT_API_KEY: process.env.FINGERPRINT_API_KEY,
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
      pages.push(
        {
          name: "has-offer",
          path: "/:product_id/offer/:hash",
          file: resolve(__dirname, "/pages/[product_id]/index.vue"),
        },
        {
          name: "signature-has-offer",
          path: "/assinatura/:product_id/offer/:hash",
          file: resolve(__dirname, "/pages/assinatura/[product_id].vue"),
        }
      );
    },
  },
  typescript: {
    strict: true,
  },
  tailwindcss: {
    cssPath: "~/assets/tailwind.css",
    configPath: "tailwind.config",
  },
  nitro: {
    preset: "node-server",
    minify: true,
    sourceMap: false,
  },
  webpack: {
    aggressiveCodeRemoval: true,
    optimization: {
      innerGraph: true,
      providedExports: true,
    },
  },
});
