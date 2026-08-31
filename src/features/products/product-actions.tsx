"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Zap } from "lucide-react";
import { addItemToCartAction } from "@/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { showToast } from "@/components/ui/toast";

export interface ProductActionsProps {
  productId: number;
  isLoggedIn: boolean;
  maxStock?: number | null;
  availability?: string;
}

export function ProductActions({
  productId,
  isLoggedIn,
  maxStock = null,
  availability = "in_stock",
}: ProductActionsProps) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isUnavailable = availability === "unavailable";
  const isPhysical = availability === "in_stock";
  const max =
    isPhysical && typeof maxStock === "number" && maxStock > 0
      ? maxStock
      : Infinity;

  const handleDecrease = () => setQty((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQty((prev) => Math.min(Number.isFinite(max) ? max : prev + 1, prev + 1));

  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    if (added || adding) return;
    if (qty > max) {
      showToast("Jumlah melebihi stok yang tersedia.", "error");
      return;
    }

    setAdding(true);
    // ponytail: optimistic update
    useCartStore.getState().increment(qty, 0);
    setAdded(true);
    showToast("Berhasil ditambahkan ke keranjang!", "success");
    window.dispatchEvent(new CustomEvent("cart:updated"));

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2000);

    try {
      const { ok, error } = await addItemToCartAction(productId, qty);
      if (!ok) throw new Error(error || "Gagal menambahkan ke keranjang.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menambahkan ke keranjang",
        "error",
      );
      useCartStore.getState().decrement(qty, 0);
      setAdded(false);
      clearTimeout(timeoutRef.current);
    } finally {
      setAdding(false);
    }
  }, [productId, isLoggedIn, max, qty, added, adding]);

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    if (ordering) return;
    if (qty > max) {
      showToast("Jumlah melebihi stok yang tersedia.", "error");
      return;
    }
    setOrdering(true);
    router.push(`/checkout?product=${productId}&qty=${qty}`);
  };

  if (isUnavailable) {
    return (
      <div className="w-full rounded-2xl bg-error-subtle p-4 text-center font-bold text-error border border-error/20">
        Stok Habis (Sold Out)
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Input Jumlah -/+ */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={adding || ordering || qty <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default hover:bg-accent-subtle disabled:opacity-50"
          aria-label="Kurangi"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={Number.isFinite(max) ? max : undefined}
          value={qty}
          onChange={(e) => {
            const val = Number(e.target.value) || 1;
            setQty(Math.max(1, Math.min(Number.isFinite(max) ? max : val, val)));
          }}
          disabled={adding || ordering}
          className="h-8 w-10 border-0 bg-transparent text-center text-sm font-bold text-fg-default focus:outline-none"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={adding || ordering || (Number.isFinite(max) && qty >= max)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default hover:bg-accent-subtle disabled:opacity-50"
          aria-label="Tambah"
        >
          +
        </button>
      </div>

      {/* Buttons: Add to Cart & Order Now */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className={
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-bold transition active:scale-95 disabled:opacity-50 " +
            (added
              ? "border-success bg-success-subtle text-success"
              : "bg-transparent text-primary hover:bg-primary-subtle")
          }
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              Tersimpan ({qty})
            </>
          ) : adding ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Menambahkan...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOrderNow}
          disabled={ordering}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {ordering ? (
            "Memproses..."
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Order Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

