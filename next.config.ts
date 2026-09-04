import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  allowedDevOrigins: ["semirigorously-branchial-margit.ngrok-free.dev"],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.midtrans.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://*.supabase.co https://*.midtrans.com https://*.veritrans.co.id data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.sandbox.midtrans.com https://api.midtrans.com https://challenges.cloudflare.com",
              "frame-src https://*.midtrans.com https://challenges.cloudflare.com",
              "frame-ancestors 'none'",
              "base-uri 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
