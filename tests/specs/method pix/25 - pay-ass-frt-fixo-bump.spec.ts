import { test, expect } from '@playwright/test';
import { fillForm, fillAddress, navigateToPaymentPage, clickDivInHeaderWithText, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageValueFreight, verifyThankYouPageBumpTextSub } from '../../helpers/helpers';

test('Pagamento Assinatura Com Frete Fixo + Bump Assinatura', async ({ page }) => {
  const paymentId = '69438?b_id_1=46730';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const expectedValueFreight = 'R$ 10,00';
  const bumpText = 'Bump - Assinatura - Mensal';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Selecionando o bump
  await clickDivInHeaderWithText(page, headerText);

  // Preenchendo endereço
  await fillAddress(page);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);

  // Verificando o valor do frete na página de agradecimento
  await verifyThankYouPageValueFreight(page, expectedValueFreight);

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpTextSub(page, bumpText);
});