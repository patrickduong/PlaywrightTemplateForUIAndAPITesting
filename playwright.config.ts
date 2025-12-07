import { defineConfig } from '@playwright/test';
import path from 'path';
import { loadEnv, validateRequiredEnvVars } from './UTILS/loadenv';

require('dotenv').config();

export const STORAGE_STATE = path.join(__dirname, 'configs/.auth/user.json');

// Detect the environment (default to 'local' if not provided)
export const environment = process.env.ENV || 'local';

// Load the correct environment variables
loadEnv(environment);

// Validate required environment variables
const requiredVars = ['BASE_URL', 'API_URL', 'USER_NAME', 'PASS_WORD'];
validateRequiredEnvVars(requiredVars);

// Global config using for all tests
export default defineConfig({
    // Handle cleanup of allure report
    globalSetup: require.resolve('./global-setup'),
    globalTeardown: require.resolve('./global-teardown'),

    // Adding allure test report
    reporter: [
        ["line"],
        [
            "allure-playwright",
            {
                resultsDir: "allure-results",
                detail: true,
                suiteTitle: true,
                environmentInfo: {
                    ProjectName: process.env.PROJECT_NAME || 'Playwright-Testing',
                    TenantURL: process.env.BASE_URL,
                    Account: process.env.USER_NAME,
                    Environment: environment
                },
            },
        ],
    ],

    // Global timeout for tests (can be overridden per test)
    timeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : 120000, // 2 minutes default

    projects: [

        {
            name: 'setup_api',
            testDir: 'TEST_PROJECT/API/tests',
            testMatch: '/setups/auth.helper.ts',
        },
        {
            name: 'api_testing',
            testDir: 'TEST_PROJECT/API/tests',
            testMatch: '/features/**/*.spec.ts',
            dependencies: ['setup_api']
        },

        {
            name: 'setup_e2e',
            testDir: 'TEST_PROJECT/E2E/tests',
            testMatch: '/setups/login.setup.ts'
        },

        {
            name: 'e2e_testing',
            use: {
                browserName: 'chromium',
                baseURL: process.env.BASE_URL,
                headless: process.env.HEADLESS === 'false' ? false : true,
                screenshot: 'only-on-failure', // Take screenshot on failure
                video: 'retain-on-failure', // Capture video on failure
                launchOptions: { args: ["--start-maximized"] }, // start browser with maximize size
                viewport: null, // start browser with maximize size
                storageState: STORAGE_STATE
            },
            retries: process.env.E2E_RETRIES ? parseInt(process.env.E2E_RETRIES) : 1,
            testDir: 'TEST_PROJECT/E2E/tests',
            testMatch: '/features/**/*.spec.ts',
            dependencies: ['setup_e2e'],
        },

    ],
});
