/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.CMS_INTERNAL_URL || 'http://localhost:8081'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
