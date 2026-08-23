import type { CollectionBeforeDeleteHook, CollectionConfig } from "payload";

// FK order_items/payment_attempts/fulfillment_groups.order_id adalah
// NOT NULL + ON DELETE SET NULL, jadi order dengan anak gagal dihapus (23502).
// Hapus anak dulu via local API (overrideAccess bypass access delete: () => false).
const beforeDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  await req.payload.delete({ collection: "order-items", where: { order: { equals: id } }, overrideAccess: true });
  await req.payload.delete({ collection: "payment-attempts", where: { order: { equals: id } }, overrideAccess: true });
  await req.payload.delete({ collection: "fulfillment-groups", where: { order: { equals: id } }, overrideAccess: true });
};

export const ORDERS_STATUS = [
  "pending_approval",
  "approved",
  "pending_payment",
  "paid",
  "fulfilling",
  "fulfilled",
  "payment_failed",
  "cancelled",
  "refunded",
  "disputed",
] as const;

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    group: "Commerce",
    useAsTitle: "reference",
    components: {
      edit: {
        beforeDocumentControls: ["@/components/admin/approve-order-button#ApproveOrderButton"],
      },
    },
  },
  access: {
    // Hanya admin Payload bisa akses lewat REST/GraphQL/admin.
    // Server action memakai local API (overrideAccess default true) + ownership check di kode.
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: { beforeDelete: [beforeDelete] },
  fields: [
    { name: "userId", type: "text", required: true, index: true },
    {
      name: "customerEmail",
      type: "email",
      required: true,
      label: "Customer Email",
      admin: {
        readOnly: true,
        description: "Snapshot email pembeli saat checkout (untuk receipt).",
      },
    },
    { name: "reference", type: "text", required: true, unique: true, index: true },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "in_stock",
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Pre-Order", value: "pre_order" },
      ],
      index: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending_payment",
      options: ORDERS_STATUS.map((value) => ({ label: value, value })),
      index: true,
    },
    { name: "currency", type: "text", required: true, defaultValue: "IDR" },
    { name: "subtotal", type: "number", required: true, min: 0 },
    { name: "shippingTotal", type: "number", min: 0, defaultValue: 0 },
    { name: "taxTotal", type: "number", min: 0, defaultValue: 0 },
    { name: "total", type: "number", required: true, min: 0 },
    { name: "providerSessionId", type: "text", unique: true, index: true },
    { name: "idempotencyKey", type: "text", unique: true },
    { name: "approvedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
    { name: "paidAt", type: "date", admin: { position: "sidebar", readOnly: true } },
    {
      name: "reason",
      type: "textarea",
      label: "Audit Reason",
      admin: { position: "sidebar", description: "Wajib diisi untuk perubahan status oleh admin." },
    },
    {
      name: "customerPhone",
      type: "text",
      label: "No. Telepon",
      admin: { description: "Snapshot nomor HP pembeli saat checkout." },
    },
    {
      name: "customerAddress",
      type: "textarea",
      label: "Alamat Pengiriman",
      admin: { description: "Snapshot alamat pembeli saat checkout." },
    },
    {
      name: "customerNotes",
      type: "textarea",
      label: "Catatan Pembeli",
      admin: { description: "Keterangan opsional dari pembeli." },
    },
    {
      name: "tosAccepted",
      type: "checkbox",
      label: "ToS Accepted",
      defaultValue: false,
      admin: { description: "Persetujuan syarat & ketentuan saat checkout." },
    },
    {
      name: "paymentQrUrl",
      type: "text",
      label: "Payment QR URL",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "URL gambar QRIS dari Midtrans (hanya berlaku sebelum settlement).",
      },
    },
    { name: "expiresAt", type: "date", label: "Payment Expires At", admin: { position: "sidebar", readOnly: true } },
  ],
};