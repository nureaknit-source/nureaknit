import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildManualPaymentWaLink } from "@/lib/commerce/whatsapp";

describe("buildManualPaymentWaLink", () => {
  const originalEnv = process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER = "08123456789";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER = originalEnv;
  });

  it("menghasilkan link WhatsApp dengan nomor yang dinormalisasi ke 62", () => {
    const link = buildManualPaymentWaLink({
      reference: "ORD-999",
      total: 150000,
    });

    expect(link).toContain("https://wa.me/628123456789?text=");
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain("ORD-999");
    expect(decoded).toContain("150.000");
    expect(decoded).toContain("Halo Nurea Knit!");
  });

  it("memasukkan rincian items, nama, alamat, dan catatan dengan rapi", () => {
    const link = buildManualPaymentWaLink({
      reference: "ORD-888",
      customerName: "Siti Rahma",
      customerPhone: "08987654321",
      customerAddress: "Jl. Mawar No. 10, Bandung",
      customerNotes: "Warna krem pastel ya kak",
      items: [
        { title: "Daisy Cardigan", quantity: 1, unitPrice: 220000 },
        { title: "Knitting Hook 4mm", quantity: 2, unitPrice: 25000 },
      ],
      total: 270000,
    });

    const decoded = decodeURIComponent(link);
    expect(decoded).toContain("ORD-888");
    expect(decoded).toContain("Siti Rahma");
    expect(decoded).toContain("Jl. Mawar No. 10, Bandung");
    expect(decoded).toContain("Warna krem pastel ya kak");
    expect(decoded).toContain("Daisy Cardigan (1x)");
    expect(decoded).toContain("Knitting Hook 4mm (2x)");
    expect(decoded).toContain("Total Pembayaran:* Rp 270.000");
  });

  it("mengembalikan string kosong jika nomor admin tidak dikonfigurasi", () => {
    delete process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER;
    const link = buildManualPaymentWaLink({
      reference: "ORD-000",
      total: 50000,
    });
    expect(link).toBe("");
  });
});
