import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { fillForm, navigateToPaymentPage, selectPaymentMethodPix, clickBuyNowButton, verifyThankYouPageValue } from '../../helpers/helpers';

test('Pagamento Valor Único Com Co-Seller + Afiliado', async ({ page }) => {
  const paymentId = '47196?a_id=79167';
  const expectedValue = 'R$ 20,00';

  // Carregando o checkout com o parâmetro adicional
  await navigateToPaymentPage(page, paymentId);
  
  // Preenchendo dados
  await fillForm(page);

  // Realizando compra
  await selectPaymentMethodPix(page);
  await clickBuyNowButton(page);
  
  // Verificando o valor no modal de obrigado
  await verifyThankYouPageValue(page, expectedValue);

  await percySnapshot(page, 'Pagina de obrigado PIX');
});

