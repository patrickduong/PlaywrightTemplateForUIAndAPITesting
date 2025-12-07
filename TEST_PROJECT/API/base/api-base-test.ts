import { test as baseTest, APIRequestContext, APIResponse, expect } from '@playwright/test';

type CustomFixtures = {
    apiContext: APIRequestContext;
    assertResponseCode: (response: APIResponse, expectedCode: number) => Promise<void>;
};

const test = baseTest.extend<CustomFixtures>({
    apiContext: async ({ playwright }, use) => {
        // Build headers - only add Authorization if token exists
        const extraHTTPHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Only add Authorization header if ACCESS_TOKEN is not empty
        if (process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN.trim()) {
            extraHTTPHeaders['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`;
        }

        const apiContext = await playwright.request.newContext({
            baseURL: `${process.env.API_URL}`,
            extraHTTPHeaders,
        });
        await use(apiContext);
        await apiContext.dispose();
    },

    assertResponseCode: async ({ }, use) => {
        const assertResponseCode = async (response: APIResponse, expectedCode: number) => {
            const actualCode = response.status();
            expect.soft(
                actualCode,
                `Expected response code [${expectedCode}], but got [${actualCode}]`
            ).toBe(expectedCode);
        };
        await use(assertResponseCode);
    },
});

export { test, expect };