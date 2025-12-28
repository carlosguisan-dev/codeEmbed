/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env' });
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
