export interface WaManualPaymentParams {
  reference: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  customerNotes?: string | null;
  items?: Array<{ title: string; quantity: number; unitPrice?: number }>;
  total: number;
}

function cleanWaNumber(num: string): string {
  let cleaned = num.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return cleaned;
}

export function buildManualPaymentWaLink(params: WaManualPaymentParams): string {
  const rawAdmin = process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER;
  if (!rawAdmin) return "";
  const admin = cleanWaNumber(rawAdmin);

  const itemsList =
    params.items && params.items.length > 0
      ? params.items
          .map(
            (i) =>
              `• ${i.title} (${i.quantity}x)${
                i.unitPrice ? ` - Rp ${i.unitPrice.toLocaleString("id-ID")}` : ""
              }`,
          )
          .join("\n")
      : "• Rincian produk sesuai pesanan di web";

  const message = [
    "Halo Nurea Knit! ✨",
    "Saya ingin melanjutkan pembayaran manual via transfer untuk pesanan saya:",
    "",
    `📋 *No. Pesanan:* ${params.reference}`,
    params.customerName ? `👤 *Nama:* ${params.customerName}` : "",
    params.customerPhone ? `📱 *No. HP/WA:* ${params.customerPhone}` : "",
    params.customerAddress ? `📍 *Alamat:* ${params.customerAddress}` : "",
    "",
    "📦 *Item yang Dipesan:*",
    itemsList,
    "",
    `💰 *Total Pembayaran:* Rp ${params.total.toLocaleString("id-ID")}`,
    params.customerNotes ? `📝 *Catatan:* ${params.customerNotes}` : "",
    "",
    "Mohon bantuan info rekening bank untuk transfer manual ya. Terima kasih! 🙏",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${admin}?text=${encodeURIComponent(message)}`;
}
