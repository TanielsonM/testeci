import { test, expect } from '@playwright/test';
import { fillForm, fillAddress, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageBumpText, clickDivInHeaderWithText} from '../../helpers/helpers';

test('Pagamento Valor Único + Bump Frete Fixo', async ({ page }) => {
  const paymentId = '37607';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const bumpText = 'Produto Físico';
  // const expectedValuefreight = 'R$ 10,00';

  // Carregando o checkout
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Preenchendo endereço
  await fillAddress(page);

  // Selecionando o bump
  await clickDivInHeaderWithText(page, headerText);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor na página de agradecimento
  await verifyThankYouPageValue(page, expectedValue);

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpText(page, bumpText);

  // Verificando o valor na página de agradecimento
  // await verifyThankYouPageValueFreight(page, expectedValuefreight);
});