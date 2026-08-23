import type { CollectionConfig } from "payload";

export const FulfillmentGroups: CollectionConfig = {
  slug: "fulfillment-groups",
  admin: { group: "Commerce", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: () => false,
  },
  fields: [
    { name: "order", type: "relationship", relationTo: "orders", required: true, index: true },
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Ship (in-stock)", value: "ship" },
        { label: "Release (pre-order)", value: "release" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "unfulfilled",
      options: [
        { label: "Unfulfilled", value: "unfulfilled" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Released", value: "released" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" },
      ],
      index: true,
    },
    { name: "estimate", type: "text", label: "Estimate / Delivery Window" },
    { name: "trackingNumber", type: "text" },
    { name: "items", type: "relationship", relationTo: "order-items", hasMany: true },
  ],
};