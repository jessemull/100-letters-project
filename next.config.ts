import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: false,
});

export default withSentryConfig(withAnalyzer(baseConfig), {
  automaticVercelMonitors: true,
  disableLogger: true,
  org: '100-letters-project',
  project: '100-letters-project-client',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
