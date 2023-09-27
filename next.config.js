/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  distDir: 'build',
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'stylesheets')],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
