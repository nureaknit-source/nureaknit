"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { payNowAction } from "@/actions/checkout";
import { showToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export interface PayNowButtonProps {
  orderId: number;
}

export function PayNowButton({ orderId }: PayNowButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayNow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await payNowAction(orderId);
      if (!result.ok) {
        showToast(result.error || "Gagal membuka pembayaran, coba lagi.", "error");
        return;
      }
      router.push(
        `/checkout/success?ref=${encodeURIComponent(result.reference ?? "")}&qr=${encodeURIComponent(result.qrImageUrl ?? "")}`,
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal membuka pembayaran, coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePayNow}
      isLoading={loading}
      leftIcon={<CreditCard className="h-4 w-4" />}
      className="mt-4"
    >
      Bayar Sekarang (Pay Now)
    </Button>
  );
}