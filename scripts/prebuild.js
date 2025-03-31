const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const userPoolWebClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const username = process.env.COGNITO_USER_POOL_USERNAME;
const password = process.env.COGNITO_USER_POOL_PASSWORD;
const apiUrl = process.env.API_URL;

const client = new CognitoIdentityProviderClient({ region: 'us-west-2' });

const fetchData = async (endpoint, token) => {
  const url = `${apiUrl}/${endpoint}`;
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}: `, response.status);
      process.exit(1);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: `, error);
    process.exit(1);
  }
};

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
      console.error('Error authenticating user...');
      process.exit(1);
    }

    const token = response.AuthenticationResult.IdToken;

    const correspondences = await fetchData('correspondence', token);
    const letters = await fetchData('letter', token);
    const recipients = await fetchData('recipient', token);

    const data = { correspondences, letters, recipients };

    const outputPath = path.join(__dirname, '../public', 'data.json');

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Data successfully written to ${outputPath}`);
  } catch (error) {
    console.error('Error loading data: ', error);
    process.exit(1);
  }
}

const noRefresh = process.argv.includes('--no-refresh');
const outputPath = path.join(__dirname, '../public', 'data.json');

if (fs.existsSync(outputPath) && noRefresh) {
  console.log('File public/data.json already exists. Skipping data refresh...');
  process.exit(0);
} else {
  console.log('Fetching static data from 100 Letters API...');
  authenticateUser();
}
