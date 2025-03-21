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

console.log(userPoolWebClientId, username, password);

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
      console.error('Error authenticating user');
      process.exit(1);
    }

    const token = response.AuthenticationResult.IdToken;
    const envPath = path.resolve(__dirname, `../${envFileName}`);

    let envContent = '';

    if (fs.existsSync(envPath)) {
      try {
        fs.accessSync(envPath, fs.constants.W_OK);
        envContent = fs.readFileSync(envPath, 'utf-8');
      } catch (err) {
        console.error(`No write permission to ${envPath}`);
        process.exit(1);
      }
    } else {
      console.log(`File ${envFileName} does not exist. Creating a new one...`);
    }

    let lines = envContent.split('\n').filter(Boolean);
    let tokenUpdated = false;

    lines = lines.map((line) => {
      if (line.startsWith('API_AUTH_TOKEN=')) {
        tokenUpdated = true;
        return `API_AUTH_TOKEN=${token}`;
      }
      return line;
    });

    if (!tokenUpdated) {
      lines.push(`API_AUTH_TOKEN=${token}`);
    }

    const newEnvContent = lines.join('\n') + '\n';
    fs.writeFileSync(envPath, newEnvContent, { flag: 'w' });

    console.log(`Token successfully updated in ${envFileName}`);
  } catch (error) {
    console.error('Error authenticating user:', error);
    process.exit(1);
  }
}

authenticateUser();
