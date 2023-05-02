/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ["clubprofilepics.s3.ap-south-1.amazonaws.com", "./public/*"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
