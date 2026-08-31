"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startCheckoutAction } from "@/actions/checkout";
import { showToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export interface CheckoutFormProps {
  defaultName?: string;
  productId?: number;
  qty?: number;
}

export function CheckoutForm({ defaultName = "", productId, qty = 1 }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tos, setTos] = useState(false);

  const submit = async () => {
    if (loading) return;
    if (!phone.trim() || !address.trim()) {
      return showToast("Nomor telepon dan alamat pengiriman wajib diisi ya.", "error");
    }
    if (!tos) {
      return showToast("Mohon setujui syarat & ketentuan sebelum melanjutkan.", "error");
    }

    setLoading(true);
    try {
      const result = await startCheckoutAction({ productId, qty, phone, address, notes, tosAccepted: tos });
      if (!result.ok) {
        showToast(result.error || "Checkout gagal, silakan coba lagi.", "error");
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
      showToast(err instanceof Error ? err.message : "Checkout gagal, silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <Input
        id="co-name"
        label="Nama Penerima"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama lengkap penerima"
      />

      <Input
        id="co-phone"
        label="No. Telepon / WhatsApp *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="08xxxxxxxxxx"
        required
      />

      <Textarea
        id="co-address"
        label="Alamat Pengiriman Lengkap *"
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Alamat lengkap (nama jalan, nomor rumah, kecamatan, kota, kode pos)"
        required
      />

      <Textarea
        id="co-notes"
        label="Catatan Pesanan (opsional)"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Warna benang, ukuran, atau instruksi khusus..."
      />

      <label className="flex items-start gap-2.5 text-sm text-fg-secondary cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={tos}
          onChange={(e) => setTos(e.target.checked)}
          className="mt-1 h-4 w-4 rounded accent-primary text-primary focus:ring-primary-subtle"
          required
        />
        <span className="leading-snug">
          Saya menyetujui syarat &amp; ketentuan: pesanan akan segera diproses setelah pembayaran terverifikasi otomatis.
        </span>
      </label>

      <Button
        type="button"
        size="lg"
        onClick={submit}
        isLoading={loading}
        className="w-full mt-4"
      >
        Lanjutkan ke Pembayaran
      </Button>
    </div>
  );
}

