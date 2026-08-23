import crypto from "crypto";
import { CoreApi } from "midtrans-client";

export interface MidtransNotification {
  transaction_status?: string;
  fraud_status?: string;
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_id?: string;
  transaction_time?: string;
  payment_type?: string;
}

export interface SnapItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateSnapTokenParams {
  orderId: string;
  grossAmount: number;
  items: SnapItem[];
  customerEmail?: string;
  expiryMinutes?: number;
}

export interface SnapTokenResult {
  token: string;
  redirectUrl: string;
}

export interface QrCodeResult {
  transactionId: string;
  qrImageUrl: string;
  deeplinkUrl?: string;
}

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export async function createQrCodeToken(params: CreateSnapTokenParams): Promise<QrCodeResult> {
  // Core API /v2/charge dengan payment_type gopay → response berisi actions[].generate-qr-code (QRIS).
  const core = new CoreApi({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
  });

  const res: Record<string, unknown> = await core.charge({
    payment_type: "gopay",
    transaction_details: { order_id: params.orderId, gross_amount: params.grossAmount },
    item_details: params.items,
    customer_details: params.customerEmail ? { first_name: "", email: params.customerEmail } : undefined,
    gopay: {
      enable_callback: true,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nureaknit.com"}/checkout/qris-callback?order_id=${encodeURIComponent(params.orderId)}`,
    },
  });

  const actions = (res.actions ?? []) as Array<{ name: string; method: string; url: string }>;
  const qrAction = actions.find((a) => a.name === "generate-qr-code");
  const deeplink = actions.find((a) => a.name === "deeplink-redirect");

  if (!qrAction || !qrAction.url) {
    throw new Error("Midtrans did not return a QR code action");
  }

  return {
    transactionId: (res.transaction_id as string) ?? params.orderId,
    qrImageUrl: qrAction.url,
    deeplinkUrl: deeplink?.url,
  };
}

// Midtrans signature: sha512(serverKey + orderId + statusCode + grossAmount)
export function verifyMidtransSignature(serverKey: string, body: MidtransNotification): boolean {
  const { order_id, status_code, gross_amount, signature_key } = body;
  if (!order_id || !status_code || !gross_amount || !signature_key) return false;

  const expected = crypto
    .createHash("sha512")
    .update(serverKey + order_id + status_code + gross_amount)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature_key, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}