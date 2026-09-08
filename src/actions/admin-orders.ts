"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createPgRunner, claimPreOrderCapacity, releasePreOrderCapacity } from "@/lib/commerce/reservation";
import { withinPerCustomerLimit } from "@/lib/commerce/availability";
import { existingPreOrderQty } from "@/actions/checkout";
import { sendPreOrderApproved } from "@/lib/email";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { OrderItem, Product } from "@/lib/payload/payload-types";

async function runBackground(fn: () => Promise<void> | void): Promise<void> {
  try {
    after(fn);
  } catch {
    await fn();
  }
}

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
  if (lines.length === 0) return { ok: false, error: "Order tidak memiliki item." };

  // Batch query produk sebelum validasi per-customer limit
  const productIds = Array.from(new Set(lines.map((l) => l.productId)));
  const productsResult = await payload.find({
    collection: "products",
    where: { id: { in: productIds } },
    limit: productIds.length,
  });
  const productsMap = new Map((productsResult.docs as Product[]).map((p) => [p.id, p]));

  // Cek per-customer limit dulu (order ini sudah terhitung dalam existing qty).
  for (const item of lines) {
    const product = productsMap.get(item.productId);
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

  if (order.customerEmail) {
    const email = order.customerEmail;
    const ref = order.reference;
    runBackground(async () => {
      try {
        await sendPreOrderApproved(email, ref);
      } catch (e) {
        console.error("[admin-orders] sendPreOrderApproved failed in after():", e);
      }
    });
  }

  revalidatePath(`/profile/orders/${order.reference}`);
  return { ok: true };
}