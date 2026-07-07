import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ["192.168.1.96", "192.168.1.70", "192.168.1.68"],
};

export default withPWA(nextConfig);
