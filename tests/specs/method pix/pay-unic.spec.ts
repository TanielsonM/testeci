import { test, expect } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Processo completo de pagamento via PIX', async ({ page }) => {
  const paymentId = '35008';
  const expectedValue = 'R$ 20,00';

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


