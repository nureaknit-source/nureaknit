import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCachedUserSession = vi.fn();
vi.mock("@/utils/supabase/server", () => ({
  getCachedUserSession: () => mockGetCachedUserSession(),
}));

const mockFind = vi.fn();
vi.mock("payload", () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: (...args: unknown[]) => mockFind(...args),
  }),
}));

vi.mock("@payload-config", () => ({
  default: {},
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

import { getCartProductIdsAction, getCartItemCountAction } from "@/actions/cart";

describe("cart actions authentication resilience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCartProductIdsAction returns empty array when unauthenticated without throwing", async () => {
    mockGetCachedUserSession.mockResolvedValue(null);
    const productIds = await getCartProductIdsAction();
    expect(productIds).toEqual([]);
    expect(mockFind).not.toHaveBeenCalled();
  });

  it("getCartProductIdsAction returns empty array when user session has no id", async () => {
    mockGetCachedUserSession.mockResolvedValue({});
    const productIds = await getCartProductIdsAction();
    expect(productIds).toEqual([]);
    expect(mockFind).not.toHaveBeenCalled();
  });

  it("getCartProductIdsAction returns product IDs when user is authenticated", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-123", email: "test@example.com" });
    mockFind.mockResolvedValue({
      docs: [
        { product: 10, quantity: 2 },
        { product: { id: 20 }, quantity: 1 },
      ],
    });

    const productIds = await getCartProductIdsAction();
    expect(productIds).toEqual([10, 20]);
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "cart-items",
        depth: 0,
        where: { userId: { equals: "user-123" } },
      }),
    );
  });

  it("getCartItemCountAction returns 0 when unauthenticated without throwing", async () => {
    mockGetCachedUserSession.mockResolvedValue(null);
    const count = await getCartItemCountAction();
    expect(count).toBe(0);
    expect(mockFind).not.toHaveBeenCalled();
  });

  it("getCartItemCountAction returns total quantity sum when user is authenticated", async () => {
    mockGetCachedUserSession.mockResolvedValue({ id: "user-456", email: "test@example.com" });
    mockFind.mockResolvedValue({
      docs: [
        { product: 1, quantity: 3 },
        { product: 2, quantity: 4 },
      ],
    });

    const count = await getCartItemCountAction();
    expect(count).toBe(7);
  });
});
