import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package.json in a parent directory
  // (outside this repo) would otherwise make Next.js guess wrong.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
