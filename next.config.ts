import {NextConfig} from "next";

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint : {
        ignoreDuringBuilds : true
    }
} satisfies NextConfig;

export default nextConfig;
