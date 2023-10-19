import { useCheckoutStore } from "~/store/checkout.js";
import Notifications from "~/components/Notifications";
import * as Toast from "vue-toastification";

export const useCustomCheckoutStore = defineStore("customCheckout", {
  state: () => ({
    greennWrapper: null,
    custom_checkout: null,
    notifications: null,
  }),
  getters: {
    /* get wrapper */
    getGreennWrapper: (state) => state.greennWrapper,

    /* Exit Modal */
    isPopUp: (state) => state.custom_checkout?.exit_pop_up,
    popUpImage: (state) => state.custom_checkout?.image_exit_pop_up,
    popUpTitle: (state) => state.custom_checkout?.title_exit_pop_up,
    popUpLink: (state) => state.custom_checkout?.link_exit_pop_up,
    popUpDescription: (state) => state.custom_checkout?.description_exit_pop_up,
    popUpButton: (state) => state.custom_checkout?.button_exit_pop_up,
    popUpButtonText: (state) =>
      state.custom_checkout?.text_button_exit_pop_up || "Comprar agora",

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
        number: state.custom_checkout?.whatsapp_number ?? null,
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
    trial_info: (state) => state.custom_checkout?.trial_info ?? null,
    trial_position: (state) => state?.custom_checkout?.trial_position ?? "top",
    purchase_text: (state) => state?.custom_checkout?.button_text,
    hasNotifications: (state) =>
      state?.custom_checkout?.purchase_notification === "on",
    isOneStep: (state) => state?.custom_checkout?.step_checkout === "one_step",
  },
  actions: {
    async getCustomCheckout() {
      const { query, params } = useRoute();
      if (!query.ch_id) return;

      let url = `/product/checkout/${params.product_id}/checkout/${query.ch_id}`;

      try {
        await useApi()
          .read(url)
          .then((response) => {
            if (response?.custom_checkout) {
              this.custom_checkout = response?.custom_checkout;
              if (this.hasJivochatId) {
                this.setJivochat(this.hasJivochatId);
              }

              if (this.hasNotifications) {
                this.notifications = response?.purchase_notification;
                this.setNotifications(
                  `${this.custom_checkout?.maximum_purchase_notification_interval}, ${this.custom_checkout?.minimum_purchase_notification_interval}`,
                  this.custom_checkout?.how_get_purchase_notification,
                  this.custom_checkout?.quantity_purchase_notification,
                  this.custom_checkout?.type_purchase_notification
                );
              }
            }
          });
      } catch (error) {}
    },
    setJivochat(id = "J0jlVX87X9") {
      const { query } = useRoute();
      if (!!query.b || this.hasJivochatId) {
        const jivoScript = document.createElement("script");
        jivoScript.src = `//code-eu1.jivosite.com/widget/${id}`;
        jivoScript.async = true;
        document.head.appendChild(jivoScript);
      }
    },
    setNotifications(interval, howGet, quantity, type) {
      const toast = Toast.useToast();
      if (!!this.notifications) {
        let time = 0;

        for (let i = 0; i < this.notifications.length; i++) {
          let notification = this.notifications[i];

          const content = {
            component: Notifications,
            props: {
              title: `Nova venda realizada!`,
              name: `${notification?.name}`,
            },
          };

          let position;
          switch (type) {
            case "b-toaster-top-right":
              position = "top-right";
              break;
            case "b-toaster-top-left":
              position = "top-left";
              break;
            case "b-toaster-top-center":
              position = "top-center";
              break;
            case "b-toaster-bottom-right":
              position = "bottom-right";
              break;
            case "b-toaster-bottom-left":
              position = "bottom-left";
              break;
            case "b-toaster-bottom-center":
              position = "bottom-center";
              break;
          }

          if (localStorage.getItem(`notification${notification.id}`) === null) {
            time =
              time +
              this.getRandomInt(interval.split(",")[0], interval.split(",")[1]);
            setTimeout(() => {
              localStorage.setItem(`notification${notification.id}`, "true");
              toast.success(content, {
                timeout: 5000,
                icon: false,
                appendChild: true,
                position: position,
                toastClassName: "custom",
                bodyClassName: ["custom"],
              });
            }, parseInt(time + "000"));
          }
          if (i == quantity) break;
        }
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
});
