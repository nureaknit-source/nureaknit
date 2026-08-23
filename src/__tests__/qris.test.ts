import { describe, it, expect, vi } from "vitest";

const charge = vi.fn();

vi.mock("midtrans-client", () => ({
  CoreApi: class {
    charge = charge;
  },
}));

import { createQrCodeToken } from "@/lib/payments/midtrans";

describe("createQrCodeToken (native QRIS via CoreApi /v2/charge)", () => {
  it("mengirim payment_type gopay & mengembalikan qrImageUrl dari actions", async () => {
    charge.mockResolvedValueOnce({
      transaction_id: "tx-99",
      payment_type: "gopay",
      transaction_status: "pending",
      actions: [
        { name: "generate-qr-code", method: "GET", url: "https://api.sandbox.veritrans.co.id/v2/gopay/tx-99/qr-code" },
        { name: "deeplink-redirect", method: "GET", url: "https://simulator.sandbox.midtrans.com/gopay/checkout?ref=x" },
      ],
    });

    const res = await createQrCodeToken({
      orderId: "NK-777",
      grossAmount: 36000,
      items: [{ id: "2", price: 36000, quantity: 1, name: "cup holder" }],
    });

    expect(res.transactionId).toBe("tx-99");
    expect(res.qrImageUrl).toContain("qr-code");
    expect(res.deeplinkUrl).toContain("simulator");
    expect(charge).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_type: "gopay",
        transaction_details: { order_id: "NK-777", gross_amount: 36000 },
        gopay: expect.objectContaining({ enable_callback: true, callback_url: expect.stringContaining("qris-callback") }),
      }),
    );
  });

  it("lempar bila Midtrans tidak kirim generate-qr-code", async () => {
    charge.mockResolvedValueOnce({ transaction_id: "t", actions: [] });
    await expect(createQrCodeToken({ orderId: "X", grossAmount: 1000, items: [] })).rejects.toThrow("QR code");
  });
});
