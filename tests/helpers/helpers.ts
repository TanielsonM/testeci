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

// Função genérica para verificar texto no modal de obrigado
async function verifyThankYouPageText(page: Page, selector: string, expectedText: string) {
  const element = await page.waitForSelector(selector, { timeout: 30000 });
  const text = await element.textContent();
  if (text === null) {
    throw new Error(`O texto esperado não foi encontrado para o seletor: ${selector}`);
  }
  expect(text.trim()).toBe(expectedText);
}

// Verifica o "Valor" do produto no modal de obrigado
export async function verifyThankYouPageValue(page: Page, expectedValue: string) {
  await verifyThankYouPageText(page, 'p:has-text("R$")', expectedValue);
}

// Verifica o texto "Frete" no modal de obrigado
export async function verifyThankYouPageValueFreight(page: Page, expectedValueFreight: string) {
  await verifyThankYouPageText(page, 'p:has-text("Frete") + p:has-text("R$")', expectedValueFreight);
}

// Verifica o texto do "Bump - Valor Unico" no modal de obrigado
export async function verifyThankYouPageBumpText(page: Page, expectedText: string) {
  await verifyThankYouPageText(page, 'p:has-text("Bump - Valor Unico")', expectedText);
}

// Verifica o texto "Bump - Assinatura - Mensal" no modal de obrigado
export async function verifyThankYouPageBumpTextSub(page: Page, expectedText: string) {
  await verifyThankYouPageText(page, 'p:has-text("Bump - Assinatura - Mensal")', expectedText);
}