import { test, expect } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Assinatura Personalizada', async ({ page }) => {
  const paymentId = '35012/offer/B7EaaI';
  const expectedValue = 'R$ 10,00';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);
});