import { test, expect } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, applyDiscountCoupon, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Valor Único Com Cupom', async ({ page }) => {
  const paymentId = '35008';
  const expectedValue = 'R$ 19,00';
  
  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);
  
  // Aplicando cupom de desconto
  await applyDiscountCoupon(page, 'CUPOM1REAL');
  
  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);
});
