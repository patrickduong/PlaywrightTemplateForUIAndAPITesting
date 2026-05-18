import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv, validateRequiredEnvVars } from './UTILS/loadenv';
import dotenv from 'dotenv';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const STORAGE_STATE = path.join(__dirname, 'configs/.auth/user.json');

// Detect the environment (default to 'local' if not provided)
export const environment = process.env.ENV || 'local';

// Load the correct environment variables
loadEnv(environment);

// Validate required environment variables
const requiredVars = ['BASE_URL', 'API_URL', 'USER_NAME', 'PASS_WORD'];
validateRequiredEnvVars(requiredVars);

// Check if running in CI
const isCI = process.env.CI === 'true';

// Get test timeout from env or use default
const testTimeout = process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT, 10) : 120000;
const expectTimeout = 10000;
const navigationTimeout = 30000;

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './TEST_PROJECT',
  
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: isCI,

  /* Retry on CI only */
  retries: isCI ? 2 : 0,

  /* Workers on CI */
  workers: isCI ? 4 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: isCI ? 'never' : 'on-failure',
      },
    ],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          ProjectName: process.env.PROJECT_NAME || 'Playwright-Testing',
          TenantURL: process.env.BASE_URL,
          Account: process.env.USER_NAME,
          Environment: environment,
          NodeVersion: process.version,
          PlaywrightVersion: '1.50.1',
        },
      },
    ],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Service workers handling */
    serviceWorkers: 'block',

    /* Timeout for each action */
    actionTimeout: navigationTimeout,

    /* Navigation timeout */
    navigationTimeout: navigationTimeout,
  },

  /* Configure projects for major browsers */
  projects: [
    /* API Tests Setup */
    {
      name: 'setup_api',
      testMatch: '**/API/tests/setups/auth.helper.ts',
    },

    /* API Tests */
    {
      name: 'api_testing',
      testMatch: '**/API/tests/features/**/*.spec.ts',
      use: {
        baseURL: process.env.API_URL,
      },
      dependencies: ['setup_api'],
    },

    /* E2E Tests Setup */
    {
      name: 'setup_e2e',
      testMatch: '**/E2E/tests/setups/login.setup.ts',
      use: {
        ...devices['chromium'],
        baseURL: process.env.BASE_URL,
        headless: isCI ? true : process.env.HEADLESS !== 'false',
        launchOptions: {
          args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
        },
        viewport: null,
      },
    },

    /* E2E Tests */
    {
      name: 'e2e_testing',
      testMatch: '**/E2E/tests/features/**/*.spec.ts',
      use: {
        ...devices['chromium'],
        baseURL: process.env.BASE_URL,
        headless: isCI ? true : process.env.HEADLESS !== 'false',
        launchOptions: {
          args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
        },
        viewport: null,
        storageState: STORAGE_STATE,
      },
      retries: isCI ? 2 : 1,
      dependencies: ['setup_e2e'],
    },
  ],

  /* Global configuration */
  timeout: testTimeout,

  expect: {
    timeout: expectTimeout,
  },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !isCI,
  //   timeout: 120000,
  // },

  /* Global setup and teardown */
  globalSetup: path.join(__dirname, './global-setup.ts'),
  globalTeardown: path.join(__dirname, './global-teardown.ts'),
});
