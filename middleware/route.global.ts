export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    window._AutofillCallbackHandler = window._AutofillCallbackHandler || function(){}
    
    const nuxtApp = useNuxtApp();
    if (to.name === "product_id-lang" && to.params?.lang !== "obrigado") {
      return nuxtApp.runWithContext(() =>
        navigateTo(`/${to.params?.product_id}`)
      );
    }
  }
});
