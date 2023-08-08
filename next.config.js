/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname)],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
