export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_approval: "Menunggu Konfirmasi",
  approved: "Disetujui — Siap Bayar",
  pending_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  fulfilling: "Diproses",
  fulfilled: "Selesai",
  payment_failed: "Pembayaran Gagal",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
  disputed: "Sengketa",
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  pre_order: "Pre-Order",
};

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  unfulfilled: "Belum Diproses",
  processing: "Sedang Diproses",
  shipped: "Dikirim",
  released: "Dirilis",
  delivered: "Terkirim",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

export const FULFILLMENT_KIND_LABELS: Record<string, string> = {
  ship: "Pengiriman",
  release: "Rilis Digital",
};