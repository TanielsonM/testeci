import type { Page } from '@playwright/test';
import { userData } from '../data/userData';

export async function fillForm(page: Page) {
  await page.locator('#name-field').fill(userData.name);
  await page.locator('#email-field').fill(userData.email);
  await page.locator('.vti__input').fill(userData.phone);
  await page.locator('#document-field').fill(userData.document);
}

export async function goToThankYouPage(page: Page) {
  await page.getByText('#').click();
}