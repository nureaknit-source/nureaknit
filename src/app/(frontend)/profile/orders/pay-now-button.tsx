"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { payNowAction } from "@/actions/checkout";
import { showToast } from "@/components/ui/toast";

export function PayNowButton({ orderId }: { orderId: number }) {
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
    <button
      type="button"
      onClick={handlePayNow}
      disabled={loading}
      className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90 disabled:opacity-60"
    >
      {loading ? "Memproses..." : "Pay Now"}
    </button>
  );
}