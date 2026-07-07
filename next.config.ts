import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ["192.168.1.96", "192.168.1.70", "192.168.1.68"],
};

export default nextConfig;
