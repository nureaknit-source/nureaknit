import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://*.supabase.co data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  allowedDevOrigins: ["semirigorously-branchial-margit.ngrok-free.dev"]
};

export default withPayload(nextConfig);
