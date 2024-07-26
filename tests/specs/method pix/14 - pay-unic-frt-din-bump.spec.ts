import { test, expect } from '@playwright/test';
import { fillForm, fillAddress, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageValueFreight, clickDivInHeaderWithText} from '../../helpers/helpers';

test('Pagamento Valor Único Frete Dinâmico + Bump ', async ({ page }) => {
  const paymentId = '50652?b_id_1=35008';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const expectedValueFreight = 'R$ 11,47';

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
});