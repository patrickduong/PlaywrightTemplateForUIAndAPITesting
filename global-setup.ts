import { getAccessToken, getAccessTokenBasic } from './TEST_PROJECT/API/tests/setups/auth.helper';
import { FileHelper } from './UTILS/file-helper';
import { environment } from './playwright.config';

export default async function globalSetup() {
  const resultsDir = './allure-results';
  const reportDir = './allure-report';

  // Clean up files in allure-results and allure-report
  FileHelper.cleanDirectory(resultsDir);
  FileHelper.cleanDirectory(reportDir);

  // Attempt to get access token for authenticated endpoints
  // Note: The contact list API may not require authentication for basic CRUD operations
  try {
    // getAccessToken(environment);
    await getAccessTokenBasic(environment);
  } catch (error) {
    console.log('');
    console.log('WARNING: Could not obtain access token. Some API tests may fail if authentication is required.');
    console.log('Make sure your test account credentials are correct in .env.local');
    console.log('');
  }
}
