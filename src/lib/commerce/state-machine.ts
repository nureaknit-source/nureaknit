import type { Order } from "@/lib/payload/payload-types";

export type OrderStatus = Order["status"];

// Transisi status order yang diizinkan. Setiap perpindahan wajib mencatat `reason`.
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_approval: ["approved", "cancelled", "payment_failed"],
  approved: ["pending_payment", "cancelled"],
  pending_payment: ["paid", "payment_failed", "cancelled"],
  paid: ["fulfilling", "fulfilled", "refunded", "disputed"],
  fulfilling: ["fulfilled", "cancelled", "refunded", "disputed"],
  fulfilled: ["refunded", "disputed"],
  payment_failed: ["pending_payment", "cancelled"],
  cancelled: [],
  refunded: [],
  disputed: ["refunded", "fulfilled"],
};

export function canTransition(current: OrderStatus, next: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}

export function assertTransition(current: OrderStatus, next: OrderStatus, reason?: string): void {
  if (!canTransition(current, next)) {
    throw new Error(
      `Transisi order tidak sah: ${current} -> ${next}${reason ? ` (${reason})` : ""}`,
    );
  }
}