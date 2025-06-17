/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  output: 'standalone',
  // Ensure images from public directory are properly handled
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig
