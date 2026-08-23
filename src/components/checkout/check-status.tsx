"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/toast";

type Status = "pending_payment" | "paid" | "payment_failed" | "cancelled" | "refunded";

export function CheckStatus({ reference }: { reference: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status | "loading">("loading");
  const stopped = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkout/status?ref=${encodeURIComponent(reference)}`);
      if (!res.ok) return setStatus("pending_payment");
      const data: { status: string } = await res.json();
      if (stopped.current) return;
      setStatus(data.status as Status);
      if (data.status === "paid") {
        showToast("Pembayaran selesai — order akan diproses.", "success");
        setTimeout(() => router.push(`/profile/orders/${reference}`), 1500);
      }
    } catch {
      if (!stopped.current) setStatus("pending_payment");
    }
  }, [reference, router]);

  useEffect(() => {
    stopped.current = false;
    // Defer initial fetch agar tidak setState synchronous-in-effect (react-hooks lint).
    const handle = setTimeout(fetchStatus, 0);
    const interval = setInterval(fetchStatus, 15000);
    return () => {
      clearTimeout(handle);
      clearInterval(interval);
      stopped.current = true;
    };
  }, [fetchStatus]);

  const label =
    status === "loading"
      ? "Memeriksa status pembayaran..."
      : status === "paid"
        ? "Pembayaran berhasil!"
        : status === "pending_payment"
          ? "Menunggu pembayaran..."
          : status;

  return <p className="text-xs text-fg-muted">{label}</p>;
}
