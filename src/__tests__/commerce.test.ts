import { describe, it, expect } from "vitest";
import { calcTotals, formatIDR } from "@/lib/commerce/money";
import {
  isPurchasable,
  inStockAvailable,
  preOrderOpen,
  preOrderCapacityAvailable,
  withinPerCustomerLimit,
} from "@/lib/commerce/availability";
import { canTransition, assertTransition } from "@/lib/commerce/state-machine";
import { generateReference, generateIdempotencyKey } from "@/lib/commerce/reference";
import {
  claimInStock,
  commitInStock,
  releaseInStock,
  claimPreOrderCapacity,
  releasePreOrderCapacity,
  createPgRunner,
  type SqlRunner,
} from "@/lib/commerce/reservation";

describe("money", () => {
  it("menghitung subtotal dan total dari snapshot", () => {
    const { subtotal, total } = calcTotals({
      items: [
        { unitPrice: 100000, quantity: 2 },
        { unitPrice: 50000, quantity: 1 },
      ],
      shippingTotal: 25000,
    });
    expect(subtotal).toBe(250000);
    expect(total).toBe(275000);
  });

  it("taxTotal dijumlahkan ke total", () => {
    const { total } = calcTotals({ items: [{ unitPrice: 100000, quantity: 1 }], taxTotal: 11000 });
    expect(total).toBe(111000);
  });

  it("formatIDR memakai format rupiah tanpa desimal", () => {
    expect(formatIDR(150000)).toMatch(/^Rp\u00A0150\.000$/);
  });
});

describe("availability", () => {
  it("isPurchasable menolak unavailable", () => {
    expect(isPurchasable({ availability: "in_stock" })).toBe(true);
    expect(isPurchasable({ availability: "pre_order" })).toBe(true);
    expect(isPurchasable({ availability: "dropship" })).toBe(true);
    expect(isPurchasable({ availability: "unavailable" })).toBe(false);
  });

  it("inStockAvailable memperhitungkan reserved stock", () => {
    expect(inStockAvailable({ availability: "in_stock", stock: 10, reservedStock: 0 }, 10)).toBe(true);
    expect(inStockAvailable({ availability: "in_stock", stock: 10, reservedStock: 3 }, 10)).toBe(false);
    expect(inStockAvailable({ availability: "in_stock", stock: 10, reservedStock: 10 })).toBe(false);
    expect(inStockAvailable({ availability: "dropship", stock: 10 })).toBe(false);
  });

  it("preOrderOpen menghormati cutoff", () => {
    const now = new Date("2026-08-16T00:00:00Z");
    const future = new Date("2026-09-01T00:00:00Z");
    const past = new Date("2026-01-01T00:00:00Z");
    expect(preOrderOpen({ availability: "pre_order", preOrderCutoff: future.toISOString() }, now)).toBe(true);
    expect(preOrderOpen({ availability: "pre_order", preOrderCutoff: past.toISOString() }, now)).toBe(false);
    expect(preOrderOpen({ availability: "pre_order", preOrderCutoff: null }, now)).toBe(true);
    expect(preOrderOpen({ availability: "in_stock", preOrderCutoff: future.toISOString() }, now)).toBe(false);
  });

  it("preOrderCapacityAvailable menolak saat capacity penuh", () => {
    expect(preOrderCapacityAvailable({ availability: "pre_order", preOrderCapacity: 10 }, 8, 2)).toBe(true);
    expect(preOrderCapacityAvailable({ availability: "pre_order", preOrderCapacity: 10 }, 9, 2)).toBe(false);
    expect(preOrderCapacityAvailable({ availability: "pre_order", preOrderCapacity: null }, 99, 2)).toBe(true);
  });

  it("withinPerCustomerLimit menegakkan limit per customer", () => {
    expect(withinPerCustomerLimit({ availability: "pre_order", perCustomerLimit: 3 }, 1, 2)).toBe(true);
    expect(withinPerCustomerLimit({ availability: "pre_order", perCustomerLimit: 3 }, 2, 2)).toBe(false);
    expect(withinPerCustomerLimit({ availability: "pre_order", perCustomerLimit: null }, 5, 5)).toBe(true);
  });
});

describe("state-machine", () => {
  it("menerima transisi sah untuk alur pre-order", () => {
    expect(canTransition("pending_approval", "approved")).toBe(true);
    expect(canTransition("approved", "pending_payment")).toBe(true);
    expect(canTransition("pending_payment", "paid")).toBe(true);
    expect(canTransition("paid", "fulfilling")).toBe(true);
    expect(canTransition("fulfilling", "fulfilled")).toBe(true);
  });

  it("menolak transisi ilegal (rollback / lompat status)", () => {
    expect(canTransition("paid", "pending_payment")).toBe(false);
    expect(canTransition("pending_payment", "pending_approval")).toBe(false);
    expect(canTransition("cancelled", "paid")).toBe(false);
    expect(canTransition("fulfilled", "fulfilling")).toBe(false);
  });

  it("menerima alur in-stock langsung pending_payment", () => {
    expect(canTransition("pending_payment", "payment_failed")).toBe(true);
    expect(canTransition("payment_failed", "pending_payment")).toBe(true);
    expect(canTransition("pending_payment", "cancelled")).toBe(true);
  });

  it("assertTransition melempar pada transisi ilegal", () => {
    expect(() => assertTransition("paid", "pending_payment", "dummy")).toThrow(/tidak sah/);
  });
});

describe("reference", () => {
  it("generateReference berbentuk NK-XXXXXX", () => {
    expect(generateReference()).toMatch(/^NK-\d{6}$/);
  });

  it("generateIdempotencyKey unik & mengandung order id", () => {
    const a = generateIdempotencyKey(42);
    const b = generateIdempotencyKey(42);
    expect(a.startsWith("order-42-")).toBe(true);
    expect(a).not.toBe(b);
  });
});

// Simulator SQL in-memory untuk 4 statement reservation. Meniru semantik WHERE
// yang sama dengan query asli sehingga interaksi claim/commit/release teruji.
function makeFakeDb(products: Record<number, { stock: number; reserved: number; capacity?: number | null; committed: number }>): SqlRunner & { db: typeof products } {
  const db = products;
  const runner: SqlRunner = {
    async query(text, values) {
      const [qty, id] = [values?.[0], values?.[1]] as [number, number];
      const p = db[id];
      if (!p) return { rows: [], rowCount: 0 };
      if (text.includes("stock - reserved_stock")) {
        if (p.stock - p.reserved >= qty) { p.reserved += qty; return { rows: [{ id }], rowCount: 1 }; }
        return { rows: [], rowCount: 0 };
      }
      if (text.includes("SET stock = stock -")) {
        if (p.reserved >= qty) { p.stock -= qty; p.reserved = Math.max(0, p.reserved - qty); return { rows: [{ id }], rowCount: 1 }; }
        return { rows: [], rowCount: 0 };
      }
      if (text.includes("GREATEST(0, reserved_stock -")) {
        p.reserved = Math.max(0, p.reserved - qty); return { rows: [{ id }], rowCount: 1 };
      }
      if (text.includes("pre_order_committed = pre_order_committed +")) {
        const cap = p.capacity ?? null;
        if (cap === null || p.committed + qty <= cap) { p.committed += qty; return { rows: [{ id }], rowCount: 1 }; }
        return { rows: [], rowCount: 0 };
      }
      if (text.includes("pre_order_committed -")) {
        p.committed = Math.max(0, p.committed - qty); return { rows: [{ id }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    },
  };
  return Object.assign(runner, { db });
}

describe("reservation (simulasi atomik)", () => {
  it("claim berurutan tidak bisa melebihi stok", async () => {
    const fake = makeFakeDb({ 1: { stock: 5, reserved: 0, committed: 0 } });
    expect(await claimInStock(fake, 1, 3)).toBe(true);
    expect(await claimInStock(fake, 1, 3)).toBe(false);
    expect(await claimInStock(fake, 1, 2)).toBe(true);
    expect(fake.db[1].reserved).toBe(5);
  });

  it("commit mengurangi stok dan melepas reserved", async () => {
    const fake = makeFakeDb({ 1: { stock: 5, reserved: 3, committed: 0 } });
    await commitInStock(fake, 1, 3);
    expect(fake.db[1].stock).toBe(2);
    expect(fake.db[1].reserved).toBe(0);
  });

  it("release mengembalikan reserved tanpa menyentuh stock", async () => {
    const fake = makeFakeDb({ 1: { stock: 5, reserved: 3, committed: 0 } });
    await releaseInStock(fake, 1, 3);
    expect(fake.db[1].reserved).toBe(0);
    expect(fake.db[1].stock).toBe(5);
  });

  it("claim capacity pre-order ditolak saat penuh", async () => {
    const fake = makeFakeDb({ 2: { stock: 0, reserved: 0, capacity: 10, committed: 8 } });
    expect(await claimPreOrderCapacity(fake, 2, 2)).toBe(true);
    expect(await claimPreOrderCapacity(fake, 2, 2)).toBe(false);
    expect(fake.db[2].committed).toBe(10);
  });

  it("capacity null (unlimited) selalu diterima", async () => {
    const fake = makeFakeDb({ 3: { stock: 0, reserved: 0, capacity: null, committed: 999 } });
    expect(await claimPreOrderCapacity(fake, 3, 5)).toBe(true);
  });

  it("release capacity pre-order mengembalikan kapasitas", async () => {
    const fake = makeFakeDb({ 2: { stock: 0, reserved: 0, capacity: 10, committed: 10 } });
    await releasePreOrderCapacity(fake, 2, 3);
    expect(fake.db[2].committed).toBe(7);
  });
});

describe("createPgRunner (binding parameter)", () => {
  const lastQuery: { sql: string; params: unknown[] } = { sql: "", params: [] };

  const fakeDb = {
    execute: async (sql: { toQuery: (config: unknown) => { sql: string; params: unknown[] } }) => {
      const q = sql.toQuery({
        casing: { param: (s: string) => s },
        escapeName: (n: string) => n,
        escapeParam: (num: number) => `$${num}`,
        escapeString: (s: string) => s,
      });
      lastQuery.sql = q.sql;
      lastQuery.params = q.params;
      return { rows: [], rowCount: q.sql.includes("RETURNING id") ? 1 : 0 };
    },
  } as unknown as Parameters<typeof createPgRunner>[0];

  it("memetakan parameter dengan urutan benar (tiap kemunculan di-bind sendiri)", async () => {
    const runner = createPgRunner(fakeDb);
    await claimInStock(runner, 7, 3);
    // $1 dipakai 2x (SET dan WHERE) → drizzle bind [qty, id, qty]
    expect(lastQuery.params).toEqual([3, 7, 3]);
    expect(lastQuery.sql).toContain("UPDATE products");
    expect(lastQuery.sql).toMatch(/stock - reserved_stock >= \$\d+/);
  });

  it("tidak menginterpolasi nilai ke dalam teks SQL", async () => {
    const runner = createPgRunner(fakeDb);
    await claimPreOrderCapacity(runner, 42, 5);
    expect(lastQuery.sql).not.toContain("42");
    expect(lastQuery.params).toEqual([5, 42, 5]);
  });
});