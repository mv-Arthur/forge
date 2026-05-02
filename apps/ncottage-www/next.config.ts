import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ncottage.ru",
            },
        ],
    },
};

export default nextConfig;
