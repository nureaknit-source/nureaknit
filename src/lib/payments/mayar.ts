import crypto from "crypto";

export interface MayarWebhookData {
  id?: string;
  transactionId?: string;
  status?: string;
  transactionStatus?: string;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  amount?: number;
  paymentMethod?: string;
  description?: string;
  extraData?: Record<string, unknown>;
  createdAt?: string | number;
  paidAt?: string | number;
  [key: string]: unknown;
}

export interface MayarWebhookPayload {
  event?: string;
  data?: MayarWebhookData;
  [key: string]: unknown;
}

export interface CreateDynamicQrParams {
  orderId: string;
  grossAmount: number;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
}

export interface QrCodeResult {
  transactionId: string;
  qrImageUrl: string;
}

export function getMayarBaseUrl(): string {
  if (process.env.MAYAR_API_BASE_URL) {
    return process.env.MAYAR_API_BASE_URL.replace(/\/+$/, "");
  }
  const isProduction = process.env.MAYAR_ENVIRONMENT === "production";
  return isProduction ? "https://api.mayar.id/hl/v1" : "https://api.mayar.io/hl/v1";
}

export async function createDynamicQrCode(params: CreateDynamicQrParams): Promise<QrCodeResult> {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    throw new Error("MAYAR_API_KEY is not configured");
  }

  const baseUrl = getMayarBaseUrl();
  const endpoint = `${baseUrl}/qrcode/create`;

  const payload: Record<string, unknown> = {
    amount: Math.round(params.grossAmount),
  };
  if (params.customerName) payload.name = params.customerName;
  if (params.customerEmail) payload.email = params.customerEmail;
  if (params.customerMobile) payload.mobile = params.customerMobile;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Mayar QR creation failed with HTTP ${res.status}: ${errorText}`);
  }

  const json = (await res.json()) as {
    statusCode?: number;
    messages?: string;
    data?: {
      url?: string;
      id?: string;
      transactionId?: string;
      amount?: number;
    };
  };

  const qrUrl = json.data?.url;
  if (!qrUrl) {
    throw new Error("Mayar did not return a QR code URL");
  }

  return {
    transactionId: json.data?.transactionId || json.data?.id || params.orderId,
    qrImageUrl: qrUrl,
  };
}

export function verifyMayarWebhookToken(token: string | null): boolean {
  const secret = process.env.MAYAR_WEBHOOK_TOKEN;
  if (!secret || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(secret);

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
