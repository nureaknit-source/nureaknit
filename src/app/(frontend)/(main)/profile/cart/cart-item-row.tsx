"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateCartItemAction, removeFromCartAction } from "@/actions/cart";
import { useCartStore } from "@/stores/cart-store";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice, mediaUrl } from "@/lib/payload/utils";
import type { CartItemWithProduct } from "@/actions/cart";
import { Trash2 } from "lucide-react";

export function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const { product, quantity } = item;
  const [qty, setQty] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPhysical = product.availability === "in_stock";
  const unavailable = product.availability === "unavailable";
  const max =
    unavailable
      ? 0
      : isPhysical && typeof product.stock === "number" && product.stock > 0
        ? product.stock
        : Infinity;

  const dispatchUpdate = () =>
    window.dispatchEvent(new CustomEvent("cart:updated"));

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (next: number) => {
      const clamped = Math.max(1, Math.min(Number.isFinite(max) ? max : next, next));
      if (clamped === qty) return;
      const price = product.price ?? 0;
      const delta = price * (clamped - qty);

      // ponytail: optimistic — subtotal langsung update via store
      setQty(clamped);
      useCartStore.getState().increment(0, delta);

      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { ok, error } = await updateCartItemAction(item.id, clamped);
          if (!ok) throw new Error(error || "Gagal memperbarui kuantitas.");
          dispatchUpdate();
        } catch (err) {
          showToast(
            err instanceof Error ? err.message : "Gagal memperbarui kuantitas",
            "error",
          );
          setQty(quantity);
          useCartStore.getState().increment(0, -delta);
        } finally {
          setLoading(false);
          saveTimeout.current = null;
        }
      }, 500);
    },
    [qty, max, item.id, quantity, product.price],
  );

  useEffect(() => () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
  }, []);

  const handleRemove = useCallback(async () => {
    setConfirmOpen(false);
    const price = product.price ?? 0;

    // ponytail: optimistic — row langsung hilang, badge + subtotal update
    useCartStore.getState().decrement(qty, price * qty);
    setRemoved(true);
    dispatchUpdate();
    showToast(`"${product.title}" dihapus dari keranjang.`, "success");

    try {
      const { ok, error } = await removeFromCartAction(item.id);
      if (!ok) throw new Error(error || "Gagal menghapus.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menghapus",
        "error",
      );
      useCartStore.getState().increment(qty, price * qty);
      setRemoved(false);
    }
  }, [item.id, qty, product.price, product.title]);

  const subtotal = (product.price ?? 0) * qty;
  const imageUrl = product.images?.[0]?.image
    ? mediaUrl(product.images[0].image)
    : null;

  if (removed) return null;

  return (
    <>
      <div className="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5 transition hover:bg-bg-surface-muted/40">
        {/* Product Media & Info: side-by-side on mobile and desktop */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="shrink-0"
          >
            {imageUrl && !imgError ? (
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 overflow-hidden rounded-xl border border-border/60 bg-bg-surface">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 64px, 96px"
                  onError={() => setImgError(true)}
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-xl bg-accent-subtle flex items-center justify-center text-xs font-semibold text-accent">
                Nurea Knit
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${product.slug || product.id}`}
              className="block font-sans text-sm sm:text-base md:text-lg font-bold text-fg-default hover:text-primary transition line-clamp-2 sm:line-clamp-1"
            >
              {product.title}
            </Link>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-primary">
              {formatPrice(product.price ?? 0)}
            </p>
            <div className="mt-1 sm:mt-1.5 flex flex-wrap gap-1.5">
              {unavailable && (
                <Badge variant="error" size="sm">
                  Stok Habis
                </Badge>
              )}
              {product.availability === "pre_order" && (
                <Badge variant="accent" size="sm">
                  Pre-order
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Quantity, Subtotal, Remove */}
        <div className="flex items-center justify-between gap-3 border-t border-border/30 pt-3 sm:border-0 sm:pt-0 sm:justify-end sm:gap-5 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleChange(qty - 1)}
              disabled={loading || qty <= 1 || unavailable}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default transition hover:bg-accent-subtle active:scale-95 disabled:opacity-40"
              aria-label="Kurangi kuantitas"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={Number.isFinite(max) ? max : undefined}
              value={qty}
              onChange={(e) => handleChange(Number(e.target.value) || 1)}
              disabled={loading || unavailable}
              className="h-8 w-10 border-0 bg-transparent text-center text-sm font-bold text-fg-default focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleChange(qty + 1)}
              disabled={loading || (Number.isFinite(max) && qty >= max) || unavailable}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-fg-default transition hover:bg-accent-subtle active:scale-95 disabled:opacity-40"
              aria-label="Tambah kuantitas"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="w-24 sm:w-28 text-right font-extrabold text-sm sm:text-base text-fg-default">
            {formatPrice(subtotal)}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            className="shrink-0 rounded-full p-2 text-fg-muted transition hover:bg-error-subtle hover:text-error active:scale-95 disabled:opacity-40"
            title="Hapus item"
            aria-label={`Hapus ${product.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus Produk?"
        message={`Apakah kamu yakin ingin menghapus "${product.title}" dari keranjang belanja?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}


