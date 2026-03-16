import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@heroui/react", "@heroui/theme", "@heroui/system"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
    ],
  },
};

export default nextConfig;
