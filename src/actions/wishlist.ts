"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

async function getUserEmail(): Promise<string> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Unauthorized");
  return user.email;
}

export async function addWishlistAction(productId: number) {
  const email = await getUserEmail();
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "wishlist-items",
    where: { email: { equals: email }, product: { equals: productId } },
    limit: 1,
  });
  if (existing.docs.length === 0) {
    await payload.create({ collection: "wishlist-items", data: { email, product: productId } });
  }
  return { ok: true };
}

export async function removeWishlistAction(productId: number) {
  const email = await getUserEmail();
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "wishlist-items",
    where: { email: { equals: email }, product: { equals: productId } },
    limit: 1,
  });
  if (existing.docs.length > 0) {
    await payload.delete({ collection: "wishlist-items", id: existing.docs[0].id });
  }
  return { ok: true };
}

export async function getWishlistAction(): Promise<number[]> {
  const email = await getUserEmail();
  const payload = await getPayload({ config });
  const items = await payload.find({ collection: "wishlist-items", where: { email: { equals: email } }, limit: 999 });
  return items.docs.map((item: any) => item.product as number);
}
