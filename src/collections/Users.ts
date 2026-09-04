import { APIError, type CollectionConfig } from "payload";
import { verifyTurnstile } from "@/lib/turnstile";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    loginWithUsername: false,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  admin: {
    group: "System",
    useAsTitle: "name",
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation, req }) => {
        if (operation === "login") {
          // Allow internal or test bypass
          if (process.env.NODE_ENV === "test" || req.context?.skipCaptcha) {
            return args;
          }

          // Extract token from cookie, request body, or headers
          const cookieHeader = req.headers?.get?.("cookie") || "";
          const cookieMatch = cookieHeader.match(/cf_turnstile_token=([^;]+)/);
          const cookieToken = cookieMatch
            ? decodeURIComponent(cookieMatch[1].trim())
            : undefined;

          const data = args?.data as Record<string, unknown> | undefined;
          const reqData = req?.data as Record<string, unknown> | undefined;
          const cfToken =
            cookieToken ||
            (typeof data?.cfToken === "string" ? data.cfToken : undefined) ||
            (typeof reqData?.cfToken === "string" ? reqData.cfToken : undefined) ||
            req.headers?.get?.("x-turnstile-token") ||
            req.headers?.get?.("cf-turnstile-response");

          // In development without configured keys, allow bypass if key is missing
          if (
            process.env.NODE_ENV === "development" &&
            !process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY &&
            !cfToken
          ) {
            return args;
          }

          if (!cfToken || typeof cfToken !== "string") {
            throw new APIError("Validasi Captcha wajib diselesaikan.", 400);
          }

          const clientIp =
            req.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers?.get?.("cf-connecting-ip") ||
            undefined;

          const verification = await verifyTurnstile(cfToken, clientIp);
          if (!verification.success) {
            throw new APIError(
              "Validasi Captcha gagal atau kedaluwarsa. Silakan coba lagi.",
              400,
            );
          }
        }
        return args;
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
    admin: ({ req: { user } }) => user?.role === "admin",
    unlock: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      label: "Role",
      admin: { position: "sidebar" },
    },
  ],
};
