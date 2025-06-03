const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}:`, response.status);
      process.exit(1);
    }

    const json = await response.json();
    allData = allData.concat(json.data || []);
    lastEvaluatedKey = json.lastEvaluatedKey;
  } while (lastEvaluatedKey);

  return allData;
};

async function fetchStaticData() {
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
    const token = response?.AuthenticationResult?.AccessToken;

    if (!token) {
      console.error('Error authenticating user...');
      process.exit(1);
    }

    const [correspondences, letters] = await Promise.all([
      fetchAllPages('correspondence', token),
      fetchAllPages('letter', token),
    ]);

    const sentDates = letters
      .map((l) => new Date(l.sentAt))
      .filter((d) => !isNaN(d));

    const earliestSentAtDate = sentDates.length
      ? new Date(Math.min(...sentDates)).toISOString()
      : null;

    const searchData = { correspondences: [], recipients: [], letters: [] };

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
        reason: { category },
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

    searchData.letters.sort((a, b) => a.title.localeCompare(b.title));
    searchData.correspondences.sort((a, b) => a.title.localeCompare(b.title));
    searchData.recipients.sort((a, b) => a.lastName.localeCompare(b.lastName));

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
      earliestSentAtDate,
    };

    const dataDir = path.join(__dirname, '../public/data');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
      path.join(dataDir, 'data.json'),
      JSON.stringify(data, null, 2),
    );
    fs.writeFileSync(
      path.join(dataDir, 'search.json'),
      JSON.stringify(searchData, null, 2),
    );

    console.log('✅ Data successfully written.');
  } catch (err) {
    console.error('Error loading data:', err);
    process.exit(1);
  }
}

async function uploadSentrySourceMaps() {
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('Skipping Sentry source map upload: Not a production build.');
  //   return;
  // }

  const { SENTRY_AUTH_TOKEN_SOURCE_MAPS, SENTRY_ORG, SENTRY_PROJECT } =
    process.env;

  if (!SENTRY_AUTH_TOKEN_SOURCE_MAPS || !SENTRY_ORG || !SENTRY_PROJECT) {
    console.warn('Sentry upload skipped: missing SENTRY_* env vars.');
    return;
  }

  const release = execSync('git rev-parse HEAD').toString().trim();
  console.log(`Uploading source maps to Sentry for release ${release}...`);

  try {
    const tokenFlag = `--auth-token ${SENTRY_AUTH_TOKEN_SOURCE_MAPS}`;

    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} new ${release}`,
      { stdio: 'inherit' },
    );
    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} files ${release} upload-sourcemaps .next --url-prefix "~/_next" --validate`,
      { stdio: 'inherit' },
    );
    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} finalize ${release}`,
      { stdio: 'inherit' },
    );

    console.log('Sentry source maps uploaded.');
  } catch (err) {
    console.error('Sentry source map upload failed: ', err.message);
  }
}

const noRefresh = process.argv.includes('--no-refresh');

(async () => {
  if (noRefresh) {
    process.exit(0);
  }

  console.log('Fetching static data from 100 Letters API...');
  await fetchStaticData();
  await uploadSentrySourceMaps();
})();
