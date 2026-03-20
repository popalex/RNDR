import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Produces a self-contained output for Docker deployments
  output: "standalone",
  // Allow Next.js to resolve the monorepo root convex/ directory
  experimental: {
    // Required for standalone Docker builds in a monorepo:
    // tells Next.js to trace file dependencies from the workspace root
    // so that shared packages (e.g., convex/) are included in the output.
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  images: {
    remotePatterns: [
      // fal.ai CDN
      {
        protocol: "https",
        hostname: "**.fal.media",
      },
      // fal.ai storage
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // Add future provider CDNs here
    ],
  },
};

export default nextConfig;
