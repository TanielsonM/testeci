import { test, expect } from '@playwright/test';
import { fillForm, fillAddress, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Valor Único Com Frete Fixo', async ({ page }) => {
  const paymentId = '37607';
  const expectedValue = 'R$ 20,00';
  // const expectedValuefreight = 'R$ 10,00';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Preenchendo endereço
  await fillAddress(page);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);

  // Verificando o valor na página de agradecimento
  // await verifyThankYouPageValueFreight(page, expectedValuefreight);
});