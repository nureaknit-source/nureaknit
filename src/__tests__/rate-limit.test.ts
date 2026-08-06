import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, rateLimitKey, getClientIp } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset store is not exported, but since checkRateLimit uses module-level Map,
    // tests with unique keys won't collide
  });

  it("allows first request within limit", () => {
    expect(checkRateLimit("test:first", 5, 60000)).toBe(true);
  });

  it("allows up to max requests", () => {
    const key = `test:max:${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, 60000)).toBe(true);
    }
  });

  it("blocks requests exceeding limit", () => {
    const key = `test:block:${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60000);
    }
    expect(checkRateLimit(key, 5, 60000)).toBe(false);
  });

  it("rateLimitKey formats correctly", () => {
    expect(rateLimitKey("1.2.3.4", "contact")).toBe("1.2.3.4:contact");
  });

  it("getClientIp extracts x-forwarded-for first IP", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "1.2.3.4, 5.6.7.8");
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("getClientIp falls back to x-real-ip", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "9.8.7.6");
    expect(getClientIp(headers)).toBe("9.8.7.6");
  });

  it("getClientIp returns unknown when no IP headers", () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe("unknown");
  });
});
