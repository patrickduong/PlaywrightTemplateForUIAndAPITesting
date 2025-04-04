import { getAccessToken } from './TEST_PROJECT/API/tests/setups/auth.helper';
import { FileHelper } from './UTILS/file-helper';
import { environment } from './playwright.config';

export default async function globalSetup() {
  const resultsDir = './allure-results';
  const reportDir = './allure-report';

  // Clean up files in allure-results and allure-report
  FileHelper.cleanDirectory(resultsDir);
  FileHelper.cleanDirectory(reportDir);

  getAccessToken(environment);
}