/* Alphabetical order */
export type Address = {
  zipcode: string;
  number: number | string;
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

export type pixelState = {
  event: String;
  product_id: number;
  event_id: String;
  method: String;
  amount: Number;
  original_amount: Number;
  affiliate_id?: Number;
  sale_id?: Number;
  client_has_contract?: Number;
  email?: string;
  cellphone?: string;
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

export type PurcharseCard = {
  amount: string | number;
  card_cvv: string;
  card_expiration_date: string;
  card_holder_name: string;
  card_number: string;
};

export type GlobalSettings = {
  captcha: boolean;
  antifraud: boolean;
  monthly_interest: number;
  country: string;
};

export type Installment = {
  value: number;
  index: number;
};

export type Payment = {
  amount: number;
  total: number;

  method: string;
  language: string;

  products: {
    product_id: number;
    product_offer?: string;
    proposal_id?: number;
    coupon?: string;
    shipping_amount?: number;
    shipping_service_id?: number;
    shipping_service_name?: string;
  }[];

  metas: any;

  cards?: PurcharseCard[];

  name: string;
  email: string;
  document: string;
  cellphone: string;
  uuid: any;

  country_code: string;
  product_id: number;

  /* Optionals */
  captcha?: string;
  client_statistic?: any[];
  // Address
  zipcode?: string | any;
  street?: string;
  number?: number | string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  // Shipping Address
  shipping_address_zip_code?: string;
  shipping_address_street?: string;
  shipping_address_number?: number | string;
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
  affiliate_id?: number | string;
  // Paypal
  paypal?: any;
  // Upsell
  upsell_id?: number;
  // Installments
  installments?: number;
};

export type PaymentError = {
  status: string;
  code: string;
  sales: {
    success: boolean;
  };
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
  domain_id: number | any;
  confirmed_only: number;
  user_id: number;
  label: any;
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
  period: any;
  thank_you_page: string;
  affiliation: number;
  comission: number;
  created_at: Date;
  updated_at: Date;
  seller_id: number;
  slug: string;
  method: string;
  warranty: number;
  url_callback: any;
  trial: any;
  is_checkout_address: number;
  bump_description: any;
  social_prove_id: any;
  proposal_minimum: number;
  banner_checkout: any;
  allow_proposal: number;
  affiliation_approbation: number;
  affiliation_public: number;
  pending_motive: any;
  is_active: number;
  deleted_at: any;
  affiliation_proposal: number;
  max_boleto_installments: number;
  status: string;
  max_subscription_installments: any;
  max_installments: number;
  max_comission: any;
  category_fiscal: string;
  fiscal_code: any;
  allowed_coupon: number;
  format: string;
  instructions: any;
  smart_sale: number;
  fixed_installments: any;
  smart_sale_installments: number;
  has_stock: number;
  can_be_gifted: number;
  has_shipping_fee: number;
  has_custom_shipping_address: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  address_product_id: any;
  co_seller_display_id: any;
  is_public_allowed: boolean;
  charges: any;
  no_interest_installments: number;
  seller_fee: number;
  affiliate_fee: any;
  warranty_checkout: number;
  smart_sale_dynamic_installments: number;
  pre_selected_installment: any;
  is_heaven: number;
  type_shipping_fee: string;
  amount_fixed_shipping_fee: number;
  shipping_fee_is_recurring: number;
  lead_affiliation: number;
  affiliation_lead: number;
  show_link_global_affiliate: number;
  high_ticket_fee: any;
  in_stock: boolean;
  status_product: string;
  images: Image[];
  seller: Seller;
  pixels: Pixel[];
  category: Category;
  product_id: number;
  hash: string;
  default: number;
  reason: any;
  analised: number;
  currency_id: number;
  allow_offer_link: number;
  amount_first_charges: any;
  different_amount_quantity_charges: any;
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
  hasPhysicalProduct?: boolean;
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

export type HeadersState = {
  "controller-token-": string | null;
  "requestray-token-": string | null;
  "firewall-token-": string | null;
  "cache-token-": string | null;
  "trans-token-": string | null;
  "wd-token-": string;
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
    offer_hash: any;
    proposal_id: any;
    product_id: any;
    seller_id: any;
    affiliate_id: any;
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
  currentStep: number;
  format: "one_step" | "default";
  isMobile: boolean;
  countSteps: number;
};

export type Sale = {
  sales: SaleElement[];
  order: any;
};

export type SaleElement = {
  id: number;
  product_id: number;
  contract_id: any;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  installments: number;
  method: string;
  client_id: number;
  total: number;
  amount: number;
  proposal_id: any;
  subscription_id: any;
  boleto_url: any;
  boleto_barcode: any;
  boleto_expiration_date: any;
  qrcode: string;
  imgQrcode: string;
  paid_at: any;
  country_code: string;
  coupon_id: any;
  is_gift: number;
  gift_message: any;
  shipping_amount: any;
  shipping_selected: any;
  offer_id: number;
  base_currency_id: number;
  local_currency_id: number;
  original_amount: number;
  trial_with_shipping: number;
  offer: SaleOffer;
  product: SaleProduct;
  upsell: any;
  local_currency: SaleLocalCurrency;
  success: boolean;
  chc?: string;
  token?: string;
  sale_id?: string | number;
};

export type SaleLocalCurrency = {
  id: number;
  name: string;
  currency: string;
  currency_symbol: string;
};

export type SaleOffer = {
  id: number;
  product_id: number;
  hash: string;
  amount: number;
  method: string;
  name: string;
  allowed_coupon: number;
  fixed_installments: any;
  max_boleto_installments: number;
  no_interest_installments: number;
  max_installments: number;
  period: any;
  trial: any;
  charges: any;
  default: number;
  status: string;
  reason: any;
  analised: number;
  created_at: Date;
  updated_at: Date;
  max_subscription_installments: any;
  deleted_at: any;
  pre_selected_installment: number;
  currency_id: number;
  allow_offer_link: number;
  status_offer: string;
};

export type SaleProduct = {
  id: number;
  name: string;
  thank_you_page: string;
  trial: number;
  amount: number;
  in_stock: boolean;
  status_product: any;
  custom_thank_you_pages: any[];
};

export type ProductOffer = {
  data: ProductOfferData;
  type: string;
  custom_checkout: CustomCheckout;
  checkout_payment: CheckoutPayment;
};

export type CheckoutPayment = {
  price: Price;
  data: CheckoutPaymentData;
  token: string;
  conversion: boolean;
  base_currency: string;
  seller_id: number;
};

export type CheckoutPaymentData = {
  symbol_currency: string;
  rate: number;
  from: string;
  to: string;
  base_amount: number;
  amount: number;
};

export type Price = {
  payable_tax: number;
  tax: any[];
};

export type CustomCheckout = {
  theme: string;
  theme_color: string;
  top_thumb: any;
  bottom_thumb: any;
  side_thumb: any;
  logotipo: any;
  theme_color_bg: string;
  button_text: any;
  trial_position: any;
  trial_info: any;
  jivochat_id: any;
  step_checkout: string;
  purchase_notification: string;
  maximum_purchase_notification_interval: any;
  minimum_purchase_notification_interval: any;
  scarcity: string;
  scarcity_title: any;
  scarcity_subtitle: any;
  scarcity_time: any;
  scarcity_background_color: any;
  how_get_purchase_notification: any;
  quantity_purchase_notification: any;
  type_purchase_notification: any;
  ob_custom: any;
  ob_title: any;
  ob_subtitle: any;
  ob_description: any;
  ob_border: any;
  ob_border_px: any;
  ob_background_color: any;
  warranty_checkout: any;
  whatsapp_number: any;
  whatsapp_msg: any;
  zopim_id: any;
  whatsapp_button: any;
  confirmation_email: any;
};

export type ProductOfferData = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  stock: number;
  type: string;
  amount: number;
  period: number;
  total: number;
  thank_you_page: any;
  affiliation: number;
  comission: number;
  created_at: Date;
  updated_at: Date;
  seller_id: number;
  slug: string;
  method: string;
  warranty: number;
  url_callback: any;
  trial: number;
  is_checkout_address: number;
  bump_description: any;
  social_prove_id: any;
  proposal_minimum: number;
  banner_checkout: any;
  allow_proposal: number;
  affiliation_approbation: number;
  affiliation_public: number;
  pending_motive: any;
  is_active: number;
  deleted_at: any;
  affiliation_proposal: number;
  max_boleto_installments: number;
  status: string;
  max_subscription_installments: number;
  max_installments: any;
  max_comission: any;
  category_fiscal: string;
  fiscal_code: any;
  allowed_coupon: number;
  format: string;
  instructions: any;
  smart_sale: number;
  fixed_installments: any;
  smart_sale_installments: any;
  has_stock: number;
  can_be_gifted: number;
  has_shipping_fee: number;
  has_custom_shipping_address: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  address_product_id: any;
  co_seller_display_id: any;
  is_public_allowed: boolean;
  charges: any;
  no_interest_installments: number;
  seller_fee: any;
  affiliate_fee: any;
  warranty_checkout: number;
  smart_sale_dynamic_installments: number;
  pre_selected_installment: any;
  is_heaven: number;
  type_shipping_fee: string;
  amount_fixed_shipping_fee: any;
  shipping_fee_is_recurring: number;
  affiliation_lead: number;
  high_ticket_fee: any;
  rating_avg: any;
  rating_max: any;
  rating_low: any;
  rating_count: number;
  sales: number;
  affiliates: number;
  in_stock: boolean;
  status_product: string;
  fiscal_center_setting: FiscalCenterSetting[];
  images: Image[];
  seller: Seller;
  co_sellers: any[];
  co_seller_display: any;
  links: Link[];
  metas: Meta[];
  pixels: Pixel[];
  statistics: any;
  category: Category;
  attachments: any[];
  custom_thank_you_pages: any[];
  product_id: number;
  hash: string;
  default: number;
  reason: string;
  analised: number;
  currency_id: number;
  allow_offer_link: number;
  status_offer: string;
  custom_charges: any[];
};

export type FiscalCenterSetting = {
  id: number;
  key: string;
  value: number;
  user_id: number;
  product_id: number;
  created_at: Date;
  updated_at: Date;
};

export type Image = {
  id: number;
  product_id: number;
  path: string;
  created_at: Date;
  updated_at: Date;
};

export type Link = {
  id: number;
  product_id: number;
  url: string;
  name: string;
  source: any;
  medium: any;
  created_at: Date;
  updated_at: Date;
  is_bump: number;
};

export type Meta = {
  id: number;
  key: string;
  value: string;
  product_id: number;
  created_at: Date;
  updated_at: Date;
  proposal_id: any;
};

export type ShippingSelected = {
  address: Address;
  service_name: string;
  service_id: number;
  amount: number;
  old_amount: number;
  frete: Frete;
  frete_anterior: number;
};

export type Frete = {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: DeliveryRange;
  custom_delivery_time: number;
  custom_delivery_range: DeliveryRange;
  packages: Package[];
  additional_services: AdditionalServices;
  company: CompanyShipping;
};

export type AdditionalServices = {
  receipt: boolean;
  own_hand: boolean;
  collect: boolean;
};

export type CompanyShipping = {
  id: number;
  name: string;
  picture: string;
};

export type DeliveryRange = {
  min: number;
  max: number;
};

export type Dimensions = {
  height: number;
  width: number;
  length: number;
};

export type ShippingAddress = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export type Package = {
  price?: string;
  discount?: string;
  format: string;
  weight: string;
  insurance_value: string;
  dimensions: Dimensions;
};
