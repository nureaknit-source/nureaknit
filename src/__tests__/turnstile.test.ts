import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstile, CLOUDFLARE_TEST_SECRET_KEY } from "@/lib/turnstile";

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("mengekspor dummy secret key resmi Cloudflare", () => {
    expect(CLOUDFLARE_TEST_SECRET_KEY).toBe(
      "1x0000000000000000000000000000000AA",
    );
  });

  it("lolos otomatis pada mode test", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const result = await verifyTurnstile("any-token");
    expect(result.success).toBe(true);
  });

  it("gagal jika token kosong pada production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", "test-secret");

    const result = await verifyTurnstile("");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("missing-input-response");
  });

  it("gagal jika secret key belum dikonfigurasi pada production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", "");

    const result = await verifyTurnstile("some-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("missing-secret-key");
  });

  it("menggunakan dummy secret key resmi Cloudflare jika pada development secret key kosong", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", "");

    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX");
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("memanggil Cloudflare siteverify API dan mengembalikan sukses jika valid", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", "dummy-secret-key");

    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyTurnstile("valid-token", "1.2.3.4");
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("mengembalikan error jika Cloudflare menolak token", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", "dummy-secret-key");

    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyTurnstile("invalid-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-input-response");
  });
});
