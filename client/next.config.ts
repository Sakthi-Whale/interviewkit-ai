/*this file is the Next.js configuration file for the client-side code of the application. It specifies allowed development origins to enable cross-origin requests from specified IP addresses during development. */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.35"],
};

export default nextConfig;