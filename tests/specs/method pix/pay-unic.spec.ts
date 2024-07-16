import { test, expect } from '@playwright/test';
import { fillForm, goToThankYouPage } from '../../helpers/helpers';

test('Testar pagamento via PIX', async ({ page }) => {
  await page.goto('https://payfast.greenn.com.br/35008');
  await fillForm(page);
  await page.getByRole('button', { name: 'Pix' }).click();
  await page.getByRole('button', { name: 'Comprar agora' }).click();
  await goToThankYouPage(page);
});
