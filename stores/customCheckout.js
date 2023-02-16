export const useCustomCheckoutStore = definePiniaStore("customCheckout", {
  state: () => ({
    custom_checkout: null,
  }),
  getters: {
    /* theme */
    theme: (state) => state.custom_checkout?.theme || "light",
    /* themeColor */
    themeColor: (state) => state.custom_checkout?.theme_color || "#00E4A0",
    /* hasCustomLogo */
    hasCustomLogo: (state) => state.custom_checkout?.logotipo || null,
    /* topThumb */
    topThumb: (state) => state.custom_checkout?.top_thumb || null,
    /* bottomThumb */
    bottomThumb: (state) => state.custom_checkout?.bottom_thumb || null,
    /* sideThumb */
    sideThumb: (state) => state.custom_checkout?.side_thumb || null,
    /* hasScarcity */
    hasScarcity: (state) => state.custom_checkout?.scarcity === "on" ?? null,
    /* hasConfirmationEmail */
    hasConfirmationEmail: (state) =>
      state.custom_checkout?.confirmation_email === "on" || null,
    /* showWarranty */
    showWarranty: (state) =>
      state.custom_checkout?.warranty_checkout === "on" || null,
    /* showWhatsappButton */
    showWhatsappButton: (state) =>
      parseInt(state.custom_checkout?.whatsapp_button) ?? null,
    /* scarcity */
    scarcity: (state) =>
      ({
        title: state.custom_checkout?.scarcity_title,
        subtitle: state.custom_checkout?.scarcity_subtitle,
        time: state.custom_checkout?.scarcity_time,
        background: state.custom_checkout?.scarcity_background_color,
      } || null),
    /* whatsapp_options */
    whatsapp_options: (state) =>
      ({
        number:
          state.custom_checkout?.whatsapp_number
            .substring(3)
            .replace(".", "") ?? null,
        message: state.custom_checkout?.whatsapp_msg ?? null,
      } || null),
  },
  actions: {
    setCustomCheckout(checkout) {
      this.custom_checkout = checkout;
    },
  },
});
