import type { CollectionConfig } from "payload";

export const OrderItems: CollectionConfig = {
  slug: "order-items",
  admin: { group: "Commerce", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === "admin",
    // Immutable: snapshot order tidak boleh diubah/dihapus.
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "order", type: "relationship", relationTo: "orders", required: true, index: true },
    { name: "productId", type: "number", required: true, index: true },
    { name: "title", type: "text", required: true },
    { name: "unitPrice", type: "number", required: true, min: 0 },
    { name: "quantity", type: "number", required: true, min: 1 },
    { name: "currency", type: "text", required: true, defaultValue: "IDR" },
    {
      name: "saleMode",
      type: "select",
      required: true,
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Pre-Order", value: "pre_order" },
      ],
    },
    { name: "promisedEstimate", type: "text", label: "Promised Estimate" },
    { name: "productRevision", type: "number" },
  ],
};