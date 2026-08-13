import type { CollectionConfig, CollectionBeforeValidateHook } from "payload";

interface CartItemData {
  product?: number | { id: number };
  quantity?: number;
}

function productIdOf(p: CartItemData["product"]): number | undefined {
  if (typeof p === "number") return p;
  if (p && typeof p === "object") return p.id;
  return undefined;
}

// ponytail: clamp quantity to available stock once, here in the collection
// hook, so every create/update path (actions, seed, API) is bounded by
// `product.stock`. Non-physical stock (pre-order / dropship) is unbounded.
const clampQuantity: CollectionBeforeValidateHook = async ({ req, data, originalDoc }) => {
  const payload = (data ?? {}) as CartItemData;
  const original = (originalDoc ?? {}) as CartItemData;
  const productId = productIdOf(payload.product ?? original.product);
  const quantity: number | undefined = payload.quantity ?? original.quantity;
  if (!productId || quantity === undefined) return data;

  try {
    const productDoc = (await req.payload.findByID({
      collection: "products",
      id: productId,
      disableErrors: true,
    })) as { stock?: number | null; availability?: string | null } | null;

    if (!productDoc) return data;

    const isPhysical = productDoc.availability === "in_stock";
    const stock = typeof productDoc.stock === "number" ? productDoc.stock : 0;
    const max = isPhysical ? Math.max(1, stock) : quantity;

    if (quantity > max) {
      payload.quantity = max;
    }
  } catch {
    // if product lookup fails, leave quantity as-is
  }

  return data;
};

export const CartItems: CollectionConfig = {
  slug: "cart-items",
  admin: { group: "System", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
    update: () => false,
  },
  fields: [
    { name: "userId", type: "text", required: true },
    { name: "product", type: "relationship", relationTo: "products", required: true },
    { name: "quantity", type: "number", required: true, min: 1, defaultValue: 1 },
  ],
  hooks: {
    beforeValidate: [clampQuantity],
  },
};
