import { APIRequestContext, request } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Register a new user account
 * @param apiContext - Playwright API request context
 * @param baseURL - API base URL
 * @param email - User email
 * @param password - User password
 * @returns True if registration successful or user exists, False if registration failed
 */
async function registerUser(
  apiContext: APIRequestContext,
  baseURL: string,
  email: string,
  password: string
): Promise<boolean> {
  try {
    console.log('🔄 Attempting user registration...');
    console.log(`   Email: ${email}`);

    const response = await apiContext.post(`${baseURL}/users`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: email,
        password: password,
      },
    });

    const responseStatus = response.status();
    const responseBody = await response.text();

    console.log(`   Response Status: ${responseStatus}`);

    if (response.ok()) {
      console.log('✓ User registration successful');
      return true;
    } else if (responseStatus === 400 || responseStatus === 409) {
      // User already exists - this is OK, we'll try to login
      console.log('✓ User already exists (status 400/409) - will attempt login');
      return true;
    } else {
      console.log(`✗ User registration failed: ${responseStatus} - ${responseBody}`);
      return false;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`✗ Registration error: ${errorMsg}`);
    return false;
  }
}

async function getAccessToken(environment: string) {
  let token: string;
  const authURL = process.env.AUT_API_URL!;
  const autSubUrl = process.env.PATH_URL!;
  const apiContext: APIRequestContext = await request.newContext();

  try {
    const response = await apiContext.post(`${authURL}${autSubUrl}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        grant_type: 'password',
        username: `${process.env.USER_NAME!}`,
        password: `${process.env.PASS_WORD!}`,
      },
    })
    console.log("get token response" + response);

    if (!response.ok()) {
      throw new Error(
        `Failed to authenticate: ${response.status()} - ${response.statusText()}`
      )
    }

    // Parse the response to get the access token
    const jsonData = await response.json();

    if (jsonData && jsonData.token) {
      token = jsonData.token;

      // You can set the token in the environment or use it further as needed
      setEnvValue(environment, 'ACCESS_TOKEN', token);
    }
  } catch (error) {
    console.error(error);
  }

  // Dispose of the context
  await apiContext.dispose();
}

async function getAccessTokenBasic(environment: string) {
  let token: string;
  const authURL = process.env.AUT_API_URL!;
  const autSubUrl = process.env.PATH_URL!;
  const username = process.env.USER_NAME!;
  const password = process.env.PASS_WORD!;
  const apiContext: APIRequestContext = await request.newContext();

  try {
    console.log('');
    console.log('=== Starting Authentication Flow ===');
    
    // Step 1: Register user (or ignore if already exists)
    console.log('');
    console.log('Step 1: Register/Create User Account');
    const registrationSuccess = await registerUser(apiContext, authURL, username, password);
    
    if (!registrationSuccess) {
      console.log('⚠ Registration check failed - continuing with login attempt...');
    }

    // Step 2: Authenticate with credentials
    console.log('');
    console.log('Step 2: Authenticate User');
    const loginUrl = `${authURL}${autSubUrl}`;
    console.log(`   URL: ${loginUrl}`);
    console.log(`   Email: ${username}`);

    const response = await apiContext.post(loginUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: username,
        password: password,
      },
    });

    const responseStatus = response.status();
    console.log(`   Response Status: ${responseStatus}`);

    if (!response.ok()) {
      const errorBody = await response.text();
      console.log('');
      console.log('❌ ERROR: Authentication failed');
      console.log(`   URL: ${loginUrl}`);
      console.log(`   Status: ${responseStatus}`);
      console.log(`   Response: ${errorBody}`);
      console.log('');
      console.log('Troubleshooting:');
      console.log(`  1. Email is correct: ${username}`);
      console.log('  2. Password is correct');
      console.log(`  3. Account exists on: ${authURL}`);
      console.log(`  4. Make sure user was registered: ${authURL}/users`);
      throw new Error(
        `Failed to authenticate: ${responseStatus} - ${response.statusText()}`
      );
    }

    // Parse the response to get the access token
    const jsonData = await response.json();
    console.log('✓ Authentication successful');
    console.log(`   Response keys: ${Object.keys(jsonData).join(', ')}`);

    // Try multiple possible token keys
    if (jsonData && jsonData.token) {
      token = jsonData.token;
      console.log('✓ Token obtained (key: "token")');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log(`✓ Token saved to .env.${environment}`);
    } else if (jsonData && jsonData.accessToken) {
      token = jsonData.accessToken;
      console.log('✓ Token obtained (key: "accessToken")');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log(`✓ Token saved to .env.${environment}`);
    } else if (jsonData && jsonData.access_token) {
      token = jsonData.access_token;
      console.log('✓ Token obtained (key: "access_token")');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log(`✓ Token saved to .env.${environment}`);
    } else {
      console.log('');
      console.log('⚠ WARNING: No token found in response');
      console.log(`  Response keys: ${Object.keys(jsonData).join(', ')}`);
      console.log(`  Full response: ${JSON.stringify(jsonData)}`);
    }

    console.log('');
    console.log('=== Authentication Flow Complete ===');
    console.log('');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log('');
    console.log(`❌ Authentication error: ${errorMsg}`);
    console.log('');
  }

  // Dispose of the context
  await apiContext.dispose();
}

function setEnvValue(environment: string, key: string | RegExp, value: string) {
  const envPath = `configs/.env.${environment}`;

  // read file from hdd & split if from a line break to a array
  const ENV_VARS = fs.readFileSync(envPath, 'utf8').split(os.EOL);

  // find the env we want based on the key
  const lineToFind = ENV_VARS.find((line: string) => {
    return line.match(new RegExp(key));
  });

  if (!lineToFind) {
    console.warn(`⚠ Could not find environment variable with key: ${key}`);
    return;
  }

  const target = ENV_VARS.indexOf(lineToFind);

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync(envPath, ENV_VARS.join(os.EOL));
}
export { getAccessToken, getAccessTokenBasic, setEnvValue };
