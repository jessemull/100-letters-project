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
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const client = new CognitoIdentityProviderClient({ region: 'us-west-2' });

const fetchAllPages = async (endpoint, token) => {
  let allData = [];
  let lastEvaluatedKey = null;

  do {
    let url = `${apiUrl}/${endpoint}`;

    if (lastEvaluatedKey) {
      url += `?lastEvaluatedKey=${encodeURIComponent(lastEvaluatedKey)}`;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.error(`Error fetching data from ${url}: `, response.status);
        process.exit(1);
      }

      const json = await response.json();
      allData = allData.concat(json.data || []);
      lastEvaluatedKey = json.lastEvaluatedKey;
    } catch (error) {
      console.error(`Error fetching data from ${url}: `, error);
      process.exit(1);
    }
  } while (lastEvaluatedKey);

  return allData;
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
      !response.AuthenticationResult.AccessToken
    ) {
      console.error('Error authenticating user...');
      process.exit(1);
    }

    const token = response.AuthenticationResult.AccessToken;

    const correspondences = await fetchAllPages('correspondence', token);
    const letters = await fetchAllPages('letter', token);

    const completedStatuses = ['COMPLETED', 'RESPONDED'];

    const respondedCount = correspondences.filter((c) =>
      completedStatuses.includes(c.status),
    ).length;

    const totalCount = correspondences.length;

    const responseCompletion = totalCount > 0 ? respondedCount / totalCount : 0;

    const sentDates = letters
      .map((letter) => new Date(letter.sentAt))
      .filter((date) => !isNaN(date.getTime()));

    const earliestSentAtDate = sentDates.length
      ? new Date(Math.min(...sentDates)).toISOString()
      : null;

    const searchData = {
      correspondences: [],
      recipients: [],
      letters: [],
    };

    for (const correspondence of correspondences) {
      const {
        correspondenceId,
        title: correspondenceTitle,
        recipient,
        letters,
      } = correspondence;

      searchData.correspondences.push({
        correspondenceId,
        title: correspondenceTitle,
      });

      if (recipient?.firstName || recipient?.lastName) {
        searchData.recipients.push({
          correspondenceId,
          firstName: recipient.firstName || '',
          lastName: recipient.lastName || '',
          fullName:
            `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim(),
        });
      }

      for (const letter of letters || []) {
        if (letter.title) {
          searchData.letters.push({
            correspondenceId,
            letterId: letter.letterId,
            title: letter.title,
          });
        }
      }
    }

    searchData.letters.sort((a, b) =>
      (a.title || '')
        .toLowerCase()
        .localeCompare((b.title || '').toLowerCase()),
    );

    searchData.correspondences.sort((a, b) =>
      (a.title || '')
        .toLowerCase()
        .localeCompare((b.title || '').toLowerCase()),
    );

    searchData.recipients.sort((a, b) =>
      (a.lastName || '')
        .toLowerCase()
        .localeCompare((b.lastName || '').toLowerCase()),
    );

    const fullNameCorrespondences = correspondences.map((correspondence) => {
      const recipient = correspondence.recipient || {};
      return {
        ...correspondence,
        recipient: {
          ...recipient,
          fullName:
            `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim(),
        },
      };
    });

    const correspondencesById = correspondences.reduce(
      (acc, correspondence) => {
        acc[correspondence.correspondenceId] = correspondence;
        return acc;
      },
      {},
    );

    const data = {
      correspondences: fullNameCorrespondences,
      correspondencesById,
      earliestSentAtDate,
      responseCompletion,
    };

    const dataDir = path.join(__dirname, '../src/data');
    fs.mkdirSync(dataDir, { recursive: true });

    const outputPath = path.join(dataDir, 'data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    const searchPath = path.join(dataDir, 'search.json');
    fs.writeFileSync(searchPath, JSON.stringify(searchData, null, 2));

    console.log(`Data successfully written to ${outputPath}`);
    console.log(`Search index successfully written to ${searchPath}`);
  } catch (error) {
    console.error('Error loading data: ', error);
    process.exit(1);
  }
}

const noRefresh = process.argv.includes('--no-refresh');

if (noRefresh) {
  process.exit(0);
} else {
  console.log('Fetching static data from 100 Letters API...');
  authenticateUser();
}
