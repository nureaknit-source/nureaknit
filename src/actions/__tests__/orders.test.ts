import { groupOrdersByTab } from "../orders";
import type { OrderDetail } from "../checkout";

// Minimal test runner for ponytail check
export async function testGroupOrdersByTab() {
  const mockOrders: OrderDetail[] = [
    {
      id: 1,
      reference: "ORD-001",
      status: "pending_payment",
      type: "in_stock",
      subtotal: 100000,
      total: 100000,
      items: [],
      groups: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currency: "IDR",
      userId: "user-1",
      customerEmail: "user@example.com",
    },
    {
      id: 2,
      reference: "ORD-002",
      status: "paid",
      type: "in_stock",
      subtotal: 150000,
      total: 150000,
      items: [],
      groups: [{ id: 1, order: 2, kind: "ship", status: "shipped", createdAt: "", updatedAt: "" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currency: "IDR",
      userId: "user-1",
      customerEmail: "user@example.com",
    },
    {
      id: 3,
      reference: "ORD-003",
      status: "fulfilled",
      type: "in_stock",
      subtotal: 200000,
      total: 200000,
      items: [],
      groups: [{ id: 2, order: 3, kind: "ship", status: "delivered", createdAt: "", updatedAt: "" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currency: "IDR",
      userId: "user-1",
      customerEmail: "user@example.com",
    },
  ];

  const result = await groupOrdersByTab(mockOrders, "user-1");

  console.assert(result.payment.length === 1, "Expected 1 order in payment tab");
  console.assert(result.payment[0].reference === "ORD-001", "Expected ORD-001 in payment tab");
  console.assert(result.shipped.length === 1, "Expected 1 order in shipped tab");
  console.assert(result.shipped[0].reference === "ORD-002", "Expected ORD-002 in shipped tab");
  console.assert(result.history.length === 1, "Expected 1 order in history tab");
  console.assert(result.history[0].reference === "ORD-003", "Expected ORD-003 in history tab");

  console.log("All groupOrdersByTab assertions passed!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testGroupOrdersByTab();
}
