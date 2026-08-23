"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createPgRunner, claimPreOrderCapacity, releasePreOrderCapacity } from "@/lib/commerce/reservation";
import { withinPerCustomerLimit } from "@/lib/commerce/availability";
import { existingPreOrderQty } from "@/actions/checkout";
import { sendPreOrderApproved } from "@/lib/email";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { OrderItem } from "@/lib/payload/payload-types";

export async function approveOrderAction(
  orderId: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = reason.trim();
  if (!trimmed) return { ok: false, error: "Alasan wajib diisi." };

  // Auth admin via cookie Payload (admin UI menyertakan sesi).
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: (await headers()) as unknown as Request["headers"] });
  if (user?.role !== "admin") return { ok: false, error: "Unauthorized" };

  const order = await payload.findByID({ collection: "orders", id: orderId });
  if (!order || order.type !== "pre_order") return { ok: false, error: "Order tidak ditemukan." };
  if (order.status !== "pending_approval") {
    return { ok: false, error: `Order sudah berstatus ${order.status}.` };
  }

  const items = await payload.find({
    collection: "order-items",
    where: { order: { equals: order.id } },
    limit: 100,
  });
  const lines = items.docs as OrderItem[];

  // Cek per-customer limit dulu (order ini sudah terhitung dalam existing qty).
  for (const item of lines) {
    const product = await payload.findByID({ collection: "products", id: item.productId });
    if (!product || product.availability !== "pre_order") {
      return { ok: false, error: "Produk tidak lagi pre-order." };
    }
    const existing = await existingPreOrderQty(payload, order.userId, item.productId);
    if (!withinPerCustomerLimit(product, Math.max(0, existing - item.quantity), item.quantity)) {
      return { ok: false, error: `Melebihi batas pembelian ${product.title} per pelanggan.` };
    }
  }

  // Claim capacity atomik; gagal satu → release yang sudah ter-claim, order tetap pending_approval.
  const runner = createPgRunner(payload.db?.drizzle as unknown as NodePgDatabase);
  const claimed: { productId: number; quantity: number }[] = [];
  for (const item of lines) {
    if (!(await claimPreOrderCapacity(runner, item.productId, item.quantity))) {
      for (const c of claimed) await releasePreOrderCapacity(runner, c.productId, c.quantity);
      return { ok: false, error: "Kapasitas pre-order sudah penuh." };
    }
    claimed.push({ productId: item.productId, quantity: item.quantity });
  }

  await payload.update({
    collection: "orders",
    id: order.id,
    data: {
      status: "approved",
      approvedAt: new Date().toISOString(),
      reason: trimmed,
    },
  });
  if (order.customerEmail) await sendPreOrderApproved(order.customerEmail, order.reference);
  revalidatePath(`/profile/orders/${order.reference}`);
  return { ok: true };
}