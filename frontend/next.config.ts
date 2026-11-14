import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    skipMiddlewareUrlNormalize: true,
    async rewrites() {
        const apiOrigin = (
            process.env.API_URL ??
            process.env.ADMIN_API_ORIGIN ??
            "http://127.0.0.1:3001"
        ).replace(/\/$/, "");

        return [
            {
                source: "/media/files/:path*",
                destination: apiOrigin + "/files/:path*",
            },
        ];
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "55mb",
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
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
