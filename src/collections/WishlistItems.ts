import type { CollectionConfig } from "payload";

export const WishlistItems: CollectionConfig = {
  slug: "wishlist-items",
  admin: { group: "System", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
    update: () => false,
  },
  fields: [
    { name: "email", type: "text", required: true },
    { name: "product", type: "relationship", relationTo: "products", required: true },
  ],
};
