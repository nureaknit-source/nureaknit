import { getPayload } from "payload";
import config from "@payload-config";
import type { Payload } from "payload";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  verifyMayarWebhookToken,
  type MayarWebhookPayload,
} from "@/lib/payments/mayar";
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
import { after } from "next/server";

export const runtime = "nodejs";

async function runBackground(fn: () => Promise<void> | void): Promise<void> {
  try {
    after(fn);
  } catch {
    await fn();
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!verifyMayarWebhookToken(token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const raw = await request.text();
  let body: MayarWebhookPayload;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
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
    // 500 agar Mayar melakukan retry; semua mutasi bersifat idempotent
    console.error("[mayar-webhook]", e);
    return Response.json({ error: "internal" }, { status: 500 });
  }
}

// Event key unik per (id/transactionId, event, status) untuk menjamin replay aman
export function eventKey(body: MayarWebhookPayload): string {
  const id = body.data?.id || body.data?.transactionId || "unknown";
  const event = body.event || "event";
  const status = body.data?.status || body.data?.transactionStatus || "received";
  return `mayar:${id}:${event}:${status}`;
}

export async function findTargetOrder(payload: Payload, body: MayarWebhookPayload): Promise<Order | null> {
  const data = body.data;
  if (!data) return null;

  // 1. Cek explicit orderReference di extraData
  const refFromExtra = data.extraData?.orderReference as string | undefined;
  if (refFromExtra) {
    const found = await payload.find({
      collection: "orders",
      where: { reference: { equals: refFromExtra } },
      limit: 1,
    });
    if (found.docs[0]) return found.docs[0] as Order;
  }

  // 2. Cek parsing reference dari description (format "Order NK-XXXX" atau "NK-XXXX")
  if (data.description) {
    const match = data.description.match(/NK-[A-Z0-9]+/i);
    if (match) {
      const found = await payload.find({
        collection: "orders",
        where: { reference: { equals: match[0].toUpperCase() } },
        limit: 1,
      });
      if (found.docs[0]) return found.docs[0] as Order;
    }
  }

  // 3. Cek providerSessionId matching data.id atau data.transactionId
  const candidateIds = [data.id, data.transactionId].filter(Boolean) as string[];
  for (const cid of candidateIds) {
    const found = await payload.find({
      collection: "orders",
      where: { providerSessionId: { equals: cid } },
      limit: 1,
    });
    if (found.docs[0]) return found.docs[0] as Order;
  }

  // 4. Fallback matching langsung reference ke candidateIds
  for (const cid of candidateIds) {
    const found = await payload.find({
      collection: "orders",
      where: { reference: { equals: cid } },
      limit: 1,
    });
    if (found.docs[0]) return found.docs[0] as Order;
  }

  return null;
}

export async function processNotification(
  payload: Payload,
  runner: SqlRunner,
  body: MayarWebhookPayload,
): Promise<boolean> {
  const order = await findTargetOrder(payload, body);
  if (!order) return false;

  const key = eventKey(body);
  const existing = await payload.find({
    collection: "payment-attempts",
    where: { providerEventId: { equals: key } },
    limit: 1,
  });
  if (existing.docs.length > 0) return true; // Replay / duplicate

  const items = (
    await payload.find({
      collection: "order-items",
      where: { order: { equals: order.id } },
      limit: 500,
    })
  ).docs as OrderItem[];

  const eventName = body.event || "payment.received";
  const dataStatus = (body.data?.status || "SUCCESS").toUpperCase();
  const reason = `webhook ${eventName} [${dataStatus}] (${key})`;

  const isSuccess =
    eventName === "payment.received" ||
    dataStatus === "SUCCESS" ||
    dataStatus === "PAID" ||
    dataStatus === "SETTLEMENT";

  if (isSuccess) {
    await handleSettlement(payload, runner, order, items, reason);
  } else if (
    eventName === "payment.failed" ||
    eventName === "payment.expired" ||
    dataStatus === "FAILED" ||
    dataStatus === "EXPIRED" ||
    dataStatus === "CANCELLED"
  ) {
    if (canTransition(order.status as Order["status"], "payment_failed")) {
      await handleFailure(payload, runner, order, items, reason);
      const email = order.customerEmail;
      const ref = order.reference;
      await runBackground(async () => {
        try {
          await sendAdminNotification(`[Mayar Payment Failed] ${ref}`, reason);
          if (email) await sendOrderFailed(email, ref, dataStatus);
        } catch (err) {
          console.error("[mayar] background failure email failed:", err);
        }
      });
    }
  } else if (eventName === "payment.refund" || dataStatus === "REFUNDED") {
    await transitionOrder(payload, order, "refunded", reason);
    if (order.customerEmail) {
      const email = order.customerEmail;
      const ref = order.reference;
      await runBackground(async () => {
        try {
          await sendRefundNotice(email, ref, "refund");
        } catch (err) {
          console.error("[mayar] background refund notice failed:", err);
        }
      });
    }
  }

  // Rekam attempt untuk audit & pencegahan replay
  try {
    await payload.create({
      collection: "payment-attempts",
      data: {
        order: order.id,
        providerEventId: key,
        eventType: eventName,
        status: dataStatus,
        amount: body.data?.amount ? Number(body.data.amount) : undefined,
        raw: body as unknown as Record<string, unknown>,
        occurredAt: body.data?.paidAt
          ? new Date(body.data.paidAt).toISOString()
          : new Date().toISOString(),
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
  if (order.status === "paid") return; // Idempotent
  // Buka kembali order yang sempat payment_failed jika pembayaran akhirnya terverifikasi
  if (order.status === "payment_failed") {
    await payload.update({
      collection: "orders",
      id: order.id,
      data: { status: "pending_payment" },
    });
  }

  if (!canTransition(order.status as Order["status"], "paid")) return;

  for (const item of items) {
    if (item.saleMode === "in_stock") {
      await commitInStock(runner, item.productId, item.quantity);
    }
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

  const customerEmail = order.customerEmail;
  const orderRef = order.reference;
  const orderTotal = order.total;
  const orderUserId = order.userId;
  const itemProductIds = items.map((i) => i.productId);
  const receiptLines = items
    .map((i) => `- ${i.quantity}x ${i.title} (${formatIDR(i.unitPrice * i.quantity)})`)
    .join("\n");

  await runBackground(async () => {
    try {
      if (itemProductIds.length > 0) {
        await payload.delete({
          collection: "cart-items",
          where: {
            userId: { equals: orderUserId },
            product: { in: itemProductIds },
          },
        });
      }
    } catch (err) {
      console.error("[mayar] background cart cleanup failed:", err);
    }

    if (customerEmail) {
      try {
        await sendOrderReceipt(customerEmail, orderRef, orderTotal, receiptLines);
      } catch (err) {
        console.error("[mayar] background sendOrderReceipt failed:", err);
      }
    }
  });

  console.log(`[mayar] order ${order.reference} paid (group ${group.id})`);
}

async function handleFailure(
  payload: Payload,
  runner: SqlRunner,
  order: Order,
  items: OrderItem[],
  reason: string,
) {
  if (order.status !== "pending_payment") return;

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
