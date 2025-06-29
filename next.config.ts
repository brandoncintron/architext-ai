import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",
            destination:
              process.env.NODE_ENV === "development"
                ? "http://127.0.0.1:8000/api/:path*"
                : "/api/",
          },
        ]
      : [];
  },
};

export default nextConfig;
