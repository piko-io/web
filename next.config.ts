import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "s3.alpa.dev",
      },
      {
        protocol: "https",
        hostname: "piko.alpa.dev",
      },
    ],
  },
};

export default nextConfig;