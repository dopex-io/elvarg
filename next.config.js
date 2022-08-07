module.exports = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ssov',
        permanent: false,
      },
      {
        source: '/otc',
        destination: '/ssov',
        permanent: false,
      },
      {
        source: '/otc/chat',
        destination: '/ssov',
        permanent: false,
      },
    ];
  },
};
