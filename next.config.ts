import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // content/*.json is read with fs at runtime (WHO-5 text) — make sure Vercel ships it.
  outputFileTracingIncludes: { '/**': ['./content/**/*'] },
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }] },
};

export default nextConfig;
