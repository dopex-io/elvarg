const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  sentry: {
    hideSourceMaps: true,
  },
  async redirects() {
    return [
      {
        source: '/share',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  org: 'dopex-io',
  project: 'dapp',
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
