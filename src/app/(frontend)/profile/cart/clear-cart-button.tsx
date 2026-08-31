"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { clearCartAction } from "@/actions/cart";
import { showToast } from "@/components/ui/toast";
import { useCartStore } from "@/stores/cart-store";
import { Trash2 } from "lucide-react";

export function ClearCartButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    try {
      const { ok, error } = await clearCartAction();
      if (!ok) throw new Error(error || "Gagal mengosongkan keranjang.");
      useCartStore.getState().reset();
      showToast("Keranjang berhasil dikosongkan.", "success");
      setOpen(false);
      window.dispatchEvent(new CustomEvent("cart:updated"));
      window.location.reload();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengosongkan keranjang", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        leftIcon={<Trash2 className="h-4 w-4" />}
        className="text-error hover:bg-error-subtle hover:text-error"
      >
        Kosongkan Keranjang
      </Button>

      <ConfirmDialog
        open={open}
        title="Kosongkan Keranjang?"
        message="Semua item di keranjang belanja akan dihapus. Kamu yakin ingin melanjutkan?"
        confirmLabel="Ya, Kosongkan"
        cancelLabel="Batal"
        variant="danger"
        isLoading={loading}
        onConfirm={handleClear}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
