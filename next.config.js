module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/ssov/v3/call/ETH',
        destination: '/ssov-v3/ETH-WEEKLY-CALLS-SSOV-V3',
        permanent: false,
      },
    ];
  },
};
