import VueToast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    timeout: 5000,
  };
  nuxtApp.vueApp.use(VueToast, options);
});
