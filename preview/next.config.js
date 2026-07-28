const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: path.join(__dirname),
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "ncottage.ru" },
            { protocol: "https", hostname: "www.ncottage.ru" },
        ],
        formats: ["image/webp"],
    },
};

module.exports = nextConfig;
