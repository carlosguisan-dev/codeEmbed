/** @type {import('next').NextConfig} */
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
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
    allowedDevOrigins: [
        "https://*.cloudworkstations.dev",
    ]
  },
};

module.exports = nextConfig;
