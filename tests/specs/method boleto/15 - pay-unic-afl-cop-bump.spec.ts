import { test } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodBoleto, clickBuyNowButton, verifyThankYouPageValue, clickDivInHeaderWithText, verifyThankYouPageBumpText } from '../../helpers/helpers';

test('Pagamento Valor Único Com Afiliado e Co-Seller + Bump', async ({ page }) => {
  const paymentId = '47196?a_id=79167&b_id_1=35011';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const bumpText = 'Bump - Valor Unico';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Selecionando o bump
  await clickDivInHeaderWithText(page, headerText);

  // Realizando compra
  await selectPaymentMethodBoleto(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpText(page, bumpText);
});


