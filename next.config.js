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
        source: '/otc',
        destination: '/straddles',
        permanent: false,
      },
      {
        source: '/otc/chat',
        destination: '/straddles',
        permanent: false,
      },
    ];
  },
};
