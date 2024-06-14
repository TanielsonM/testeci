// Types
import { CheckoutState, CouponState, Coupon } from "@/types";
// Stores
import { useCheckoutStore } from "@/store/checkout";
import { useAmountStore } from "./amount";

export const useCouponStore = defineStore("Coupon", {
  state: (): CouponState => ({
    coupon: {
      amount: 0,
      applied: false,
      available: 0,
      discount: 0,
      due_date: "",
      error: false,
      is_valid: false,
      loading: false,
      name: "",
    },
  }),
  getters: {},
  actions: {
    async getCoupon(): Promise<Coupon> {
      const store: CheckoutState = useCheckoutStore();
      
      const product_id = store.url.params.product_id;
      
      let url = `/coupon/check/${this.coupon.name}/${product_id}`;

      const useApiFast = useRuntimeConfig().public.PRODUCT_TO_API_FAST.includes(product_id);

      if (store.url.params.hash) {
        url = url + `/offer/${store.url.params.hash}`;
      }
      const query = {
        country: store.selectedCountry,
      };      

      try {
        const res = await useApi().read(url, { query }, false, useApiFast);
        return res;
      } catch (error) {
        throw error;
      } finally {
        this.coupon.loading = false;
      }
    },
    async setCoupon(coupon: string, initial = false): Promise<void> {
      if (initial && !!coupon) this.coupon.name = coupon;
      if (!!this.coupon.name) {
        const store = useAmountStore();
        await this.getCoupon()
          .then(({ amount, available, due_date }) => {
            this.coupon.amount = Math.abs(store.amount - amount);
            this.coupon.available = available;
            this.coupon.due_date = due_date;
            this.coupon.discount = amount;

            this.coupon.error = false;
            this.coupon.applied = true;
            this.coupon.is_valid = true;
          })
          .catch(() => this.removeCoupon(true));
      }
    },
    removeCoupon(hasError: boolean) {
      this.coupon = {
        amount: 0,
        applied: false,
        available: 0,
        discount: 0,
        due_date: "",
        error: false,
        is_valid: false,
        loading: false,
        name: "",
      };
      if (hasError) this.coupon.error = true;
    },
  },
});
