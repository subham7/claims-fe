/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ["clubprofilepics.s3.ap-south-1.amazonaws.com", "./public/*"],
    loader: "custom",
    loaderFile: "./public/assets/images/monogram.png",
  },
};

module.exports = nextConfig;
