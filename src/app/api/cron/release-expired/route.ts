import { getPayload } from "payload";
import config from "@payload-config";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { createPgRunner, releaseInStock, releasePreOrderCapacity } from "@/lib/commerce/reservation";
import type { Order, OrderItem } from "@/lib/payload/payload-types";

export const runtime = "nodejs";

// Dipanggil Vercel Cron (guard header). Melepas reservasi order pending_payment yang
// sudah lewat expiresAt → status cancelled, stok & capacity dikembalikan.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.PAYLOAD_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  if (!payload.db?.drizzle) return Response.json({ error: "database not ready" }, { status: 500 });
  const runner = createPgRunner(payload.db.drizzle as unknown as NodePgDatabase);
  const now = new Date().toISOString();

  const expired = await payload.find({
    collection: "orders",
    where: { status: { equals: "pending_payment" }, expiresAt: { less_than: now } },
    limit: 100,
  });

  let processed = 0;
  for (const doc of expired.docs) {
    const order = doc as Order;

    // Atomic flip: hanya pending_payment → cancelled. Jika settlement webhook
    // sudah bayar (atau cron lain) di antara read-update, UPDATE tidak match.
    const cancelRes = await runner.query(
      `UPDATE orders SET status = $1, reason = $2 WHERE id = $3 AND status = 'pending_payment' RETURNING id`,
      ["cancelled", "Reservation expired (cron)", order.id],
    );
    if ((cancelRes.rowCount ?? 0) === 0) continue; // sudah dibayar / dibatalkan oleh sesuatu
    processed++;

    const items = (
      await payload.find({
        collection: "order-items",
        where: { order: { equals: order.id } },
        limit: 500,
      })
    ).docs as OrderItem[];

    for (const item of items) {
      if (item.saleMode === "pre_order") {
        await releasePreOrderCapacity(runner, item.productId, item.quantity);
      } else {
        await releaseInStock(runner, item.productId, item.quantity);
      }
    }
  }

  return Response.json({ ok: true, processed });
}