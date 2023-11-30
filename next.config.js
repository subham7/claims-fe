/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "clubprofilepics.s3.ap-south-1.amazonaws.com",
      "safe-transaction-assets.safe.global",
      "./public/*",
      "cloudflare-ipfs.com",
      "logos.covalenthq.com",
      "cryptologos.cc",
      "www.datocms-assets.com",
    ],
  },
  webpack: (config, { isServer }) => {
    // Only run this for the client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Provide a mock implementation for the 'net' module
        net: false,
        tls: false,
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
