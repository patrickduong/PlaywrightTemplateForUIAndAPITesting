import { test as baseTest, APIRequestContext, APIResponse, expect } from '@playwright/test';

type CustomFixtures = {
    apiContext: APIRequestContext;
    assertResponseCode: (response: APIResponse, expectedCode: number) => Promise<void>;
};

const test = baseTest.extend<CustomFixtures>({
    apiContext: async ({ playwright }, use) => {
        const apiContext = await playwright.request.newContext({
            baseURL: `${process.env.API_URL}`,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
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