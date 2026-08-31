"use client";

import { useState } from "react";
import { ReviewForm } from "../reviews/ReviewForm";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

export interface ReviewPanelProps {
  orderId: number;
  orderItems: Array<{
    id: number;
    productId: number;
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export function ReviewPanel({ orderId, orderItems }: ReviewPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitSuccess = () => {
    setSuccessMessage("Terima kasih! Ulasanmu berhasil dikirim dan akan segera tampil setelah disetujui admin.");
    setShowForm(false);
  };

  if (successMessage) {
    return (
      <div className="rounded-xl border border-success/30 bg-success-subtle p-4 text-sm font-medium text-success">
        {successMessage}
      </div>
    );
  }

  if (!showForm) {
    return (
      <Card variant="flat" className="flex flex-col items-center gap-4 text-center p-6">
        <div>
          <Heading as="h4" className="text-lg">Bagikan Pengalamanmu</Heading>
          <Text size="sm" className="mt-1">
            Pesananmu telah sampai dengan selamat! Yuk bagikan ceritamu setelah mencoba produk ini.
          </Text>
        </div>
        <Button
          variant="primary"
          leftIcon={<MessageSquarePlus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
        >
          Beri Ulasan Sekarang
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewForm
        productId={orderItems[0]?.productId ?? 0}
        orderId={orderId}
        onSuccess={handleSubmitSuccess}
      />
    </div>
  );
}

