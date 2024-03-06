/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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

module.exports = nextConfig;
