import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ["192.168.1.96", "192.168.1.70", "192.168.1.68"],
};

export default withPWA(nextConfig);
