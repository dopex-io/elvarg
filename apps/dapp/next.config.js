module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/ir',
        destination: '/straddles',
        permanent: false,
      },
      {
        source: '/ir/:path*',
        destination: '/straddles',
        permanent: false,
      },
      {
        source: '/ssov-v3/:path*',
        destination: '/ssov/:path*',
        permanent: false,
      },
      {
        source: '/',
        destination: '/rdpx-v2/mint',
        permanent: false,
      },
    ];
  },
};
