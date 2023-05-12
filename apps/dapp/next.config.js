/**
 * @type {import('next').NextConfig}
 */
module.exports = {
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
        source: '/ssov-v3/:path*',
        destination: '/ssov/:path*',
        permanent: false,
      },
    ];
  },
};
