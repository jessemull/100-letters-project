const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const password = process.env.COGNITO_USER_POOL_PASSWORD;
const userPoolWebClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const username = process.env.COGNITO_USER_POOL_USERNAME;

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

    const [unsorted, letters] = await Promise.all([
      fetchAllPages('correspondence', token),
      fetchAllPages('letter', token),
    ]);

    // Sort correspondences by the most recent sentAt date from their letters
    const correspondences = unsorted.sort((a, b) => {
      // Get the most recent sentAt date for each correspondence
      const getLatestSentAt = (correspondence) => {
        if (!correspondence.letters || correspondence.letters.length === 0) {
          return new Date(0); // Use epoch for correspondences with no letters
        }

        const sentDates = correspondence.letters
          .map((letter) => new Date(letter.sentAt))
          .filter((date) => !isNaN(date.getTime()));

        return sentDates.length > 0
          ? new Date(Math.max(...sentDates))
          : new Date(0);
      };

      const aLatest = getLatestSentAt(a);
      const bLatest = getLatestSentAt(b);

      return bLatest - aLatest; // Sort in descending order (most recent first)
    });

    const sentDates = letters
      .map((letter) => new Date(letter.sentAt))
      .filter((date) => !isNaN(date.getTime()));

    const earliestSentAtDate = sentDates.length
      ? new Date(Math.min(...sentDates)).toISOString()
      : new Date().toISOString();

    const searchData = {
      correspondences: [],
      recipients: [],
      letters: [],
    };

    for (const correspondence of correspondences) {
      const {
        correspondenceId,
        reason: { category },
        title: correspondenceTitle,
        recipient,
        letters,
      } = correspondence;

      searchData.correspondences.push({
        correspondenceId,
        reason: {
          category,
        },
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
      const { address, ...recipient } = correspondence.recipient || {};
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
        const { address, ...recipient } = correspondence.recipient || {};
        acc[correspondence.correspondenceId] = {
          ...correspondence,
          recipient: {
            ...recipient,
            fullName:
              `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim(),
          },
        };
        return acc;
      },
      {},
    );

    const data = {
      correspondences: fullNameCorrespondences,
      correspondencesById,
    };

    const bootstrapData = {
      correspondences: fullNameCorrespondences.slice(0, 3),
      earliestSentAtDate,
      totalCorrespondences: fullNameCorrespondences.length,
    };

    const dataDir = path.join(__dirname, '../public/data');
    fs.mkdirSync(dataDir, { recursive: true });

    const cleanupOldVersions = () => {
      const files = fs.readdirSync(dataDir);
      const oldVersionedFiles = files.filter((file) =>
        file.match(/^(data|search)\.\d+\.json$/),
      );

      oldVersionedFiles.forEach((file) => {
        const filePath = path.join(dataDir, file);
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old version: ${file}`);
      });
    };

    cleanupOldVersions();

    const timestamp = Date.now();

    // Only write versioned files - no fallbacks needed
    const outputPath = path.join(dataDir, `data.${timestamp}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    const searchPath = path.join(dataDir, `search.${timestamp}.json`);
    fs.writeFileSync(searchPath, JSON.stringify(searchData, null, 2));

    const bootstrapPath = path.join(dataDir, 'bootstrap.json');
    const updatedBootstrapData = {
      ...bootstrapData,
      dataVersion: timestamp,
    };
    fs.writeFileSync(
      bootstrapPath,
      JSON.stringify(updatedBootstrapData, null, 2),
    );

    console.log(`Data successfully written to ${outputPath}`);
    console.log(`Search index successfully written to ${searchPath}`);
    console.log(`Bootstrap data successfully written to ${bootstrapPath}`);
    console.log(`Cache-busting timestamp: ${timestamp}`);
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
