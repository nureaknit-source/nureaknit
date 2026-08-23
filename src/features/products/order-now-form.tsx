"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/toast";

interface Props {
  productId: number;
  isLoggedIn: boolean;
  maxStock?: number | null;
  availability?: string;
}

export function OrderNowForm({ productId, isLoggedIn, maxStock = null, availability }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const isPhysical = availability === "in_stock";
  const max =
    isPhysical && typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    if (loading) return;
    if (qty > max) {
      showToast("Jumlah melebihi stok yang tersedia.", "error");
      return;
    }
    setLoading(true);
    router.push(`/checkout?product=${productId}&qty=${qty}`);
  };

  return (
    <div className="flex w-full items-center gap-2 lg:flex-none">
      <label className="sr-only" htmlFor="order-now-qty">
        Jumlah
      </label>
      <input
        id="order-now-qty"
        type="number"
        min={1}
        max={Number.isFinite(max) ? max : undefined}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
        disabled={loading}
        className="h-12 w-16 rounded-full border border-border text-center text-sm font-bold text-fg-default focus:outline-none"
      />
      <button
        type="button"
        onClick={handleOrderNow}
        disabled={loading}
        className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50 lg:flex-none"
      >
        {loading ? "Memproses..." : "Order Now"}
      </button>
    </div>
  );
}