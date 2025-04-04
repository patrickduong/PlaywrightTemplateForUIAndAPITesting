import { defineConfig } from '@playwright/test';
import path from 'path';
import { loadEnv } from './UTILS/loadenv';

require('dotenv').config();

export const STORAGE_STATE = path.join(__dirname, 'E2E/configs/.auth/user.json');

// Detect the environment (default to 'staging' if not provided)
export const environment = process.env.ENV || 'local';

// Load the correct environment variables
loadEnv(environment);

//Global config using for all tests
export default defineConfig({
    // handle clean up data of allure report
    globalSetup: require.resolve('./global-setup'),
    globalTeardown: require.resolve('./global-teardown'),

    //adding allure test report 
    reporter: [
        ["line"],
        [
            "allure-playwright",
            {
                resultsDir: "allure-results",
                detail: true,
                suiteTitle: true,
                environmentInfo: {
                    ProjectName: 'Hero-ku-demo',
                    TenantURL: process.env.BASE_URL,
                    Account: process.env.USER_NAME
                },
            },
        ],
    ],

    // reporter: 'html',  // Generate an HTML report
    timeout: 120000, //set 2 minutes timeout for each test 

    projects: [
       
        {
            name: 'setup_e2e',
            testDir: 'TEST_PROJECT/E2E/tests',
            testMatch: '/setups/**/*.setup.ts'
        },

        {
            name: 'e2e_testing',
            use: {
                browserName: 'chromium',
                baseURL: process.env.BASE_URL,
                headless: false,  //set to true for run tests in headless mode 
                screenshot: 'only-on-failure',  // Take screenshot on failure
                video: 'retain-on-failure',  // Capture video on failure
                launchOptions: { args: ["--start-maximized"] }, // start browser with maximize size
                viewport: null, // start browser with maximize size
                storageState: STORAGE_STATE
        
            },
            retries: 1,  // Retry failed tests
            testDir: 'TEST_PROJECT/E2E/tests',
            testMatch: '/features/**/*.spec.ts',
            dependencies: ['setup_e2e'],
        },

    ],
});
