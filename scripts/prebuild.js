const envFileName =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test';

require('dotenv').config({ path: envFileName });
const fs = require('fs');
const path = require('path');
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const userPoolWebClientId = process.env.COGNITO_USER_POOL_CLIENT_ID;
const username = process.env.COGNITO_USER_POOL_USERNAME;
const password = process.env.COGNITO_USER_POOL_PASSWORD;

const client = new CognitoIdentityProviderClient({
  region: 'us-west-2',
});

async function authenticateUser() {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: userPoolWebClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);

    if (
      !response ||
      !response.AuthenticationResult ||
      !response.AuthenticationResult.IdToken
    ) {
      console.error('Error authenticating user: ', error);
      process.exit(1);
    }

    const token = response.AuthenticationResult.IdToken;

    if (!token) {
      console.error('Error authenticating user: ', error);
      process.exit(1);
    } else {
      console.log('TOKEN: ' + token, response);
    }

    const envPath = path.resolve(__dirname, `../${envFileName}`);
    let envContent = '';

    if (!fs.accessSync(envPath, fs.constants.W_OK)) {
      console.error(`No write permission to ${envPath}`);
      process.exit(1);
    }

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const updatedEnvContent = envContent
      .split('\n')
      .map((line) =>
        line.startsWith('API_AUTH_TOKEN=') ? `API_AUTH_TOKEN=${token}` : line,
      )
      .join('\n');

    if (!updatedEnvContent.includes('API_AUTH_TOKEN=')) {
      envContent += `\nAPI_AUTH_TOKEN=${token}`;
    }

    fs.writeFileSync(envPath, updatedEnvContent, { flag: 'w' });

    console.log(`Token successfully updated in ${envFileName}...`);
  } catch (error) {
    console.error('Error authenticating user: ', error);
    process.exit(1);
  }
}

authenticateUser();
