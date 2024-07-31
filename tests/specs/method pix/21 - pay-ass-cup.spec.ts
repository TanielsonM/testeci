import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, applyDiscountCoupon, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Assinatura Com Cupom Personalizado', async ({ page }) => {
  const paymentId = '35008';
  const expectedValue = 'R$ 18,00';
  
  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);
  
  // Aplicando cupom de desconto
  await applyDiscountCoupon(page, 'CUPOMPERS');
  
  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);

  await percySnapshot(page, 'Pagina de obrigado PIX');
});