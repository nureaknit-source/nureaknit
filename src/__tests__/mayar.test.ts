import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createDynamicQrCode,
  verifyMayarWebhookToken,
  getMayarBaseUrl,
} from "@/lib/payments/mayar";

describe("Mayar payment client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getMayarBaseUrl", () => {
    it("returns sandbox URL by default", () => {
      delete process.env.MAYAR_ENVIRONMENT;
      delete process.env.MAYAR_API_BASE_URL;
      expect(getMayarBaseUrl()).toBe("https://api.mayar.io/hl/v1");
    });

    it("returns production URL when MAYAR_ENVIRONMENT is production", () => {
      process.env.MAYAR_ENVIRONMENT = "production";
      delete process.env.MAYAR_API_BASE_URL;
      expect(getMayarBaseUrl()).toBe("https://api.mayar.id/hl/v1");
    });

    it("prioritizes MAYAR_API_BASE_URL when specified", () => {
      process.env.MAYAR_API_BASE_URL = "https://custom.mayar.test/v1/";
      expect(getMayarBaseUrl()).toBe("https://custom.mayar.test/v1");
    });
  });

  describe("createDynamicQrCode", () => {
    it("throws error if MAYAR_API_KEY is not configured", async () => {
      delete process.env.MAYAR_API_KEY;
      await expect(
        createDynamicQrCode({ orderId: "NK-001", grossAmount: 150000 }),
      ).rejects.toThrow("MAYAR_API_KEY is not configured");
    });

    it("sends correct payload and returns qrImageUrl and transactionId", async () => {
      process.env.MAYAR_API_KEY = "test_key_123";
      process.env.MAYAR_ENVIRONMENT = "sandbox";

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          statusCode: 200,
          messages: "Success",
          data: {
            id: "tx-mayar-99",
            url: "https://media.mayar.id/images/resized/480/sample-qr.png",
            amount: 150000,
          },
        }),
      });
      global.fetch = mockFetch;

      const res = await createDynamicQrCode({
        orderId: "NK-001",
        grossAmount: 150000,
        customerName: "Siti",
        customerEmail: "siti@example.com",
        customerMobile: "08123456789",
      });

      expect(res.transactionId).toBe("tx-mayar-99");
      expect(res.qrImageUrl).toBe("https://media.mayar.id/images/resized/480/sample-qr.png");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.mayar.io/hl/v1/qrcode/create",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test_key_123",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 150000,
            name: "Siti",
            email: "siti@example.com",
            mobile: "08123456789",
          }),
        }),
      );
    });

    it("throws error if Mayar response does not contain QR URL", async () => {
      process.env.MAYAR_API_KEY = "test_key_123";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ statusCode: 200, messages: "Success", data: {} }),
      });

      await expect(
        createDynamicQrCode({ orderId: "NK-001", grossAmount: 150000 }),
      ).rejects.toThrow("Mayar did not return a QR code URL");
    });

    it("throws error when API returns HTTP 4xx or 5xx", async () => {
      process.env.MAYAR_API_KEY = "test_key_123";
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => "Bad request",
      });

      await expect(
        createDynamicQrCode({ orderId: "NK-001", grossAmount: 150000 }),
      ).rejects.toThrow("Mayar QR creation failed with HTTP 400: Bad request");
    });
  });

  describe("verifyMayarWebhookToken", () => {
    beforeEach(() => {
      process.env.MAYAR_WEBHOOK_TOKEN = "super_secret_webhook_token_2026";
    });

    it("returns true for matching token", () => {
      expect(verifyMayarWebhookToken("super_secret_webhook_token_2026")).toBe(true);
    });

    it("returns false for mismatched token", () => {
      expect(verifyMayarWebhookToken("invalid_token")).toBe(false);
    });

    it("returns false for null or undefined token", () => {
      expect(verifyMayarWebhookToken(null)).toBe(false);
    });

    it("returns false when env secret is not set", () => {
      delete process.env.MAYAR_WEBHOOK_TOKEN;
      expect(verifyMayarWebhookToken("super_secret_webhook_token_2026")).toBe(false);
    });
  });
});
