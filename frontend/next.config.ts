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
};

export default nextConfig;
