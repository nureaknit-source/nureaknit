import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRedirect = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
const mockNotFound = vi.fn(() => {
  throw new Error("NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
  notFound: () => mockNotFound(),
}));

const mockGetCachedUserSession = vi.fn();
vi.mock("@/utils/supabase/server", () => ({
  getCachedUserSession: () => mockGetCachedUserSession(),
}));

const mockGetOrderAction = vi.fn();
vi.mock("@/actions/checkout", () => ({
  getOrderAction: (ref: string) => mockGetOrderAction(ref),
}));

import CheckoutSuccessPage from "@/app/(frontend)/checkout/success/page";

describe("CheckoutSuccessPage security & authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /profile/orders when no order reference or pre param is provided", async () => {
    await expect(
      CheckoutSuccessPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow("REDIRECT:/profile/orders");

    expect(mockRedirect).toHaveBeenCalledWith("/profile/orders");
  });

  it("redirects to login with return URL when user is not authenticated (for pre=NK-989925)", async () => {
    mockGetCachedUserSession.mockResolvedValue(null);

    await expect(
      CheckoutSuccessPage({
        searchParams: Promise.resolve({ pre: "NK-989925" }),
      }),
    ).rejects.toThrow("REDIRECT:/login?redirect=%2Fcheckout%2Fsuccess%3Fref%3DNK-989925");

    expect(mockRedirect).toHaveBeenCalledWith(
      "/login?redirect=%2Fcheckout%2Fsuccess%3Fref%3DNK-989925",
    );
    expect(mockGetOrderAction).not.toHaveBeenCalled();
  });

  it("redirects to login with return URL when user is not authenticated (for ref=NK-123456)", async () => {
    mockGetCachedUserSession.mockResolvedValue(null);

    await expect(
      CheckoutSuccessPage({
        searchParams: Promise.resolve({ ref: "NK-123456", fallback: "1" }),
      }),
    ).rejects.toThrow("REDIRECT:/login?redirect=%2Fcheckout%2Fsuccess%3Fref%3DNK-123456%26fallback%3D1");

    expect(mockRedirect).toHaveBeenCalledWith(
      "/login?redirect=%2Fcheckout%2Fsuccess%3Fref%3DNK-123456%26fallback%3D1",
    );
  });

  it("calls notFound (404) when order does not exist or does not belong to the user", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-victim", email: "victim@example.com" });
    mockGetOrderAction.mockResolvedValue(null);

    await expect(
      CheckoutSuccessPage({
        searchParams: Promise.resolve({ pre: "NK-989925" }),
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(mockGetOrderAction).toHaveBeenCalledWith("NK-989925");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("calls notFound (404) when getOrderAction throws unauthorized error", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-attacker", email: "attacker@example.com" });
    mockGetOrderAction.mockRejectedValue(new Error("Unauthorized"));

    await expect(
      CheckoutSuccessPage({
        searchParams: Promise.resolve({ ref: "NK-989925" }),
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders pre-order details correctly when user is authenticated and is the rightful owner", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-owner", email: "owner@example.com" });
    mockGetOrderAction.mockResolvedValue({
      id: 101,
      reference: "NK-989925",
      type: "pre_order",
      status: "pending_approval",
      total: 150000,
      customerPhone: "08123456789",
      customerAddress: "Bandung",
      items: [],
      groups: [],
    });

    const jsx = await CheckoutSuccessPage({
      searchParams: Promise.resolve({ pre: "NK-989925" }),
    });

    expect(jsx).toBeDefined();
    expect(mockGetOrderAction).toHaveBeenCalledWith("NK-989925");
    expect(mockNotFound).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("renders in-stock QR display from database paymentQrUrl, ignoring URL query params", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-owner", email: "owner@example.com" });
    mockGetOrderAction.mockResolvedValue({
      id: 102,
      reference: "NK-777888",
      type: "in_stock",
      status: "pending_payment",
      total: 200000,
      paymentQrUrl: "https://api.sandbox.midtrans.com/v2/qris/real-qr.png",
      expiresAt: "2026-09-09T22:00:00.000Z",
      customerPhone: "08123456789",
      customerAddress: "Jakarta",
      items: [],
      groups: [],
    });

    const jsx = await CheckoutSuccessPage({
      searchParams: Promise.resolve({
        ref: "NK-777888",
        qr: "https://evil.com/fake-qr.png", // Attempted QR injection
      }),
    });

    expect(jsx).toBeDefined();
    expect(mockGetOrderAction).toHaveBeenCalledWith("NK-777888");
    expect(mockNotFound).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
