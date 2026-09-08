"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { checkRateLimit, rateLimitKey, getClientIp } from "@/lib/rate-limit";
import { getCachedUserSession } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { CartItem, Product } from "@/lib/payload/payload-types";

interface UserSession {
  id: string;
  email: string;
}

export async function getUserSession(): Promise<UserSession> {
  const user = await getCachedUserSession();
  if (!user?.id || !user?.email) throw new Error("Unauthorized");
  return { id: user.id, email: user.email };
}

function productIdOf(item: CartItem): number {
  return typeof item.product === "number" ? item.product : item.product.id;
}

function quantityOf(item: CartItem): number {
  return typeof item.quantity === "number" ? item.quantity : 1;
}

export async function addItemToCartAction(productId: number, quantity = 1): Promise<{ ok: boolean; error?: string }> {
  const { id: userId } = await getUserSession();
  const payload = await getPayload({ config });

  const qty = Math.max(1, Math.round(quantity));

  const existing = await payload.find({
    collection: "cart-items",
    where: { userId: { equals: userId }, product: { equals: productId } },
    limit: 1,
    depth: 0,
    select: { id: true, quantity: true },
  });

  if (existing.docs.length > 0) {
    const item = existing.docs[0] as CartItem;
    await payload.update({
      collection: "cart-items",
      id: item.id,
      data: { quantity: quantityOf(item) + qty },
    });
  } else {
    await payload.create({
      collection: "cart-items",
      data: { userId, product: productId, quantity: qty },
    });
  }

  revalidatePath("/profile/cart");
  revalidatePath("/products");
  return { ok: true };
}

export async function updateCartItemAction(itemId: number, quantity: number): Promise<{ ok: boolean; error?: string }> {
  const { id: userId } = await getUserSession();

  // ponytail: rate limit per-IP sebagai safety net jika debounce client-side lolos
  const ip = getClientIp(await headers());
  if (!checkRateLimit(rateLimitKey(ip, "cart-update"), 20, 60_000)) {
    return { ok: false, error: "Terlalu banyak permintaan. Coba lagi nanti." };
  }

  const payload = await getPayload({ config });

  const item = await payload.findByID({ collection: "cart-items", id: itemId, depth: 0 });
  if (!item || item.userId !== userId) return { ok: false, error: "Unauthorized" };

  await payload.update({
    collection: "cart-items",
    id: itemId,
    data: { quantity: Math.max(1, Math.round(quantity)) },
  });

  revalidatePath("/profile/cart");
  return { ok: true };
}

export async function removeFromCartAction(itemId: number): Promise<{ ok: boolean; error?: string }> {
  const { id: userId } = await getUserSession();
  const payload = await getPayload({ config });

  const item = await payload.findByID({ collection: "cart-items", id: itemId, depth: 0 });
  if (!item || item.userId !== userId) return { ok: false, error: "Unauthorized" };

  await payload.delete({ collection: "cart-items", id: itemId });
  revalidatePath("/profile/cart");
  return { ok: true };
}

export interface CartItemWithProduct {
  id: number;
  product: Product;
  quantity: number;
}

export async function getCartAction(): Promise<CartItemWithProduct[]> {
  const { id: userId } = await getUserSession();
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "cart-items",
    where: { userId: { equals: userId } },
    depth: 2,
    limit: 999,
  });
  return (result.docs as CartItem[]).map((item) => ({
    id: item.id,
    product: item.product as Product,
    quantity: quantityOf(item),
  }));
}

/**
 * Fetch product IDs that are currently in the cart (for highlighting on
 * product cards/listing pages). Returns empty array when not logged in.
 */
export async function getCartProductIdsAction(): Promise<number[]> {
  const user = await getCachedUserSession();
  if (!user?.id) return [];
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "cart-items",
    depth: 0,
    select: { product: true },
    where: { userId: { equals: user.id } },
    limit: 999,
  });
  return (result.docs as CartItem[]).map(productIdOf);
}

export async function getCartItemCountAction(): Promise<number> {
  const user = await getCachedUserSession();
  if (!user?.id) return 0;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "cart-items",
    depth: 0,
    select: { quantity: true },
    where: { userId: { equals: user.id } },
    limit: 999,
  });
  return (result.docs as CartItem[]).reduce((sum, item) => sum + quantityOf(item), 0);
}

export async function clearCartAction(): Promise<{ ok: boolean; error?: string }> {
  const { id: userId } = await getUserSession();
  const payload = await getPayload({ config });
  await payload.delete({
    collection: "cart-items",
    where: { userId: { equals: userId } },
  });
  revalidatePath("/profile/cart");
  return { ok: true };
}
