import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Assinatura', async ({ page }) => {
  const paymentId = '35012';
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

  await percySnapshot(page, 'Pagina de obrigado PIX');
});