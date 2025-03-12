/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['google.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
            },
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            async_hooks: false,
        };
        return config;
    },
};

export default nextConfig;
