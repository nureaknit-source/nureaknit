import { describe, it, expect } from "vitest";
import {
  claimPreOrderCapacity,
  releasePreOrderCapacity,
  type SqlRunner,
} from "@/lib/commerce/reservation";

// Meniru loop claim di approveOrderAction: claim beberapa produk, satu gagal
// → semua claim sebelumnya di-release, committed kembali ke awal.
function makeFakeDb(products: Record<number, { capacity: number | null; committed: number }>): SqlRunner & { db: typeof products } {
  const db = products;
  const runner: SqlRunner = {
    async query(text, values) {
      const [qty, id] = [values?.[0], values?.[1]] as [number, number];
      const p = db[id];
      if (!p) return { rows: [], rowCount: 0 };
      if (text.includes("pre_order_committed = pre_order_committed +")) {
        const cap = p.capacity ?? null;
        if (cap === null || p.committed + qty <= cap) {
          p.committed += qty;
          return { rows: [{ id }], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }
      if (text.includes("pre_order_committed -")) {
        p.committed = Math.max(0, p.committed - qty);
        return { rows: [{ id }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    },
  };
  return Object.assign(runner, { db });
}

describe("approve pre-order (kapasitas atomik)", () => {
  it("claim semua line sukses saat kapasitas cukup", async () => {
    const fake = makeFakeDb({
      1: { capacity: 10, committed: 0 },
      2: { capacity: 5, committed: 0 },
    });
    const ok1 = await claimPreOrderCapacity(fake, 1, 3);
    const ok2 = await claimPreOrderCapacity(fake, 2, 2);
    expect(ok1).toBe(true);
    expect(ok2).toBe(true);
    expect(fake.db[1].committed).toBe(3);
    expect(fake.db[2].committed).toBe(2);
  });

  it("line kedua gagal → line pertama di-release, committed kembali ke awal", async () => {
    const fake = makeFakeDb({
      1: { capacity: 10, committed: 5 },
      2: { capacity: 10, committed: 9 }, // sisa 1 < qty 2 → claim ke-2 gagal
    });
    const claimed: { productId: number; quantity: number }[] = [];
    let failed = false;
    for (const line of [
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 2 },
    ]) {
      if (!(await claimPreOrderCapacity(fake, line.productId, line.quantity))) {
        failed = true;
        for (const c of claimed) await releasePreOrderCapacity(fake, c.productId, c.quantity);
        break;
      }
      claimed.push(line);
    }
    expect(failed).toBe(true);
    expect(fake.db[1].committed).toBe(5); // kembali ke awal
    expect(fake.db[2].committed).toBe(9); // tidak berubah
  });

  it("release setelah approve tetap mengembalikan kapasitas (dibatalkan setelah approved)", async () => {
    const fake = makeFakeDb({ 1: { capacity: 10, committed: 3 } });
    await claimPreOrderCapacity(fake, 1, 2);
    await releasePreOrderCapacity(fake, 1, 2);
    expect(fake.db[1].committed).toBe(3);
  });
});