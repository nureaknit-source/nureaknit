"use client";

import { useState, useCallback, useRef } from "react";
import { addItemToCartAction } from "@/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { showToast } from "@/components/ui/toast";
import { ShoppingCart, Check } from "lucide-react";

export interface CartButtonProps {
  productId: number;
  isLoggedIn: boolean;
  inCart?: boolean;
  className?: string;
}

export function CartButton({
  productId,
  isLoggedIn,
  inCart = false,
  className = "",
}: CartButtonProps) {
  const [added, setAdded] = useState(inCart);
  const [loading, setLoading] = useState(false);
  const [pop, setPop] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleAdd = useCallback(async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    if (added) {
      window.location.href = "/profile/cart";
      return;
    }

    setLoading(true);
    // ponytail: optimistic — badge + button state langsung update
    useCartStore.getState().increment(1, 0);
    setAdded(true);
    setPop(true);
    showToast("Ditambahkan ke keranjang", "success");
    window.dispatchEvent(new CustomEvent("cart:updated"));
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPop(false), 400);

    try {
      const { ok, error } = await addItemToCartAction(productId, 1);
      if (!ok) throw new Error(error || "Gagal menambahkan ke keranjang.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menambahkan ke keranjang",
        "error",
      );
      useCartStore.getState().decrement(1, 0);
      setAdded(false);
      clearTimeout(timeoutRef.current);
    } finally {
      setLoading(false);
    }
  }, [added, productId, isLoggedIn]);

  if (added) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={
          "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-success-subtle px-4 py-2.5 text-sm font-bold text-success border border-success/30 transition hover:opacity-90 active:scale-95 " +
          (pop ? "animate-cart-pop " : "") +
          className
        }
        title="Lihat keranjang"
      >
        <Check className="h-4 w-4" />
        <span>In Cart</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={loading}
      className={
        "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50 " +
        (pop ? "animate-cart-pop " : "") +
        className
      }
      title="Add to cart"
    >
      <ShoppingCart className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      <span>{loading ? "Menambahkan..." : "Add to Cart"}</span>
    </button>
  );
}

