"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startCheckoutAction } from "@/actions/checkout";
import { showToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface Props {
  defaultName?: string;
  productId?: number;
  qty?: number;
}

export function CheckoutForm({ defaultName = "", productId, qty = 1 }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tos, setTos] = useState(false);

  const submit = async () => {
    if (loading) return;
    if (!phone.trim() || !address.trim()) return showToast("No. telepon dan alamat wajib diisi.", "error");
    if (!tos) return showToast("Anda harus menyetujui syarat & ketentuan.", "error");

    setLoading(true);
    try {
      const result = await startCheckoutAction({ productId, qty, phone, address, notes, tosAccepted: tos });
      if (!result.ok) {
        showToast(result.error || "Checkout gagal, coba lagi.", "error");
        return;
      }
      if (result.inStock) {
        router.push(
          `/checkout/success?ref=${encodeURIComponent(result.inStock.reference)}&qr=${encodeURIComponent(result.inStock.qrImageUrl)}`,
        );
      } else if (result.preOrder) {
        router.push(`/checkout/success?pre=${encodeURIComponent(result.preOrder.reference)}`);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Checkout gagal, coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-fg-default focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <div className="mt-8 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-bold text-fg-default" htmlFor="co-name">
          Nama Penerima
        </label>
        <input id="co-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-fg-default" htmlFor="co-phone">
          No. Telepon / WhatsApp *
        </label>
        <input id="co-phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-fg-default" htmlFor="co-address">
          Alamat Pengiriman *
        </label>
        <textarea id="co-address" className={inputClass} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-fg-default" htmlFor="co-notes">
          Catatan (opsional)
        </label>
        <textarea id="co-notes" className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Warna, ukuran, dll" />
      </div>

      <label className="flex items-start gap-2 text-sm text-fg-secondary">
        <input type="checkbox" checked={tos} onChange={(e) => setTos(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" required />
        <span>
          Saya menyetujui syarat &amp; ketentuan: pesanan akan diproses setelah pembayaran diverifikasi Midtrans.
        </span>
      </label>

      <Button type="button" onClick={submit} disabled={loading} className="w-full">
        {loading ? "Memproses..." : "Lanjutkan ke Pembayaran"}
      </Button>
    </div>
  );
}
