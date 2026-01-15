import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: false,
    // Permitir imágenes locales sin optimización
    domains: [],
  },
};

export default nextConfig;

