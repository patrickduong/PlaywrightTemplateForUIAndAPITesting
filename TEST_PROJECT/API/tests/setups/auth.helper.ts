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
export { getAccessToken, setEnvValue };
