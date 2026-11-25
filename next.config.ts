import type { NextConfig } from "next";

// cacheComponents is off on purpose: every signed-in page reads the session and private data.
const nextConfig: NextConfig = {
  // WHO-5 text is read from content/ at runtime (Thai file may be added by the team later).
  outputFileTracingIncludes: { "/**": ["./content/**"] },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
