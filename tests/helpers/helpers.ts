import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { userData } from '../data/userData';
import { addressData } from '../data/andress';

// Acessa a url do checkout
export async function navigateToPaymentPage(page: Page, id: string) {
  let url = `https://payfast.greenn.com.br/${id}`;
  //let url = `https://payfast.stg.greenn.com.br/${id}`;
  await page.goto(url);
}

// Faz o preenchimento dos dados pessoais
export async function fillForm(page: Page) {
  await page.waitForTimeout(6000);
  await page.locator('#name-field').fill(userData.name);
  await page.locator('#email-field').fill(userData.email);
  await page.locator('.vti__input').fill(userData.phone);
  await page.locator('#document-field').fill(userData.document);
}

// Faz o preenchimento do endereço
export async function fillAddress(page: Page) {
  await page.getByPlaceholder('CEP').fill(addressData.cep);
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('Digite o logradouro').fill(addressData.street);
  await page.getByPlaceholder('Número', { exact: true }).fill(addressData.number);
  await page.getByPlaceholder('Bairro').fill(addressData.neighborhood);
  await page.getByPlaceholder('Complemento do endereço').fill(addressData.complement);
  await page.getByPlaceholder('Cidade').fill(addressData.city);
  await page.getByPlaceholder('Selecione um estado').fill(addressData.state);
}

// Seleciona a opção "PIX"
export async function selectPaymentMethodPix(page: Page) {
  await page.getByRole('button', { name: 'Pix' }).click();
}

// Seleciona a opção "Boleto"
export async function selectPaymentMethodBoleto(page: Page) {
  await page.getByRole('button', { name: 'Boleto' }).click();
}

// Seleciona a opção do "Bump"
export async function clickDivInHeaderWithText(page: Page, text: string) {
  await page.locator('header', { hasText: text }).locator('div').click();
}

// Seleciona o "Cupom"
export async function applyDiscountCoupon(page: Page, coupon: string) {
  await page.getByText('Adicione um cupom de desconto').click();
  await page.getByPlaceholder('Insira um cupom').fill(coupon);
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
}

// Seleciona a opção de "Comprar"
export async function clickBuyNowButton(page: Page) {
  await page.getByRole('button', { name: 'Comprar agora' }).click();
}

// Verifica o valor do modal de obrigado
export async function verifyThankYouPageValue(page: Page, expectedValue: string) {
  const valueElement = await page.waitForSelector('p:has-text("R$")', { timeout: 30000 });
  const valueText = await valueElement.textContent();
  if (valueText === null) {
    throw new Error('O valor não foi encontrado no modal de agradecimento');
  }
  expect(valueText.trim()).toBe(expectedValue);
}

// Verifica o valor do frete no modal de obrigado
export async function verifyThankYouPageValueFreight(page: Page, expectedValueFreight: string) {
  const valueElement = await page.waitForSelector('p:has-text("Frete") + p:has-text("R$")', { timeout: 30000 });
  const valueText = await valueElement.textContent();
  if (valueText === null) {
    throw new Error('O valor do frete não foi encontrado no modal de agradecimento');
  }
  expect(valueText.trim()).toBe(expectedValueFreight);
}

// Verifica a frase "Bump - Valor Unico" no modal de obrigado
export async function verifyThankYouPageBumpText(page: Page, expectedText: string) {
  const bumpElement = await page.waitForSelector('p:has-text("Bump - Valor Unico")', { timeout: 30000 });
  const bumpText = await bumpElement.textContent();
  if (bumpText === null) {
    throw new Error('A frase "Bump - Valor Unico" não foi encontrada no modal de agradecimento');
  }
  expect(bumpText.trim()).toBe(expectedText);
}

// Verifica a frase "Bump - Assinatura - Mensal" no modal de obrigado
export async function verifyThankYouPageBumpTextSub(page: Page, expectedText: string) {
  const bumpElement = await page.waitForSelector('p:has-text("Bump - Assinatura - Mensal")', { timeout: 30000 });
  const bumpText = await bumpElement.textContent();
  if (bumpText === null) {
    throw new Error('A frase "Bump - Assinatura - Mensal" não foi encontrada no modal de agradecimento');
  }
  expect(bumpText.trim()).toBe(expectedText);
}