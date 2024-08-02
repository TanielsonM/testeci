import { test } from '@playwright/test';
import { fillForm, navigateToPaymentPage, selectPaymentMethodBoleto, clickBuyNowButton, verifyThankYouPageValue, clickDivInHeaderWithText, verifyThankYouPageBumpTextSub } from '../../helpers/helpers';

test('Pagamento Assinatura + Bump Assinatura', async ({ page }) => {
  const paymentId = '35012?b_id_1=46730';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const bumpText = 'Bump - Assinatura - Mensal';

  // Carregando o checkout com o parâmetro adicional
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Selecionando o bump
  await clickDivInHeaderWithText(page, headerText);

  // Realizando compra
  await selectPaymentMethodBoleto(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor no modal de obrigado
  await verifyThankYouPageValue(page, expectedValue);

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpTextSub(page, bumpText);
});