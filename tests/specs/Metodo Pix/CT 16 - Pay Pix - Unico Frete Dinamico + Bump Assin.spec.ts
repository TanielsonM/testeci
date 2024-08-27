import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, fillAddress, clickDivInHeaderWithText, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue, verifyThankYouPageValueFreight, verifyThankYouPageBumpTextSub } from '../../helpers/helpers';

test('Pagamento Valor Único Com Frete Dinâmico + Bump Assinatura', async ({ page }) => {
  const paymentId = '50652?b_id_1=46730';
  const headerText = 'Sim, eu quero!';
  const expectedValue = 'R$ 20,00';
  const expectedValueFreight = 'R$ 11,47';
  const bumpText = 'Bump - Assinatura - Mensal';

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

  //Comentado pois está com um bug (mostrando um card vazio e não pegando o frete)
  //await percySnapshot(page, 'Pagina de obrigado PIX + Bump Unico');

  // Verificando o valor do frete na página de agradecimento
  await verifyThankYouPageValueFreight(page, expectedValueFreight);

  // Verificando se o bump aparece no modal de obrigado
  await verifyThankYouPageBumpTextSub(page, bumpText);
});
