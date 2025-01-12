/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        module: /node_modules/,
        message: /peer dependency/,
      },
    ];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ghluwenhtnkkeigbhuvp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
    ],
  },
};

export default nextConfig;
