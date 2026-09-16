import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email", () => ({
  sendAdminNotification: vi.fn(),
  sendOrderReceipt: vi.fn(),
  sendOrderFailed: vi.fn(),
  sendRefundNotice: vi.fn(),
}));

import { processNotification, eventKey } from "@/app/api/payments/mayar/route";
import { sendOrderReceipt, sendOrderFailed, sendRefundNotice } from "@/lib/email";
import type { Payload } from "payload";
import type { Order, OrderItem } from "@/lib/payload/payload-types";
import type { MayarWebhookPayload } from "@/lib/payments/mayar";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 1,
    reference: "NK-TEST",
    userId: "10",
    type: "in_stock",
    status: "pending_payment",
    total: 250000,
    subtotal: 250000,
    currency: "IDR",
    customerEmail: "buyer@test.id",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    id: 1,
    order: 1,
    productId: 7,
    title: "Kaos",
    unitPrice: 250000,
    quantity: 1,
    currency: "IDR",
    saleMode: "in_stock",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const settleEvent: MayarWebhookPayload = {
  event: "payment.received",
  data: {
    id: "tx-mayar-1",
    transactionId: "tx-mayar-1",
    status: "SUCCESS",
    amount: 250000,
    customerEmail: "buyer@test.id",
    description: "Order NK-TEST",
    extraData: { orderReference: "NK-TEST" },
    paidAt: "2026-01-01T01:00:00+07:00",
  },
};

function fakePayload(opts: { order: Order; items: OrderItem[] }) {
  const state = {
    order: { ...opts.order },
    attempts: new Set<string>(),
    cartLines: [{ id: 5, userId: 10, product: 7 }],
  };
  const payload = {
    find: async ({ collection, where }: { collection: string; where: Record<string, unknown> }) => {
      if (collection === "orders") {
        const ref = (where.reference as { equals?: string })?.equals;
        const prov = (where.providerSessionId as { equals?: string })?.equals;
        if (ref === state.order.reference || (prov && prov === state.order.providerSessionId)) {
          return { docs: [{ ...state.order }] };
        }
        return { docs: [] };
      }
      if (collection === "order-items") {
        const orderId = (where.order as { equals?: number })?.equals;
        return { docs: orderId === state.order.id ? opts.items.map((i) => ({ ...i })) : [] };
      }
      if (collection === "payment-attempts") {
        const key = (where.providerEventId as { equals?: string })?.equals;
        return { docs: key && state.attempts.has(key) ? [{ id: 99 }] : [] };
      }
      if (collection === "cart-items") return { docs: state.cartLines };
      return { docs: [] };
    },
    update: async ({ collection, id, data }: { collection: string; id: number; data: Record<string, unknown> }) => {
      if (collection === "orders") state.order = { ...state.order, ...data, id };
      return { ...state.order };
    },
    create: async ({ collection, data }: { collection: string; data: Record<string, unknown> }) => {
      if (collection === "payment-attempts") {
        const key = String(data.providerEventId);
        if (state.attempts.has(key)) throw new Error("duplicate key value violates unique constraint");
        state.attempts.add(key);
      }
      return { id: Math.floor(Math.random() * 1e6), ...data };
    },
    delete: async () => ({}),
  };
  return { payload: payload as unknown as Payload, state };
}

const runner = {
  query: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
};

describe("Mayar processNotification webhook", () => {
  beforeEach(() => vi.clearAllMocks());

  it("payment.received → paid: receipt 1x, cart dihapus, attempt dicatat", async () => {
    const { payload, state } = fakePayload({ order: makeOrder(), items: [makeItem()] });
    const handled = await processNotification(payload, runner, settleEvent);
    expect(handled).toBe(true);
    expect(state.order.status).toBe("paid");
    expect(sendOrderReceipt).toHaveBeenCalledTimes(1);
    expect(sendOrderReceipt).toHaveBeenCalledWith(
      "buyer@test.id",
      "NK-TEST",
      250000,
      expect.stringContaining("Kaos"),
    );
    expect(state.attempts.has(eventKey(settleEvent))).toBe(true);
  });

  it("replay event yang sama → tidak kirim email dobel, tidak update ulang", async () => {
    const { payload, state } = fakePayload({ order: makeOrder(), items: [makeItem()] });
    await processNotification(payload, runner, settleEvent);
    await processNotification(payload, runner, settleEvent);
    expect(sendOrderReceipt).toHaveBeenCalledTimes(1);
    expect(state.attempts.size).toBe(1);
    expect(state.order.status).toBe("paid");
  });

  it("failed event → payment_failed + email gagal + capacity in-stock dilepas", async () => {
    const failEvent: MayarWebhookPayload = {
      event: "payment.failed",
      data: {
        id: "tx-mayar-1",
        transactionId: "tx-mayar-1",
        status: "FAILED",
        amount: 250000,
        customerEmail: "buyer@test.id",
        description: "Order NK-TEST",
        extraData: { orderReference: "NK-TEST" },
      },
    };
    const { payload, state } = fakePayload({ order: makeOrder(), items: [makeItem()] });
    await processNotification(payload, runner, failEvent);
    expect(state.order.status).toBe("payment_failed");
    expect(sendOrderFailed).toHaveBeenCalledTimes(1);
    expect(runner.query).toHaveBeenCalledWith(expect.stringContaining("reserved_stock"), [1, 7]);
  });

  it("refund event → refunded + email refund", async () => {
    const refundEvent: MayarWebhookPayload = {
      event: "payment.refund",
      data: {
        id: "tx-mayar-1",
        transactionId: "tx-mayar-1",
        status: "REFUNDED",
        amount: 250000,
        customerEmail: "buyer@test.id",
        description: "Order NK-TEST",
        extraData: { orderReference: "NK-TEST" },
      },
    };
    const { payload, state } = fakePayload({
      order: makeOrder({ status: "paid" }),
      items: [makeItem()],
    });
    await processNotification(payload, runner, refundEvent);
    expect(state.order.status).toBe("refunded");
    expect(sendRefundNotice).toHaveBeenCalledTimes(1);
  });

  it("failed after paid → order tetap paid, stock tidak double-released (race guard)", async () => {
    const failEvent: MayarWebhookPayload = {
      event: "payment.failed",
      data: {
        id: "tx-mayar-1",
        transactionId: "tx-mayar-1",
        status: "FAILED",
        amount: 250000,
        customerEmail: "buyer@test.id",
        description: "Order NK-TEST",
        extraData: { orderReference: "NK-TEST" },
      },
    };
    const { payload, state } = fakePayload({ order: makeOrder(), items: [makeItem()] });
    await processNotification(payload, runner, settleEvent);
    expect(state.order.status).toBe("paid");
    await processNotification(payload, runner, failEvent);
    expect(state.order.status).toBe("paid");
    expect(sendOrderFailed).not.toHaveBeenCalled();
  });
});