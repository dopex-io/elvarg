module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/nfts/duel',
        permanent: false,
      },
      {
        source: '/diamondpepes2',
        destination: '/nfts/diamondpepes2',
        permanent: false,
      },
      {
        source: '/proof',
        destination: '/nft/proof',
        permanent: false,
      },
    ];
  },
};
