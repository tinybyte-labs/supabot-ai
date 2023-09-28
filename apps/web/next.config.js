const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@acme/emails"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = withContentlayer(nextConfig);
