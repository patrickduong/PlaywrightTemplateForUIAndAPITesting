import { getAccessTokenBasic } from './TEST_PROJECT/API/tests/setups/auth.helper';
import { FileHelper } from './UTILS/file-helper';
import { environment } from './playwright.config';

const resultsDir = './allure-results';
const reportDir = './allure-report';

export default async function globalSetup(): Promise<void> {
  // Clean up files in allure-results and allure-report
  try {
    FileHelper.cleanDirectory(resultsDir);
    FileHelper.cleanDirectory(reportDir);
    console.log('✓ Cleaned up old test artifacts');
  } catch (error) {
    console.warn('⚠ Warning: Could not clean directories:', error instanceof Error ? error.message : error);
  }

  // Attempt to get access token for authenticated endpoints
  try {
    console.log('🔐 Setting up API authentication...');
    await getAccessTokenBasic(environment);
    console.log('✓ API authentication setup successful');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('⚠ WARNING: Could not obtain access token');
    console.warn(`   Error: ${errorMsg}`);
    console.warn('   Some API tests may fail if authentication is required.');
    console.warn('   Make sure your test account credentials are correct in .env.local');
  }
}
