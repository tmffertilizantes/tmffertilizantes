/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: "akamai",
    path: "",
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
