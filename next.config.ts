import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["sharp"],
  allowedDevOrigins: ["semirigorously-branchial-margit.ngrok-free.dev"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "media.mayar.id",
      },
      {
        protocol: "https",
        hostname: "*.mayar.id",
      },
      {
        protocol: "https",
        hostname: "*.mayar.club",
      },
      {
        protocol: "https",
        hostname: "*.mayar.io",
      },
    ],
  },
  experimental: {
    cpus: 4,
    viewTransition: true,
    optimizePackageImports: ["lucide-react"],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://*.supabase.co https://media.mayar.id https://*.mayar.id https://*.mayar.club https://*.mayar.io data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.mayar.id https://api.mayar.club https://api.mayar.io https://challenges.cloudflare.com",
              "frame-src https://challenges.cloudflare.com",
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
