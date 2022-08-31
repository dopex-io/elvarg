module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vaults/straddles',
        permanent: false,
      },
      {
        source: '/otc',
        destination: '/vaults/straddles',
        permanent: false,
      },
      {
        source: '/otc/chat',
        destination: '/vaults/straddles',
        permanent: false,
      },
    ];
  },
};
