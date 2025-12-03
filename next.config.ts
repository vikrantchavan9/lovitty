require('dotenv').config();
import type {NextConfig} from 'next';

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
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      // This is required to make the Authorization header available to server actions
      allowedHeaders: ['Authorization'],
    },
  },
};

export default nextConfig;
