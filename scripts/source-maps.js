const { execSync } = require('child_process');

let path = '.env.local';

switch (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT) {
  case 'production':
    path = '.env.production';
    break;
  case 'test':
    path = '.env.test';
    break;
  default:
    path = '.env.local';
    break;
}

require('dotenv').config({ path });

(async () => {
  const env = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

  const { SENTRY_AUTH_TOKEN_SOURCE_MAPS, SENTRY_ORG, SENTRY_PROJECT } =
    process.env;

  if (!SENTRY_AUTH_TOKEN_SOURCE_MAPS || !SENTRY_ORG || !SENTRY_PROJECT) {
    console.warn(
      'Sentry upload skipped due to missing environment variables...',
    );
    return;
  }

  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  const release = `${env}-${commitHash}`;

  console.log(
    `Uploading source maps for release ${release} in ${env} environment...`,
  );

  try {
    const tokenFlag = `--auth-token ${SENTRY_AUTH_TOKEN_SOURCE_MAPS}`;

    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} new ${release}`,
      { stdio: 'inherit' },
    );
    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} files ${release} upload-sourcemaps .next --url-prefix "~/_next" --validate --ignore-file .sentryignore`,
      { stdio: 'inherit' },
    );
    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} finalize ${release}`,
      { stdio: 'inherit' },
    );
    execSync(
      `npx sentry-cli ${tokenFlag} releases --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} deploys ${release} new --env ${env}`,
      { stdio: 'inherit' },
    );

    console.log('Sentry source maps uploaded.');
  } catch (err) {
    console.error('Sentry source map upload failed: ', err.message);
  }
})();
