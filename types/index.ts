export type GlobalSettings = {
  id?: number;
  key?: string;
  value?: string | number;
  country?: string;
};

export type Installment = {
  value: number;
  index: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  checked?: boolean;
};

export type Coupon = {
  amount: number;
  applied: boolean;
  available: number;
  discount: number;
  due_date: string | Date;
  error: boolean;
  is_valid: boolean;
  loading: boolean;
  name: string;
};

export type URL = {
  params: any;
  query: any;
  fullPath: string;
};

/* Store states */
export type InstallmentsState = {
  installments: Installment[];
  maxInstallments: number;
  minValue: number;
};

export type BumpsState = {
  bumps: Product[];
};

export type StepState = {
  step: number;
  format: "one_step" | "default";
};

export type CouponState = {
  coupon: Coupon;
};

export type CheckoutState = {
  global_loading: boolean;
  global_settings: GlobalSettings;
  url: URL;
  allowed_methods: string[];
  method: string;
  installments: number;
  ticket_installments: number;
  max_installments: number;
  fixed_installments: number;
  amount: number;
  original_amount: number;
  hasError: boolean;
  coupon: Coupon;
  is_heaven: boolean;
  product_list: any[];
  products_client_statistics: any[];
  order_bumps: any[];
  bump_list: any[];
  checkoutPayment: any;

  hasBusiness: boolean | string;
  hasBump: boolean;
  hasNewBump: boolean;
  hasCoupon: boolean | string;
  hasCustomCheckout: boolean | string;
  hasDocument: boolean | string;
  hasDebugPixel: boolean;
  hasEmail: boolean | string;
  hasForce: boolean;
  hasPhone: boolean | string;
  hasUpsell: boolean | string;
  hasSelectedBump: boolean;
  product_id: string;
  product_offer: string;
  hasFees: boolean | number;
  hasPhysicalProduct: () => boolean;

  getInstallments: () => number;
  getBumpList: Product[];

  isLoading: boolean;
  isHeaven: boolean;
  isValid: () => boolean;

  selectedCountry: string;
  showAddressStep: () => boolean;
  totalAmount: () => number;
  shippingProducts: () => Product[] | never[];
};
