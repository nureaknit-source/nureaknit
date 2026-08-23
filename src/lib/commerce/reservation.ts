import { sql, type SQLChunk } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export interface SqlRunner {
  query(text: string, values?: unknown[]): Promise<{
    rows: unknown[];
    rowCount?: number | null;
  }>;
}

// Real adapter: payload.db adalah drizzle NodePgDatabase.
// Konversi SQL ber-parameter $n -> SQL object drizzle (param binding aman).
export function createPgRunner(db: NodePgDatabase): SqlRunner {
  return {
    async query(text, values = []) {
      return db.execute(toDrizzleSql(text, values));
    },
  };
}

function toDrizzleSql(text: string, values: unknown[]) {
  const chunks: SQLChunk[] = [];
  let last = 0;
  for (const match of text.matchAll(/\$\d+/g)) {
    chunks.push(sql.raw(text.slice(last, match.index)));
    chunks.push(values[Number(match[0].slice(1)) - 1] as SQLChunk);
    last = match.index + match[0].length;
  }
  chunks.push(sql.raw(text.slice(last)));
  return sql.join(chunks, sql.raw(""));
}

// In-stock: reserve saat checkout, commit setelah payment verified, release saat batal/expired.
// Satu statement UPDATE = atomik; tidak mungkin oversell saat dua request bersamaan.

export async function claimInStock(run: SqlRunner, productId: number, qty: number): Promise<boolean> {
  const res = await run.query(
    `UPDATE products
     SET reserved_stock = reserved_stock + $1
     WHERE id = $2 AND stock - reserved_stock >= $1
     RETURNING id`,
    [qty, productId],
  );
  return (res.rowCount ?? 0) > 0;
}

export async function commitInStock(run: SqlRunner, productId: number, qty: number): Promise<void> {
  await run.query(
    `UPDATE products
     SET stock = stock - $1, reserved_stock = GREATEST(0, reserved_stock - $1)
     WHERE id = $2 AND reserved_stock >= $1`,
    [qty, productId],
  );
}

export async function releaseInStock(run: SqlRunner, productId: number, qty: number): Promise<void> {
  await run.query(
    `UPDATE products SET reserved_stock = GREATEST(0, reserved_stock - $1) WHERE id = $2`,
    [qty, productId],
  );
}

// Pre-order capacity: terhitung saat approval. Kondisi kapasitas dicek atomik.
export async function claimPreOrderCapacity(
  run: SqlRunner,
  productId: number,
  qty: number,
): Promise<boolean> {
  const res = await run.query(
    `UPDATE products
     SET pre_order_committed = pre_order_committed + $1
     WHERE id = $2
       AND (pre_order_capacity IS NULL OR pre_order_committed + $1 <= pre_order_capacity)
     RETURNING id`,
    [qty, productId],
  );
  return (res.rowCount ?? 0) > 0;
}

export async function releasePreOrderCapacity(
  run: SqlRunner,
  productId: number,
  qty: number,
): Promise<void> {
  await run.query(
    `UPDATE products
     SET pre_order_committed = GREATEST(0, pre_order_committed - $1)
     WHERE id = $2`,
    [qty, productId],
  );
}