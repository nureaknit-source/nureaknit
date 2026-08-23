export interface MoneyLine {
  unitPrice: number;
  quantity: number;
}

export interface TotalsInput {
  items: MoneyLine[];
  shippingTotal?: number;
  taxTotal?: number;
}

export function calcTotals({ items, shippingTotal = 0, taxTotal = 0 }: TotalsInput) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { subtotal, shippingTotal, taxTotal, total: subtotal + shippingTotal + taxTotal };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}