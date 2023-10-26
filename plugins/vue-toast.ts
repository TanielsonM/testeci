import VueToast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    maxToasts: 1,
    bodyClassName: ["custom_toast"],
    toastClassName: "custom_toast",
  };
  nuxtApp.vueApp.use(VueToast, options);
});
