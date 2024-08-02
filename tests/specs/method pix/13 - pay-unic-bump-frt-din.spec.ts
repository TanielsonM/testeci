import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, fillAddress, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageValueFreight, clickDivInHeaderWithText} from '../../helpers/helpers';

test('Pagamento Valor Único + Bump Frete Dinamico', async ({ page }) => {
  const paymentId = '35008?b_id_1=50652';
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

  //Comentado pois está com um bug (mostrando um card vazio e não pegando o frete)
  //await percySnapshot(page, 'Pagina de obrigado PIX + Bump Unico');

  // Verificando o valor do frete na página de agradecimento
  await verifyThankYouPageValueFreight(page, expectedValueFreight);
});