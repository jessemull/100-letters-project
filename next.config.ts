const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
});

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
