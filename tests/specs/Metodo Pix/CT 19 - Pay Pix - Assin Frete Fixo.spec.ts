import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, fillAddress, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageValueFreight } from '../../helpers/helpers';

test('Pagamento Assinatura Com Frete Fixo', async ({ page }) => {
  const paymentId = '69438';
  const expectedValue = 'R$ 20,00';
  const expectedValueFreight = 'R$ 10,00';

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

  await percySnapshot(page, 'Pagina de obrigado PIX');

  // Verificando o valor do frete na página de agradecimento
  await verifyThankYouPageValueFreight(page, expectedValueFreight);
});