import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyMidtransSignature } from "@/lib/payments/midtrans";

const serverKey = "SB-Mid-server-test-123";

function sign(serverKey: string, orderId: string, statusCode: string, gross: string): string {
  return crypto.createHash("sha512").update(serverKey + orderId + statusCode + gross).digest("hex");
}

describe("verifyMidtransSignature", () => {
  it("menerima signature yang benar", () => {
    const body = {
      order_id: "NK-123456",
      status_code: "200",
      gross_amount: "150000.00",
      signature_key: sign(serverKey, "NK-123456", "200", "150000.00"),
    };
    expect(verifyMidtransSignature(serverKey, body)).toBe(true);
  });

  it("menolak signature salah", () => {
    const body = {
      order_id: "NK-123456",
      status_code: "200",
      gross_amount: "150000.00",
      signature_key: "deadbeef",
    };
    expect(verifyMidtransSignature(serverKey, body)).toBe(false);
  });

  it("menolak bila gross_amount dimanipulasi", () => {
    const body = {
      order_id: "NK-123456",
      status_code: "200",
      gross_amount: "999999.00",
      signature_key: sign(serverKey, "NK-123456", "200", "150000.00"),
    };
    expect(verifyMidtransSignature(serverKey, body)).toBe(false);
  });

  it("menolak bila field wajib kosong", () => {
    expect(verifyMidtransSignature(serverKey, {})).toBe(false);
    expect(
      verifyMidtransSignature(serverKey, { order_id: "x", status_code: "200", gross_amount: "1" }),
    ).toBe(false);
  });
});