import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/drei', '@react-three/fiber'],
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
  serverExternalPackages: [
      'three',
      '@react-three/fiber',
      '@react-three/drei'
  ],
   webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': require.resolve('react/jsx-runtime'),
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    };
    return config;
  }
};

export default nextConfig;
