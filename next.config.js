module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/straddles',
        permanent: false,
      },
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
        source: '/otc',
        destination: '/straddles',
        permanent: false,
      },
      {
        source: '/otc/chat',
        destination: '/straddles',
        permanent: false,
      },
      {
        source: '/atlantics',
        destination: '/atlantics/manage/WETH-PUTS-WEEKLY',
        permanent: false,
      },
    ];
  },
};
