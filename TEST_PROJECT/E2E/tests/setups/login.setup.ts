import { test as setup } from '@playwright/test'
import { STORAGE_STATE } from '../../../../playwright.config'

setup('login and get session', async ({ page }) => {
  await page.goto(process.env.BASE_URL!)
  await page.locator('#email').fill(process.env.USER_NAME!)
  await page.locator('#password').fill(process.env.PASS_WORD!)
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.context().storageState({ path: STORAGE_STATE })
})
