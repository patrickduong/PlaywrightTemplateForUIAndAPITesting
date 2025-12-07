import { APIRequestContext, request } from '@playwright/test'

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
    const loginUrl = `${authURL}${autSubUrl}`;
    console.log('');
    console.log('--- Attempting authentication ---');
    console.log('URL: ' + loginUrl);
    console.log('Username: ' + username);

    const response = await apiContext.post(loginUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: username,
        password: password,
      },
    })

    const responseStatus = response.status();
    console.log('Response Status: ' + responseStatus);

    if (!response.ok()) {
      const errorBody = await response.text();
      console.log('');
      console.log('ERROR: Authentication failed at: ' + loginUrl);
      console.log('ERROR: Status: ' + responseStatus);
      console.log('ERROR: Response: ' + errorBody);
      console.log('');
      console.log('Please verify:');
      console.log('  1. Username/Email is correct: ' + username);
      console.log('  2. Password is correct');
      console.log('  3. Account exists on: ' + authURL);
      throw new Error(
        'Failed to authenticate - basic: ' + responseStatus + ' - ' + response.statusText()
      )
    }

    // Parse the response to get the access token
    const jsonData = await response.json();
    console.log('Authentication successful');
    console.log('Response data: ' + JSON.stringify(jsonData));

    // Try multiple possible token keys
    if (jsonData && jsonData.token) {
      token = jsonData.token;
      console.log('Token obtained (key: token)');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log('Token saved to .env.' + environment);
    } else if (jsonData && jsonData.accessToken) {
      token = jsonData.accessToken;
      console.log('Token obtained (key: accessToken)');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log('Token saved to .env.' + environment);
    } else if (jsonData && jsonData.access_token) {
      token = jsonData.access_token;
      console.log('Token obtained (key: access_token)');
      setEnvValue(environment, 'ACCESS_TOKEN', token);
      console.log('Token saved to .env.' + environment);
    } else {
      console.log('');
      console.log('WARNING: No token found in response');
      console.log('Response keys: ' + Object.keys(jsonData).join(', '));
      console.log('Full response: ' + JSON.stringify(jsonData));
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log('');
    console.log('ERROR: Authentication error: ' + errorMsg);
  }

  // Dispose of the context
  await apiContext.dispose();
}

function setEnvValue(environment: string, key: string | RegExp, value: string) {
  const fs = require('fs');
  const os = require('os');
  const path = 'configs/.env.' + environment;

  // read file from hdd & split if from a line break to a array
  const ENV_VARS = fs.readFileSync(path, 'utf8').split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line: string) => {
      return line.match(new RegExp(key));
    })
  );

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync(path, ENV_VARS.join(os.EOL));
}
export { getAccessToken, getAccessTokenBasic, setEnvValue };
