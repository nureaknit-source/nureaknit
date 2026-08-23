export type SaleMode = "in_stock" | "dropship" | "pre_order" | "unavailable";

export interface ProductAvailability {
  availability?: SaleMode | null;
  stock?: number | null;
  reservedStock?: number | null;
  preOrderCutoff?: string | null;
  preOrderCapacity?: number | null;
  preOrderCommitted?: number | null;
  perCustomerLimit?: number | null;
}

export function isPurchasable(p: ProductAvailability): boolean {
  return (
    p.availability === "in_stock" ||
    p.availability === "dropship" ||
    p.availability === "pre_order"
  );
}

export function inStockAvailable(p: ProductAvailability, qty = 1): boolean {
  if (p.availability !== "in_stock") return false;
  const stock = p.stock ?? 0;
  const reserved = p.reservedStock ?? 0;
  return stock - reserved >= qty;
}

export function preOrderOpen(p: ProductAvailability, now = new Date()): boolean {
  if (p.availability !== "pre_order") return false;
  if (!p.preOrderCutoff) return true;
  return new Date(p.preOrderCutoff).getTime() > now.getTime();
}

export function preOrderCapacityAvailable(
  p: ProductAvailability,
  committed: number,
  qty: number,
): boolean {
  if (p.availability !== "pre_order") return false;
  if (!p.preOrderCapacity) return true;
  return committed + qty <= p.preOrderCapacity;
}

export function withinPerCustomerLimit(
  p: ProductAvailability,
  existingQty: number,
  qty: number,
): boolean {
  if (p.availability !== "pre_order") return true;
  if (!p.perCustomerLimit) return true;
  return existingQty + qty <= p.perCustomerLimit;
}