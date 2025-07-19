import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bs.floristic.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to solve a very specific issue with @react-three/fiber and Next.js
    // It ensures that the correct version of three.js and drei are used.
    config.resolve.alias = {
        ...config.resolve.alias,
        '@react-three/drei': path.resolve('./node_modules/@react-three/drei'),
        'three': path.resolve('./node_modules/three')
    };
    return config;
  },
};

export default nextConfig;
