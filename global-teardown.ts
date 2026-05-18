import { execSync } from 'child_process';
import { FileHelper } from './UTILS/file-helper';

const cookiesDir = './configs/.auth';
const isCI = process.env.CI === 'true';

export default async function globalTeardown(): Promise<void> {
  // Clean up authentication files
  try {
    FileHelper.cleanDirectory(cookiesDir);
    console.log('✓ Cleaned up session artifacts');
  } catch (error) {
    console.warn('⚠ Warning: Could not clean auth files:', error instanceof Error ? error.message : error);
  }

  // Generate Allure report
  try {
    console.log('📊 Generating Allure report...');
    execSync('npx allure generate ./allure-results --clean -o ./allure-report', {
      stdio: 'inherit',
    });
    console.log('✓ Allure report generated successfully');

    // Only open report if not in CI and explicitly requested
    if (!isCI && process.env.OPEN_REPORT !== 'false') {
      console.log('🌐 Opening Allure report in browser...');
      execSync('npx allure open ./allure-report', {
        stdio: 'inherit',
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Error generating Allure report:', errorMsg);
    console.error('   Make sure the Allure CLI is installed: npm install -g allure-commandline');
  }
}