import { expect } from '@playwright/test';
import type { Page } from '@playwright/test'; // Importação apenas do tipo
import { userData } from '../data/userData';

// Acessa a url do checkout
export async function navigateToPaymentPage(page: Page, id: string) {
  await page.goto(`https://payfast.greenn.com.br/${id}`);
  // await page.goto(`http://localhost:3000/${id}`);
}

// Faz o preenchimento dos dados pessoais
export async function fillForm(page: Page) {
  await page.locator('#name-field').fill(userData.name);
  await page.locator('#email-field').fill(userData.email);
  await page.locator('.vti__input').fill(userData.phone);
  await page.locator('#document-field').fill(userData.document);
}

// Seleciona a opção "PIX"
export async function selectPaymentMethodPix(page: Page) {
  await page.getByRole('button', { name: 'Pix' }).click();
}

// Seleciona a opção de "Comprar"
export async function clickBuyNowButton(page: Page) {
  await page.getByRole('button', { name: 'Comprar agora' }).click();
}

// Aplica um cupom de desconto
export async function applyDiscountCoupon(page: Page, coupon: string) {
  await page.getByText('Adicione um cupom de desconto').click();
  await page.getByPlaceholder('Insira um cupom').click();
  await page.getByPlaceholder('Insira um cupom').fill(coupon);
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
}

export async function verifyThankYouPageValue(page: Page, expectedValue: string) {
  const valueElement = await page.waitForSelector('div.item p:has-text("R$")');
  const valueText = await valueElement.textContent();
  if (valueText === null) {
    throw new Error('O valor não foi encontrado na página de agradecimento');
  }
  expect(valueText.trim()).toBe(expectedValue);

}