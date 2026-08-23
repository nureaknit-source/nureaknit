import { getPayload } from "payload";
import config from "@payload-config";
import type { Payload } from "payload";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  verifyMidtransSignature,
  type MidtransNotification,
} from "@/lib/payments/midtrans";
import {
  createPgRunner,
  commitInStock,
  releaseInStock,
  releasePreOrderCapacity,
  type SqlRunner,
} from "@/lib/commerce/reservation";
import { canTransition } from "@/lib/commerce/state-machine";
import { formatIDR } from "@/lib/commerce/money";
import {
  sendAdminNotification,
  sendOrderReceipt,
  sendOrderFailed,
  sendRefundNotice,
} from "@/lib/email";
import type { Order, OrderItem } from "@/lib/payload/payload-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  let body: MidtransNotification;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey || !verifyMidtransSignature(serverKey, body)) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const db = payload.db?.drizzle;
  if (!db) return Response.json({ error: "database not ready" }, { status: 500 });
  const runner = createPgRunner(db as unknown as NodePgDatabase);

  try {
    const handled = await processNotification(payload, runner, body);
    if (!handled) return Response.json({ error: "order not found" }, { status: 400 });
    return Response.json({ ok: true });
  } catch (e) {
    // 500 agar Midtrans mengulang; semua mutasi bersifat idempotent (guard status + unique).
    console.error("[midtrans-webhook]", e);
    return Response.json({ error: "internal" }, { status: 500 });
  }
}

// Event key unik per (transaksi, status, status_code) → replay aman via unique providerEventId.
export function eventKey(body: MidtransNotification): string {
  return `${body.transaction_id ?? body.order_id}:${body.transaction_status}:${body.status_code}`;
}

export async function processNotification(
  payload: Payload,
  runner: SqlRunner,
  body: MidtransNotification,
): Promise<boolean> {
  const reference = body.order_id;
  if (!reference) return false;

  const found = await payload.find({
    collection: "orders",
    where: { reference: { equals: reference } },
    limit: 1,
  });
  const order = found.docs[0] as Order | undefined;
  if (!order) return false;

  const key = eventKey(body);
  const existing = await payload.find({
    collection: "payment-attempts",
    where: { providerEventId: { equals: key } },
    limit: 1,
  });
  if (existing.docs.length > 0) return true; // replay

  const items = (
    await payload.find({
      collection: "order-items",
      where: { order: { equals: order.id } },
      limit: 500,
    })
  ).docs as OrderItem[];

  const status = body.transaction_status;
  const fraud = body.fraud_status;
  const reason = `webhook ${status}${fraud ? `/${fraud}` : ""} (${key})`;

  if (status === "capture" || (status === "settlement" && fraud === "accept")) {
    await handleSettlement(payload, runner, order, items, reason);
  } else if (status === "deny" || status === "cancel" || status === "expire") {
    // Jangan kirim notifikasi gagal bila order sudah dibayar (late expire). Only act on payment-active orders.
    if (canTransition(order.status as Order["status"], "payment_failed")) {
      await handleFailure(payload, runner, order, items, reason);
      await sendAdminNotification(`[Payment ${status}] ${order.reference}`, reason);
      if (order.customerEmail) await sendOrderFailed(order.customerEmail, order.reference, status);
    }
  } else if (status === "refund" || status === "partial_refund") {
    await transitionOrder(payload, order, "refunded", reason);
    if (order.customerEmail) await sendRefundNotice(order.customerEmail, order.reference, status);
  } else if (status === "chargeback") {
    await transitionOrder(payload, order, "disputed", reason);
    if (order.customerEmail) await sendRefundNotice(order.customerEmail, order.reference, status);
  }
  // status lain (pending, challenge, dll): hanya dicatat sebagai PaymentAttempt.

  // Rekaman terakhir: jika unique violation, berarti event sama diproses bersamaan → abaikan.
  try {
    await payload.create({
      collection: "payment-attempts",
      data: {
        order: order.id,
        providerEventId: key,
        eventType: status,
        status: fraud ? `${status}:${fraud}` : status,
        amount: body.gross_amount ? Number(body.gross_amount) : undefined,
        raw: body as unknown as Record<string, unknown>,
        occurredAt: body.transaction_time ? new Date(body.transaction_time).toISOString() : undefined,
      },
    });
  } catch (e) {
    if (!(e instanceof Error) || !/duplicate key/i.test(e.message)) throw e;
  }

  return true;
}

async function handleSettlement(
  payload: Payload,
  runner: SqlRunner,
  order: Order,
  items: OrderItem[],
  reason: string,
) {
  if (order.status === "paid") return; // idempotent (replay)
  // Expire lalu settle (mis. transfer bank telat): buka kembali order yang payment_failed.
  if (order.status === "payment_failed") {
    await payload.update({
      collection: "orders",
      id: order.id,
      data: { status: "pending_payment" },
    });
  }
  // Jangan revive order yang sudah cancelled/expired/refunded/disputed karena cron.
  if (!canTransition(order.status as Order["status"], "paid")) return;

  for (const item of items) {
    if (item.saleMode === "in_stock") {
      await commitInStock(runner, item.productId, item.quantity);
    }
    // pre_order: capacity sudah tercommit saat approval — tidak berubah di sini.
  }

  const group = await payload.create({
    collection: "fulfillment-groups",
    data: {
      order: order.id,
      kind: order.type === "pre_order" ? "release" : "ship",
      status: "unfulfilled",
      estimate: items[0]?.promisedEstimate ?? undefined,
      items: items.map((i) => i.id),
    },
  });

  await payload.update({
    collection: "orders",
    id: order.id,
    data: { status: "paid", paidAt: new Date().toISOString(), reason },
  });

  // Cart: hapus hanya baris produk yang sudah dibeli (mixed cart tetap menyisakan lainnya).
  const purchased = await payload.find({
    collection: "cart-items",
    where: { userId: { equals: order.userId }, product: { in: items.map((i) => i.productId) } },
    limit: 500,
  });
  for (const line of purchased.docs) {
    await payload.delete({ collection: "cart-items", id: line.id });
  }

  if (order.customerEmail) {
    const lines = items.map((i) => `- ${i.quantity}x ${i.title} (${formatIDR(i.unitPrice * i.quantity)})`).join("\n");
    await sendOrderReceipt(order.customerEmail, order.reference, order.total, lines);
  }

  console.log(`[midtrans] order ${order.reference} paid (group ${group.id})`);
}

async function handleFailure(
  payload: Payload,
  runner: SqlRunner,
  order: Order,
  items: OrderItem[],
  reason: string,
) {
  if (order.status !== "pending_payment") return; // sudah diproses/berubah → lewati

  for (const item of items) {
    if (item.saleMode === "in_stock") {
      await releaseInStock(runner, item.productId, item.quantity);
    } else {
      await releasePreOrderCapacity(runner, item.productId, item.quantity);
    }
  }

  await payload.update({
    collection: "orders",
    id: order.id,
    data: { status: "payment_failed", reason },
  });
}

async function transitionOrder(
  payload: Payload,
  order: Order,
  next: Order["status"],
  reason: string,
) {
  if (order.status === next) return;
  if (!canTransition(order.status as Order["status"], next)) return;
  await payload.update({
    collection: "orders",
    id: order.id,
    data: { status: next, reason },
  });
}