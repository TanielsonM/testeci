import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, clickDivInHeaderWithText, verifyThankYouPageBumpText } from '../../helpers/helpers';

test('Pagamento Valor Único com Co-Seller + Bump', async ({ page }) => {
  const paymentId = '47196?b_id_1=35011';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const bumpText = 'Bump - Valor Unico';

  // Carregando o checkout com o parâmetro adicional
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Selecionando o bump
  await clickDivInHeaderWithText(page, headerText);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor no modal de obrigado
  await verifyThankYouPageValue(page, expectedValue);

  await percySnapshot(page, 'Pagina de obrigado PIX + Bump Unico');

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpText(page, bumpText);
});


