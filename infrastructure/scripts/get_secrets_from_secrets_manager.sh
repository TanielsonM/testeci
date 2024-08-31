secrets=(
  "API_GATEWAY_URL"
  "API_HOST"
  "API_HOST_PRODUCT"
  "BASE_URL"
  "CHECKOUT_GATEWAY_KEY"
  "CUSTOM_CHARGES_EXCEPTION"
  "FINGERPRINT_API_KEY"
  "FINGERPRINT_ENDPOINT"
  "FINGERPRINT_PATH"
  "I18N_FALLBACK_LOCALE"
  "I18N_LOCALE"
  "INTERNATIONAL_URL"
  "MERCADOPAGO_API_PUBLIC_KEY"
  "PAGARME_CRIPTO_KEY"
  "PAYPAL_CLIENT_ID_INTERNATIONAL"
  "PAYPAL_CLIENT_ID_NATIONAL"
  "PRODUCT_TO_API_FAST"
  "TITLE"
  "USER_INTER"
  "VUE_CHECKOUT_HEAVEN_PAGE"
  "VUE_CHECKOUT_PAGE"
  "VUE_KEY_CAPTCHA"
)

secret_arn="arn:aws:secretsmanager:us-east-1:730335633389:secret:greenn/staging/new-checkout-5SFdBF"

for secret in "${secrets[@]}"; do
  echo "Fetching secret for: ${secret}"
  value=$(aws secretsmanager get-secret-value --secret-id "${secret_arn}" --query SecretString --output text | jq -r ".${secret}")
  echo "${secret}=${value}" >> $GITHUB_ENV
done
