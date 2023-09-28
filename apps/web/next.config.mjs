import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@acme/emails"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default withContentlayer(nextConfig);
