export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_approval: "Menunggu Konfirmasi",
  approved: "Disetujui — Siap Bayar",
  pending_payment: "Menunggu Pembayaran",
  paid: "Lunas (Paid)",
  fulfilling: "Sedang Diproses",
  fulfilled: "Selesai",
  payment_failed: "Pembayaran Gagal",
  cancelled: "Dibatalkan",
  refunded: "Dana Dikembalikan",
  disputed: "Dalam Peninjauan",
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  in_stock: "Ready Stock",
  pre_order: "Pre-Order",
};

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  unfulfilled: "Belum Diproses",
  processing: "Sedang Diproses",
  shipped: "Dalam Pengiriman",
  released: "Digital Ready",
  delivered: "Telah Diterima",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

export const FULFILLMENT_KIND_LABELS: Record<string, string> = {
  ship: "Pengiriman",
  release: "Rilis Digital",
};