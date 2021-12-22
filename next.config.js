module.exports = {
  // Supported targets are "serverless" and "experimental-serverless-trace"
  images: {
    domains: ['ipfs.infura.io'],
  },
  target: 'serverless',
  generateBuildId: () => 'build',
};
