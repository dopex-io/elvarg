module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/ssov',
      //   permanent: false,
      // },
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
    ];
  },
};
