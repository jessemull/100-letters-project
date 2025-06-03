import { withSentryConfig } from '@sentry/nextjs';

const config = {
  output: 'export',
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
  },
};

export default withSentryConfig(config, {
  automaticVercelMonitors: true,
  disableLogger: true,
  org: '100-letters-project',
  project: '100-letters-project-client',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
