import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const baseConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
  images: {
    unoptimized: true,
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ENABLE_ANALYZER === 'true',
});

export default withSentryConfig(withAnalyzer(baseConfig), {
  automaticVercelMonitors: true,
  disableLogger: true,
  org: '100-letters-project',
  project: '100-letters-project-client',
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
