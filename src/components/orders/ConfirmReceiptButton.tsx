"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast";
import { CheckCheck } from "lucide-react";

export interface ConfirmReceiptButtonProps {
  fulfillmentGroupId: number;
}

export function ConfirmReceiptButton({ fulfillmentGroupId }: ConfirmReceiptButtonProps) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setDialogOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/fulfillments/${fulfillmentGroupId}/confirm-receipt`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal melakukan konfirmasi penerimaan.");
      }

      showToast("Penerimaan paket berhasil dikonfirmasi!", "success");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal melakukan konfirmasi";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="success"
        size="sm"
        isLoading={loading}
        leftIcon={<CheckCheck className="h-4 w-4" />}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDialogOpen(true);
        }}
      >
        Konfirmasi Diterima
      </Button>

      <ConfirmDialog
        open={dialogOpen}
        title="Konfirmasi Penerimaan"
        message="Apakah kamu yakin pesanan ini sudah sampai dan diterima dengan baik?"
        confirmLabel="Ya, Sudah Diterima"
        cancelLabel="Batal"
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}

