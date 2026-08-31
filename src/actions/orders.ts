"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import type { OrderDetail } from "./checkout";

export async function groupOrdersByTab(orders: OrderDetail[], userId: string) {
  const payload = await getPayload({ config });

  // Fetch ulasan milik user untuk mengetahui order mana yang sudah diulas
  const userReviews = await payload.find({
    collection: "reviews",
    where: { userId: { equals: userId } },
    overrideAccess: true,
    limit: 1000,
  });

  const reviewedOrderIds = new Set(userReviews.docs.map((r) => Number(r.order)));

  const tabGroups = {
    payment: [] as OrderDetail[],
    confirmation: [] as OrderDetail[],
    processing: [] as OrderDetail[],
    shipped: [] as OrderDetail[],
    review: [] as OrderDetail[],
    history: [] as OrderDetail[],
  };

  for (const order of orders) {
    // 1. History (finalized orders)
    const finalStatuses = ["fulfilled", "cancelled", "refunded", "disputed"];
    if (finalStatuses.includes(order.status)) {
      tabGroups.history.push(order);
      continue;
    }

    const isReviewed = reviewedOrderIds.has(order.id);

    // 2. Delivered → Review tab (jika belum diulas) atau History (jika sudah diulas)
    const hasDelivered = order.groups?.some(g => g.status === "delivered");
    if (hasDelivered) {
      if (isReviewed) {
        tabGroups.history.push(order);
      } else {
        tabGroups.review.push(order);
      }
      continue;
    }

    // 3. Shipped → Shipped tab
    const hasShipped = order.groups?.some(g => g.status === "shipped");
    if (hasShipped) {
      tabGroups.shipped.push(order);
      continue;
    }

    // 4. Waiting payment
    if (order.status === "pending_payment") {
      tabGroups.payment.push(order);
      continue;
    }

    // 5. Waiting approval
    if (order.status === "pending_approval") {
      tabGroups.confirmation.push(order);
      continue;
    }

    // 6. Processing (approved, paid, fulfilling)
    const processingStatuses = ["approved", "paid", "fulfilling"];
    if (processingStatuses.includes(order.status)) {
      tabGroups.processing.push(order);
      continue;
    }

    // 7. Fallback → history
    tabGroups.history.push(order);
  }

  return tabGroups;
}
