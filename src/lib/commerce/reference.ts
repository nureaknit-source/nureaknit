export function generateReference(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `NK-${n}`;
}

export function generateIdempotencyKey(orderId: number | string): string {
  return `order-${orderId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}