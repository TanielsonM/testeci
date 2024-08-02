import { test } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodBoleto, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Valor único', async ({ page }) => {
  const paymentId = '35008';
  const expectedValue = 'R$ 20,00';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Realizando compra
  await selectPaymentMethodBoleto(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);
});


