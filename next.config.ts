import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only serve local images — no external remotePatterns needed
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
};

export default nextConfig;
