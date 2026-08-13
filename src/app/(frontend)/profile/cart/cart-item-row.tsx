"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updateCartItemAction, removeFromCartAction } from "@/actions/cart";
import { showToast } from "@/components/ui/toast";
import { formatPrice, mediaUrl } from "@/lib/payload/utils";
import type { CartItemWithProduct } from "@/actions/cart";
import { Trash2 } from "lucide-react";

export function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const { product, quantity } = item;
  const router = useRouter();
  const [qty, setQty] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isPhysical = product.availability === "in_stock";
  const max =
    isPhysical && typeof product.stock === "number" && product.stock > 0
      ? product.stock
      : Infinity;

  const dispatchUpdate = () =>
    window.dispatchEvent(new CustomEvent("cart:updated"));

  const handleChange = useCallback(
    async (next: number) => {
      const clamped = Math.max(1, Math.min(max, next));
      if (clamped === qty) return;
      setQty(clamped);
      setLoading(true);
      try {
        const { ok, error } = await updateCartItemAction(item.id, clamped);
        if (!ok) throw new Error(error || "Gagal memperbarui kuantitas.");
        dispatchUpdate();
        router.refresh();
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Gagal memperbarui kuantitas",
          "error",
        );
        setQty(quantity);
      } finally {
        setLoading(false);
      }
    },
    [qty, max, item.id, quantity, router],
  );

  const handleRemove = useCallback(async () => {
    if (!confirm("Hapus produk ini dari keranjang?")) return;
    setLoading(true);
    try {
      const { ok, error } = await removeFromCartAction(item.id);
      if (!ok) throw new Error(error || "Gagal menghapus.");
      dispatchUpdate();
      router.refresh();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menghapus",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [item.id, router]);

  const subtotal = (product.price ?? 0) * qty;
  const imageUrl = product.images?.[0]?.image
    ? mediaUrl(product.images[0].image)
    : null;

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
      <Link
        href={`/products/${product.slug || product.id}`}
        className="flex-shrink-0"
      >
        {imageUrl && !imgError ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg sm:h-20 sm:w-20">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="80px"
              onError={() => setImgError(true)}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-lg bg-accent-subtle sm:h-20 sm:w-20" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.slug || product.id}`}
          className="block font-sans text-lg font-bold text-fg-default hover:text-primary"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-sm text-fg-muted">
          {formatPrice(product.price ?? 0)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleChange(qty - 1)}
            disabled={loading || qty <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default hover:bg-accent-subtle disabled:opacity-50"
            aria-label="Kurangi"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={typeof max === "number" && isFinite(max) ? max : undefined}
            value={qty}
            onChange={(e) => handleChange(Number(e.target.value) || 1)}
            disabled={loading}
            className="h-8 w-10 border-0 text-center text-sm font-bold text-fg-default focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleChange(qty + 1)}
            disabled={loading || qty >= max}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default hover:bg-accent-subtle disabled:opacity-50"
            aria-label="Tambah"
          >
            +
          </button>
        </div>

        <div className="w-24 text-right font-bold text-fg-default">
          {formatPrice(subtotal)}
        </div>

        <button
          type="button"
          onClick={handleRemove}
          disabled={loading}
          className="flex-shrink-0 rounded-full p-1.5 text-fg-muted transition hover:bg-error-subtle hover:text-error disabled:opacity-50"
          title="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
