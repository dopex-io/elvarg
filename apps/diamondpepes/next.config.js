/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  generateBuildId: () => 'build',
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: process.env.OPTIMIZE_IMAGES === 'false' ? true : false,
  },
};

module.exports = nextConfig;
