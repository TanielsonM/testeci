export default defineNuxtRouteMiddleware((to, from) => {
  if (to.name === "product_id-lang" && to.params?.lang !== "obrigado") {
    return navigateTo(`/${to.params?.product_id}`);
  }
});
