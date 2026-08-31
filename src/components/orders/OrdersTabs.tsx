"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/payload/utils";
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from "@/lib/commerce/labels";
import type { OrderDetail } from "@/actions/checkout";
import { ConfirmReceiptButton } from "./ConfirmReceiptButton";
import { ReviewPanel } from "./ReviewPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Package } from "lucide-react";

export interface OrdersTabsProps {
  initialTabs: {
    payment: OrderDetail[];
    confirmation: OrderDetail[];
    processing: OrderDetail[];
    shipped: OrderDetail[];
    review: OrderDetail[];
    history: OrderDetail[];
  };
}

export function OrdersTabs({ initialTabs }: OrdersTabsProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof initialTabs>("payment");

  const tabs = [
    { key: "payment", label: "Menunggu Pembayaran", count: initialTabs.payment.length },
    { key: "confirmation", label: "Menunggu Konfirmasi", count: initialTabs.confirmation.length },
    { key: "processing", label: "Sedang Diproses", count: initialTabs.processing.length },
    { key: "shipped", label: "Dalam Pengiriman", count: initialTabs.shipped.length },
    { key: "review", label: "Beri Ulasan", count: initialTabs.review.length },
    { key: "history", label: "Riwayat Pesanan", count: initialTabs.history.length },
  ] as const;

  const currentOrders = initialTabs[activeTab];

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "primary" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <Badge
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
              >
                {tab.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {currentOrders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8 text-fg-muted" />}
          title="Belum Ada Pesanan"
          message="Belum ada pesanan di kategori ini."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {currentOrders.map((order) => (
            <li key={order.id}>
              <Card hover className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-sans font-bold text-fg-default">{order.reference}</p>
                        <Badge variant="accent" size="sm" className="uppercase">
                          {ORDER_TYPE_LABELS[order.type]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-fg-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-extrabold text-fg-default">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-fg-muted">Status:</span>
                      <Badge variant="outline" size="sm">
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      {activeTab === "shipped" && order.groups?.map((g) => g.status === "shipped" && (
                        <ConfirmReceiptButton key={g.id} fulfillmentGroupId={g.id} />
                      ))}

                      <Link
                        href={`/profile/orders/${order.reference}`}
                        className="text-sm font-medium text-primary hover:text-accent hover:underline"
                      >
                        Lihat Detail Pesanan &rarr;
                      </Link>
                    </div>
                  </div>

                  {activeTab === "review" && (
                    <div className="border-t border-border pt-4">
                      <ReviewPanel
                        orderId={order.id}
                        orderItems={order.items.map((i) => ({
                          id: i.id,
                          productId: i.productId,
                          title: i.title,
                          unitPrice: i.unitPrice,
                          quantity: i.quantity,
                        }))}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

