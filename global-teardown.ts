import { execSync } from 'child_process';
import { FileHelper } from './UTILS/file-helper';

export default async function globalTeardown() {
  const cookiesDir = './configs/.auth';

  FileHelper.cleanDirectory(cookiesDir); // clear session after done test

  // Generate and open the Allure report
  try {
    
    console.log('Generating Allure report...');
    execSync('npx allure generate ./allure-results --clean', { stdio: 'inherit' });

    console.log('Opening Allure report...');
    execSync('npx allure open ./allure-report', { stdio: 'inherit' });


  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('An error occurred:', errorMessage);
    console.error('Please check if the Allure CLI is installed and properly configured.');
  }

}