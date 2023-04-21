/* Alphabetical order */
export type Address = {
  zipcode: string;
  number: number;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
};

export type Category = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type Company = {
  id: number;
  name: string;
  fantasy_name: string;
  telephone: string;
  email: string;
  support_telephone: string;
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

export type GlobalSettings = {
  captcha: boolean;
  antifraud: boolean;
  monthly_interest: number;
  country: string;
};

export type Image = {
  id: number;
  product_id: number;
  path: string;
  created_at: Date;
  updated_at: Date;
};

export type Installment = {
  value: number;
  index: number;
};

export type Payment = {
  amount: number;
  total: number;
  installments: number;

  method: string;
  language: string;
  products: {
    product_id: number;
    product_offer?: string;
    proposal_id?: number;
    coupon?: string;
  }[];
  cards?: any;

  name: string;
  email: string;
  document: string;
  cellphone: string;
  uuid: string;

  captcha: string;
  country_code: string;
  product_id: number;

  /* Optionals */
  client_statistic?: any[];
  // Address
  zipcode?: string | null;
  street?: string;
  number?: number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  // Shipping Address
  shipping_address_zip_code?: string;
  shipping_address_street?: string;
  shipping_address_number?: number;
  shipping_address_complement?: string;
  shipping_address_neighborhood?: string;
  shipping_address_city?: string;
  shipping_address_state?: string;
  // Shipping infos
  shipping_amount?: number;
  shipping_service_name?: string;
  shipping_service_id?: number;
  shipping_selected?: any;
  // Gift
  is_gift?: boolean;
  gift_message?: string;
  // Affiliate
  affiliate_id?: number;
};

export type Paypal = {
  amount: number;
  currency: string;
  symbol_currency: string;
};

export type Pixel = {
  id: number;
  pixel_id: string;
  type: string;
  product_id: number;
  created_at: Date;
  updated_at: Date;
  view: number;
  conversion: number;
  web: number;
  token: string;
  api: number;
  optimization: number;
  domain_id: number | null;
  confirmed_only: number;
  user_id: number;
  label: null;
  amount: number;
  host: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  stock: number;
  type: string;
  amount: number;
  period: null;
  thank_you_page: string;
  affiliation: number;
  comission: number;
  created_at: Date;
  updated_at: Date;
  seller_id: number;
  slug: string;
  method: string;
  warranty: number;
  url_callback: null;
  trial: null;
  is_checkout_address: number;
  bump_description: null;
  social_prove_id: null;
  proposal_minimum: number;
  banner_checkout: null;
  allow_proposal: number;
  affiliation_approbation: number;
  affiliation_public: number;
  pending_motive: null;
  is_active: number;
  deleted_at: null;
  affiliation_proposal: number;
  max_boleto_installments: number;
  status: string;
  max_subscription_installments: null;
  max_installments: number;
  max_comission: null;
  category_fiscal: string;
  fiscal_code: null;
  allowed_coupon: number;
  format: string;
  instructions: null;
  smart_sale: number;
  fixed_installments: null;
  smart_sale_installments: number;
  has_stock: number;
  can_be_gifted: number;
  has_shipping_fee: number;
  has_custom_shipping_address: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  address_product_id: null;
  co_seller_display_id: null;
  is_public_allowed: boolean;
  charges: null;
  no_interest_installments: number;
  seller_fee: number;
  affiliate_fee: null;
  warranty_checkout: number;
  smart_sale_dynamic_installments: number;
  pre_selected_installment: null;
  is_heaven: number;
  type_shipping_fee: string;
  amount_fixed_shipping_fee: number;
  shipping_fee_is_recurring: number;
  lead_affiliation: number;
  affiliation_lead: number;
  show_link_global_affiliate: number;
  high_ticket_fee: null;
  in_stock: boolean;
  status_product: string;
  images: Image[];
  seller: Seller;
  pixels: Pixel[];
  category: Category;
  product_id: number;
  hash: string;
  default: number;
  reason: null;
  analised: number;
  currency_id: number;
  allow_offer_link: number;
  amount_first_charges: null;
  different_amount_quantity_charges: null;
  has_different_amount_first_charges: number;
  status_offer: string;
  custom_charges: any[];
  paypal: Paypal;
  checked?: boolean;
  shipping?: Shipping;
};

export type Seller = {
  id: number;
  name: string;
  cellphone: string;
  is_heaven: number;
  is_greenn: number;
  company_id: number;
  internacional_company_id: number;
  company: Company;
};

export type Shipping = {
  amount?: number;
  service_name?: string;
  service_id?: number;
};

export type URL = {
  params: any;
  query: any;
  fullPath: string;
};

/* Store states (alphabetical) */
export type AddressState = {
  sameAddress: boolean;
  charge: Address;
  shipping: Address;
};

export type AmountState = {
  amount: number;
  originalAmount: number;
};

export type BumpsState = {
  bumps: Product[];
};

export type CheckoutState = {
  global_loading?: boolean;
  global_settings?: GlobalSettings;
  url?: URL;
  allowed_methods?: string[];
  method?: string;
  installments?: number;
  ticket_installments?: number;
  max_installments?: number;
  fixed_installments?: number;
  amount?: number;
  original_amount?: number;
  hasError?: boolean;
  coupon?: Coupon;
  is_heaven?: boolean;
  product_list?: any[];
  products_client_statistics?: any[];
  order_bumps?: any[];
  bump_list?: any[];
  checkoutPayment?: any;
  loading?: boolean;

  hasBusiness?: boolean | string;
  hasBump?: boolean;
  hasNewBump?: boolean;
  hasCoupon?: boolean | string;
  hasCustomCheckout?: boolean | string;
  hasDocument?: boolean | string;
  hasDebugPixel?: boolean;
  hasEmail?: boolean | string;
  hasForce?: boolean;
  hasPhone?: boolean | string;
  hasUpsell?: boolean | string;
  hasSelectedBump?: boolean;
  product_id?: string;
  product_offer?: string;
  hasFees?: boolean | number;
  hasPhysicalProduct?: () => boolean;
  getBumpList?: Product[];
  isLoading?: boolean;
  isHeaven?: boolean;
  isValid?: () => boolean;
  selectedCountry?: string;
  showAddressStep?: () => boolean;
  totalAmount?: () => number;
  shippingProducts?: () => Product[] | never[];
};

export type CouponState = {
  coupon: Coupon;
};

export type leadsState = {
  step: number;
  uuid: any;
  personal: {
    name: any;
    email: any;
    cellphone: any;
    document: any;
  };
  address: {
    zip_code: any;
    state: any;
    city: any;
    street: any;
    number: any;
    neighborhood: any;
    complement: any;
    country_code: any;
  };
  payment: {
    offer_id: number;
    proposal_id: number;
    product_id: number;
    seller_id: number;
    affiliate_id: number;
  };
  purchase: {
    status: string;
  };
};

export type InstallmentsState = {
  installments: Installment[];
  maxInstallments: number;
  minValue: number;
  getInstallments?: () => number;
};

export type MethodsState = {
  method: string;
  allowedMethods: string[];
};

export type StepState = {
  step: number;
  format: "one_step" | "default";
};
