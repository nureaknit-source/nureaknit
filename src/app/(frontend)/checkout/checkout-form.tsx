"use client";

import { useState } from "react";
import Link from "next/link";
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

  const cleanDigits = phone.replace(/\D/g, "");
  const isPhoneValid = cleanDigits.length >= 9 && cleanDigits.length <= 15;
  const isAddressValid = address.trim().length >= 5;
  const isFormValid = isPhoneValid && isAddressValid && tos;

  const submit = async () => {
    if (loading || !isFormValid) return;
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
        if (result.inStock.paymentPendingFallback || !result.inStock.qrImageUrl) {
          router.push(
            `/checkout/success?ref=${encodeURIComponent(result.inStock.reference)}&fallback=1`,
          );
        } else {
          router.push(
            `/checkout/success?ref=${encodeURIComponent(result.inStock.reference)}&qr=${encodeURIComponent(result.inStock.qrImageUrl)}`,
          );
        }
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
        type="tel"
        inputMode="numeric"
        label="No. Telepon / WhatsApp *"
        value={phone}
        onChange={(e) => {
          // Hanya izinkan angka dan tanda '+' di awal (untuk kode negara)
          const val = e.target.value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
          setPhone(val);
        }}
        placeholder="08xxxxxxxxxx"
        required
        maxLength={16}
        error={
          phone.length > 0 && !isPhoneValid
            ? "Masukkan 9–15 digit angka nomor WhatsApp yang valid."
            : undefined
        }
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
          Saya menyetujui{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            Syarat &amp; Ketentuan
          </Link>
          ,{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            Kebijakan Privasi
          </Link>
          , serta{" "}
          <Link
            href="/refund"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            Kebijakan Pengembalian
          </Link>{" "}
          Nurea Knit.
        </span>
      </label>

      <Button
        type="button"
        size="lg"
        onClick={submit}
        isLoading={loading}
        disabled={!isFormValid || loading}
        className="w-full mt-4"
      >
        Lanjutkan ke Pembayaran
      </Button>

      {!isFormValid && (
        <p className="text-center text-xs text-fg-muted mt-2">
          {!isPhoneValid || !isAddressValid
            ? "Lengkapi nomor telepon dan alamat pengiriman"
            : "Centang persetujuan syarat & ketentuan"}{" "}
          untuk melanjutkan ke pembayaran.
        </p>
      )}
    </div>
  );
}

