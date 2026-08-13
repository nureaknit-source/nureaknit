"use client";

import { useState, useCallback, useRef } from "react";
import { addItemToCartAction } from "@/actions/cart";
import { showToast } from "@/components/ui/toast";
import { ShoppingCart, Check } from "lucide-react";

interface Props {
  productId: number;
  isLoggedIn: boolean;
  maxStock?: number | null;
  availability?: string;
}

export function AddToCartForm({ productId, isLoggedIn, maxStock = null, availability }: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [addedQty, setAddedQty] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isPhysical = availability === "in_stock";
  const max = isPhysical && typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;

  const handleAdd = useCallback(async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    const requested = Math.min(1, max);
    if (requested > max) {
      showToast("Jumlah melebihi stok.", "error");
      return;
    }
    setLoading(true);
    try {
      const { ok, error } = await addItemToCartAction(productId, requested);
      if (!ok) throw new Error(error || "Gagal menambahkan ke keranjang.");
      setAdded(true);
      setAddedQty(requested);
      showToast("Ditambahkan ke keranjang", "success");
      window.dispatchEvent(new CustomEvent("cart:updated"));
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menambahkan ke keranjang",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [productId, isLoggedIn, max]);

  const isAdded = added && !loading;

  return (
    <div aria-live="polite">
      {/* Desktop: full Add to Cart */}
      <div className="hidden lg:block">
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className={
          "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50 " +
          (isAdded
            ? "bg-success-subtle text-success-fg animate-cart-pop"
            : "bg-primary text-primary-fg")
        }
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added {addedQty} to Cart
          </>
        ) : loading ? (
          <>
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Adding…
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </button>
      </div>

      {/* Mobile: icon-only cart, outline (not filled) */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        aria-label="Add to cart"
        className={
          "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-transparent text-fg-default transition hover:border-accent hover:text-accent active:scale-95 disabled:opacity-50 lg:hidden " +
          (isAdded ? "animate-cart-pop border-success text-success" : "")
        }
      >
        {isAdded ? (
          <Check className="h-5 w-5" />
        ) : loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
