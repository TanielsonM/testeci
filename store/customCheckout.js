import { useCheckoutStore } from "~/store/checkout.js";

export const useCustomCheckoutStore = definePiniaStore("customCheckout", {
  state: () => ({
    custom_checkout: null,
  }),
  getters: {
    /* theme */
    theme: (state) => state.custom_checkout?.theme || "light",
    /* themeColor */
    themeColor(state) {
      return () => {
        const checkout = useCheckoutStore();
        return state.custom_checkout?.theme_color || checkout.isHeaven
          ? "heaven"
          : "#00E4A0";
      };
    },
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
    /* Jivochat ID */
    hasJivochatId: (state) => state.custom_checkout?.jivochat_id ?? null,
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
    /* Order bump */
    hasCustomBump: (state) => state.custom_checkout?.ob_custom ?? null,
    bump_options: (state) => ({
      background_color: JSON.parse(state.custom_checkout?.ob_background_color),
      border: state.custom_checkout?.ob_border,
      border_px: state.custom_checkout?.ob_border_px,
      description: state.custom_checkout?.ob_description,
      subtitle: state.custom_checkout?.ob_subtitle,
      title: state.custom_checkout?.ob_title,
    }),
    trial_info: (state) => state.custom_checkout.trial_info ?? null,
    purchase_text: (state) => state?.custom_checkout?.button_text,
  },
  actions: {
    setCustomCheckout(checkout) {
      this.custom_checkout = checkout;
      if (this.hasJivochatId) {
        const checkout = useCheckoutStore();
        checkout.setJivochat(this.hasJivochatId);
      }
    },
  },
});
