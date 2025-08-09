import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // domains: ["127.0.0.1"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "1337",
                pathname: "**",
                search: "",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
