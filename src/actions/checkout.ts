"use server";

import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { checkRateLimit, rateLimitKey, getClientIp } from "@/lib/rate-limit";
import { getUserSession, getCartAction } from "@/actions/cart";
import { generateReference, generateIdempotencyKey } from "@/lib/commerce/reference";
import { calcTotals } from "@/lib/commerce/money";
import {
  isPurchasable,
  inStockAvailable,
  preOrderOpen,
  preOrderCapacityAvailable,
  withinPerCustomerLimit,
} from "@/lib/commerce/availability";
import { claimInStock, releaseInStock, createPgRunner } from "@/lib/commerce/reservation";
import { assertTransition } from "@/lib/commerce/state-machine";
import { createQrCodeToken } from "@/lib/payments/midtrans";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Order, OrderItem, Product, FulfillmentGroup } from "@/lib/payload/payload-types";

const PAYMENT_EXPIRY_MINUTES = 15;

export interface CheckoutResult {
  ok: boolean;
  error?: string;
  inStock?: { reference: string; qrImageUrl: string; midtransTxId: string };
  preOrder?: { reference: string; waLink: string };
}

function waLink(reference: string): string {
  const admin = process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER;
  const text = encodeURIComponent(
    `Halo Nurea Knit! Saya ingin mengonfirmasi pre-order saya.\n\nNo. Order: ${reference}\n\nMohon konfirmasi, terima kasih!`,
  );
  return admin ? `https://wa.me/${admin}?text=${text}` : "";
}

export interface CheckoutArgs {
  productId?: number;
  qty?: number;
  phone?: string;
  address?: string;
  notes?: string;
  tosAccepted?: boolean;
}

export async function startCheckoutAction(args?: CheckoutArgs): Promise<CheckoutResult> {
  const session = await getUserSession();

  // ponytail: rate limit per-IP sebagai safety net anti spam order
  const ip = getClientIp(await headers());
  if (!checkRateLimit(rateLimitKey(ip, "checkout"), 5, 60_000)) {
    return { ok: false, error: "Terlalu banyak permintaan. Coba lagi nanti." };
  }

  const phone = (args?.phone ?? "").trim();
  const address = (args?.address ?? "").trim();
  if (!phone || !address) return { ok: false, error: "Nomor telepon dan alamat wajib diisi." };
  if (!args?.tosAccepted) return { ok: false, error: "Anda harus menyetujui syarat & ketentuan." };

  const payload = await getPayload({ config });
  if (!payload.db?.drizzle) return { ok: false, error: "Database belum siap. Coba muat ulang halaman." };
  const runner = createPgRunner(payload.db.drizzle as unknown as NodePgDatabase);

  let cart: OrderLine[];
  if (args?.productId) {
    // Order Now: single-product checkout, qty dari input halaman produk.
    const product = await payload.findByID({ collection: "products", id: args.productId });
    if (!product) return { ok: false, error: "Produk tidak ditemukan." };
    const qty = Math.max(1, Math.floor(args.qty ?? 1));
    cart = [{ id: product.id, product: product as Product, quantity: qty }];
  } else {
    cart = await getCartAction();
  }
  if (cart.length === 0) return { ok: false, error: "Keranjang kosong." };

  // Revalidasi server-authoritative: harga & ketersediaan diambil fresh dari DB.
  const problems: string[] = [];
  for (const line of cart) {
    const p = line.product;
    if (!isPurchasable(p)) {
      problems.push(`${p.title} tidak tersedia saat ini.`);
      continue;
    }
    if (p.availability === "in_stock" && !inStockAvailable(p, line.quantity)) {
      problems.push(`Stok ${p.title} tidak cukup (tersisa ${(p.stock ?? 0) - (p.reservedStock ?? 0)}).`);
    }
    if (p.availability === "pre_order") {
      if (!preOrderOpen(p)) problems.push(`Pre-order ${p.title} sudah ditutup.`);
      else if (!preOrderCapacityAvailable(p, p.preOrderCommitted ?? 0, line.quantity)) {
        problems.push(`Kapasitas pre-order ${p.title} sudah penuh.`);
      } else {
        const existing = await existingPreOrderQty(payload, session.id, p.id);
        if (!withinPerCustomerLimit(p, existing, line.quantity)) {
          problems.push(`Batas pembelian ${p.title} per pelanggan adalah ${p.perCustomerLimit} unit.`);
        }
      }
    }
  }
  if (problems.length > 0) return { ok: false, error: problems.join(" ") };

  const inStockLines = cart.filter((l) => l.product.availability === "in_stock");
  const preOrderLines = cart.filter((l) => l.product.availability === "pre_order");

  const details = { phone, address, notes: args?.notes?.trim(), tosAccepted: true };

  const result: CheckoutResult = { ok: true };
  if (inStockLines.length > 0) {
    result.inStock = (await createInStockOrder(payload, runner, session.id, session.email, inStockLines, details)) ?? undefined;
    if (!result.inStock) return { ok: false, error: "Gagal membuat order in-stock. Stok mungkin berubah, coba lagi." };
  }
  if (preOrderLines.length > 0) {
    result.preOrder = await createPreOrderOrder(payload, session.id, session.email, preOrderLines, details);
  }
  return result;
}

interface CheckoutDetails {
  phone: string;
  address: string;
  notes?: string;
  tosAccepted: boolean;
}

export async function existingPreOrderQty(payload: Payload, userId: string, productId: number): Promise<number> {
  const orders = await payload.find({
    collection: "orders",
    where: {
      userId: { equals: userId },
      type: { equals: "pre_order" },
      status: { not_in: ["cancelled", "refunded", "payment_failed"] },
    },
    limit: 999,
  });
  if (orders.docs.length === 0) return 0;
  const items = await payload.find({
    collection: "order-items",
    where: { order: { in: orders.docs.map((o) => o.id) }, productId: { equals: productId } },
    limit: 999,
  });
  return (items.docs as OrderItem[]).reduce((sum, i) => sum + i.quantity, 0);
}

interface OrderLine {
  id: number;
  product: Product;
  quantity: number;
}

async function createInStockOrder(
  payload: Payload,
  runner: ReturnType<typeof createPgRunner>,
  userId: string,
  customerEmail: string,
  lines: OrderLine[],
  details: CheckoutDetails,
): Promise<CheckoutResult["inStock"] | null> {
  const reference = generateReference();
  const totals = calcTotals({ items: lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })) });

  const order = await payload.create({
    collection: "orders",
    data: {
      userId,
      customerEmail,
      reference,
      type: "in_stock",
      status: "pending_payment",
      subtotal: totals.subtotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: totals.total,
      currency: "IDR",
      customerPhone: details.phone,
      customerAddress: details.address,
      customerNotes: details.notes ?? null,
      tosAccepted: details.tosAccepted,
      idempotencyKey: generateIdempotencyKey(reference),
      expiresAt: new Date(Date.now() + PAYMENT_EXPIRY_MINUTES * 60_000).toISOString(),
    },
  });

  await Promise.all(
    lines.map((l) =>
      payload.create({
        collection: "order-items",
        data: {
          order: order.id,
          productId: l.product.id,
          title: l.product.title,
          unitPrice: l.product.price,
          quantity: l.quantity,
          saleMode: "in_stock",
          currency: "IDR",
          promisedEstimate: null,
          productRevision: l.product.revision ?? null,
        },
      }),
    ),
  );

  // Claim semua dulu; satu gagal → batalkan order + release yang sudah terclaim.
  const claimed: { productId: number; quantity: number }[] = [];
  for (const l of lines) {
    if (!(await claimInStock(runner, l.product.id, l.quantity))) {
      for (const c of claimed) await releaseInStock(runner, c.productId, c.quantity);
      await payload.update({
        collection: "orders",
        id: order.id,
        data: { status: "cancelled", reason: "Stok habis saat checkout" },
      });
      return null;
    }
    claimed.push({ productId: l.product.id, quantity: l.quantity });
  }

  try {
    const qr = await createQrCodeToken({
      orderId: reference,
      grossAmount: totals.total,
      items: lines.map((l) => ({
        id: String(l.product.id),
        price: l.product.price,
        quantity: l.quantity,
        name: l.product.title,
      })),
      customerEmail,
      expiryMinutes: PAYMENT_EXPIRY_MINUTES,
    });
    await payload.update({
      collection: "orders",
      id: order.id,
      data: { providerSessionId: qr.transactionId, paymentQrUrl: qr.qrImageUrl },
    });
    return { reference, qrImageUrl: qr.qrImageUrl, midtransTxId: qr.transactionId };
  } catch (e) {
    console.error("[checkout] createQrCodeToken failed:", e);
    for (const c of claimed) await releaseInStock(runner, c.productId, c.quantity);
    await payload.update({
      collection: "orders",
      id: order.id,
      data: { status: "cancelled", reason: "Gagal membuat pembayaran (QRIS)" },
    });
    return null;
  }
}

async function createPreOrderOrder(
  payload: Payload,
  userId: string,
  customerEmail: string,
  lines: OrderLine[],
  details: CheckoutDetails,
): Promise<CheckoutResult["preOrder"]> {
  const reference = generateReference();
  const totals = calcTotals({ items: lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })) });

  const order = await payload.create({
    collection: "orders",
    data: {
      userId,
      customerEmail,
      reference,
      type: "pre_order",
      status: "pending_approval",
      subtotal: totals.subtotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: totals.total,
      currency: "IDR",
      customerPhone: details.phone,
      customerAddress: details.address,
      customerNotes: details.notes ?? null,
      tosAccepted: details.tosAccepted,
      idempotencyKey: generateIdempotencyKey(reference),
    },
  });

  await Promise.all(
    lines.map((l) =>
      payload.create({
        collection: "order-items",
        data: {
          order: order.id,
          productId: l.product.id,
          title: l.product.title,
          unitPrice: l.product.price,
          quantity: l.quantity,
          saleMode: "pre_order",
          currency: "IDR",
          promisedEstimate: l.product.estimatedAvailability ?? null,
          productRevision: l.product.revision ?? null,
        },
      }),
    ),
  );

  return { reference, waLink: waLink(reference) };
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  groups: FulfillmentGroup[];
}

export async function getOrdersAction(): Promise<OrderDetail[]> {
  const { id } = await getUserSession();
  const payload = await getPayload({ config });
  const orders = await payload.find({
    collection: "orders",
    where: { userId: { equals: id } },
    sort: "-createdAt",
    limit: 50,
  });
  return Promise.all(
    (orders.docs as Order[]).map((o) => orderDetail(payload, o)),
  );
}

async function orderDetail(payload: Payload, order: Order): Promise<OrderDetail> {
  const [items, groups] = await Promise.all([
    payload.find({ collection: "order-items", where: { order: { equals: order.id } }, limit: 100 }),
    payload.find({ collection: "fulfillment-groups", where: { order: { equals: order.id } }, limit: 20 }),
  ]);
  return {
    ...order,
    items: items.docs as OrderItem[],
    groups: groups.docs as FulfillmentGroup[],
  };
}

export async function getOrderAction(reference: string): Promise<OrderDetail | null> {
  const { id } = await getUserSession();
  const payload = await getPayload({ config });
  const found = await payload.find({
    collection: "orders",
    where: { reference: { equals: reference }, userId: { equals: id } },
    limit: 1,
  });
  const order = found.docs[0] as Order | undefined;
  if (!order) return null;
  return orderDetail(payload, order);
}

export async function payNowAction(
  orderId: number,
): Promise<{ ok: boolean; error?: string; reference?: string; qrImageUrl?: string; midtransTxId?: string }> {
  const session = await getUserSession();
  const payload = await getPayload({ config });

  const order = await payload.findByID({ collection: "orders", id: orderId });
  if (!order || order.userId !== session.id) return { ok: false, error: "Order tidak ditemukan." };
  if (order.type !== "pre_order" || order.status !== "approved") {
    return { ok: false, error: "Pembayaran belum bisa dibuka." };
  }

  const items = await payload.find({
    collection: "order-items",
    where: { order: { equals: order.id } },
    limit: 100,
  });

   let qr;
  try {
    qr = await createQrCodeToken({
      orderId: order.reference,
      grossAmount: order.total,
      items: (items.docs as OrderItem[]).map((i) => ({
        id: String(i.productId),
        price: i.unitPrice,
        quantity: i.quantity,
        name: i.title,
      })),
      customerEmail: order.customerEmail ?? session.email,
      expiryMinutes: PAYMENT_EXPIRY_MINUTES,
    });
  } catch (e) {
    console.error("[payNow] createQrCodeToken failed:", e);
    return { ok: false, error: "Gagal membuka pembayaran. Coba lagi." };
  }

  assertTransition(order.status, "pending_payment", "Pay Now");
  await payload.update({
    collection: "orders",
    id: order.id,
    data: {
      providerSessionId: qr.transactionId,
      paymentQrUrl: qr.qrImageUrl,
      status: "pending_payment",
      expiresAt: new Date(Date.now() + PAYMENT_EXPIRY_MINUTES * 60_000).toISOString(),
      reason: "Pay Now",
    },
  });
  return { ok: true, reference: order.reference, qrImageUrl: qr.qrImageUrl, midtransTxId: qr.transactionId };
}