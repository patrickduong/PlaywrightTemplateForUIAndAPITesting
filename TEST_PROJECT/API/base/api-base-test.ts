import { test as baseTest, APIRequestContext, APIResponse, expect } from '@playwright/test';

interface CustomFixtures {
  apiContext: APIRequestContext;
  assertResponseCode: (
    response: APIResponse,
    expectedCode: number
  ) => Promise<void>;
  assertResponseSuccess: (response: APIResponse) => Promise<void>;
}

const test = baseTest.extend<CustomFixtures>({
  apiContext: async ({ playwright }, use) => {
    // Build headers - only add Authorization if token exists
    const extraHTTPHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Only add Authorization header if ACCESS_TOKEN is not empty
    if (process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN.trim()) {
      extraHTTPHeaders['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`;
    }

    const apiContext = await playwright.request.newContext({
      baseURL: `${process.env.API_URL}`,
      extraHTTPHeaders,
      timeout: 30000,
      ignoreHTTPSErrors: false,
    });

    await use(apiContext);

    // Proper cleanup
    await apiContext.dispose();
  },

  assertResponseCode: async ({}, use) => {
    const assertResponseCode = async (
      response: APIResponse,
      expectedCode: number
    ): Promise<void> => {
      const actualCode = response.status();
      const responseBody = await response.text().catch(() => '');

      expect.soft(
        actualCode,
        `Expected response code [${expectedCode}], but got [${actualCode}]. Response: ${responseBody.substring(0, 200)}`
      ).toBe(expectedCode);
    };

    await use(assertResponseCode);
  },

  assertResponseSuccess: async ({}, use) => {
    const assertResponseSuccess = async (
      response: APIResponse
    ): Promise<void> => {
      const actualCode = response.status();
      const isSuccess = actualCode >= 200 && actualCode < 300;

      expect(isSuccess, `Expected successful response (2xx), but got [${actualCode}]`).toBe(
        true
      );
    };

    await use(assertResponseSuccess);
  },
});

export { test, expect };
export type { CustomFixtures };