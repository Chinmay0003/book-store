import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "best-kid-book-media.s3.eu-north-1.amazonaws.com",
        pathname: "**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
