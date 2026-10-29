import type { NextConfig } from 'next';

// Each worktree is its own project root (a stray lockfile in the home folder would confuse Turbopack).
const root = import.meta.dirname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
