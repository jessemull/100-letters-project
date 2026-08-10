const envFileName =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test';

require('dotenv').config({ path: envFileName });
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const userPoolWebClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const username = process.env.COGNITO_USER_POOL_USERNAME;
const password = process.env.COGNITO_USER_POOL_PASSWORD;
const shouldPrintToken = process.argv.includes('--print');

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
    const accessToken = response.AuthenticationResult?.AccessToken;

    if (!accessToken) {
      console.error('No access token returned from Cognito.');
      process.exitCode = 1;
      return;
    }

    // Tokens are secrets — only print when explicitly requested.
    if (shouldPrintToken) {
      console.log('Access Token:');
      console.log(accessToken);
    } else {
      console.log(
        'Authenticated successfully. Re-run with --print to write the access token to stdout.',
      );
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    process.exitCode = 1;
  }
}

const getToken = async () => {
  await authenticateUser();
};

getToken();
