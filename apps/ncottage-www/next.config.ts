import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Allow the dev server to be reached via 127.0.0.1 (used by Playwright)
    // without the cross-origin _next/* warning.
    allowedDevOrigins: ["127.0.0.1"],
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
