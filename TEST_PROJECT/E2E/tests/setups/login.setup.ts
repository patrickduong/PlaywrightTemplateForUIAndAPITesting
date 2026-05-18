import { test as setup } from '@playwright/test';
import { STORAGE_STATE } from '../../../../playwright.config';

setup('login and get session', async ({ page }) => {
  const baseUrl = process.env.BASE_URL;
  const username = process.env.USER_NAME;
  const password = process.env.PASS_WORD;

  if (!baseUrl || !username || !password) {
    throw new Error('BASE_URL, USER_NAME, and PASS_WORD environment variables are required');
  }

  console.log('🔐 Starting E2E login setup...');
  
  await page.goto(baseUrl);
  console.log('✓ Navigated to login page');

  await page.locator('#email').fill(username);
  await page.locator('#password').fill(password);
  console.log('✓ Filled login credentials');

  await page.getByRole('button', { name: 'Submit' }).click();
  console.log('✓ Submitted login form');

  // Wait for navigation and page to be ready
  await page.waitForLoadState('networkidle');
  
  await page.context().storageState({ path: STORAGE_STATE });
  console.log(`✓ E2E authentication setup completed and saved to ${STORAGE_STATE}`);
});
