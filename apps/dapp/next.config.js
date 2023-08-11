const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  sentry: {
    hideSourceMaps: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: process.env.OPTIMIZE_IMAGES === 'false' ? true : false,
  },
  async redirects() {
    return [
      {
        source: '/share',
        destination: '/',
        permanent: false,
      },
      {
        source: '/',
        destination: '/ssov',
        permanent: false,
      },
      {
        source: '/scalps',
        destination: '/scalps/ETH',
        permanent: false,
      },
      {
        source: '/ssov-new',
        destination: '/ssov-new/ARB',
        permanent: false,
      },
      {
        source: '/ssov-v3/:path*',
        destination: '/ssov/:path*',
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
