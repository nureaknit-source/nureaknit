import type { CollectionConfig } from "payload";

export const PaymentAttempts: CollectionConfig = {
  slug: "payment-attempts",
  admin: { group: "Commerce", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === "admin",
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "order", type: "relationship", relationTo: "orders", required: true, index: true },
    // Unique constraint = idempotensi: event webhook yang sama tidak diproses dua kali.
    { name: "providerEventId", type: "text", unique: true, index: true },
    { name: "eventType", type: "text", label: "Event Type" },
    { name: "status", type: "text" },
    { name: "amount", type: "number", min: 0 },
    { name: "currency", type: "text", defaultValue: "IDR" },
    { name: "raw", type: "json", label: "Raw Provider Payload" },
    { name: "occurredAt", type: "date" },
  ],
};