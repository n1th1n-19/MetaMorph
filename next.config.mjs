/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;