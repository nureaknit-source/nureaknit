"use client";

import { useState } from "react";
import { MessageCircle, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { QrDisplay } from "@/components/checkout/qr-display";
import { CheckStatus } from "@/components/checkout/check-status";
import { showToast } from "@/components/ui/toast";
import { retryPaymentAction } from "@/actions/checkout";
import { buildManualPaymentWaLink } from "@/lib/commerce/whatsapp";
import { formatPrice } from "@/lib/payload/utils";

export interface ManualPaymentFallbackProps {
  order: {
    id: number;
    reference: string;
    total: number;
    customerName?: string | null;
    customerPhone?: string | null;
    customerAddress?: string | null;
    customerNotes?: string | null;
    items?: Array<{ title: string; quantity: number; unitPrice?: number }>;
    paymentQrUrl?: string | null;
    expiresAt?: string | null;
  };
  initialQr?: string | null;
}

export function ManualPaymentFallback({ order, initialQr }: ManualPaymentFallbackProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(initialQr || order.paymentQrUrl || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const waLink = buildManualPaymentWaLink({
    reference: order.reference,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    customerNotes: order.customerNotes,
    items: order.items,
    total: order.total,
  });

  const handleRetry = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await retryPaymentAction(order.reference);
      if (res.ok && res.qrImageUrl) {
        setQrUrl(res.qrImageUrl);
        showToast("Kode QRIS berhasil dibuat! Silakan scan untuk membayar.", "success");
      } else {
        const msg =
          res.error ||
          "Sistem pembayaran otomatis (QRIS) masih belum aktif. Silakan gunakan pembayaran manual via WhatsApp.";
        setErrorMsg(msg);
        showToast(msg, "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal meminta QRIS baru. Silakan hubungi via WhatsApp.";
      setErrorMsg(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (qrUrl) {
    return (
      <div className="space-y-4">
        <QrDisplay reference={order.reference} qr={qrUrl} expiresAt={order.expiresAt ?? undefined} />
        <Card hover={false} className="p-4 text-center bg-bg-surface-hover border-dashed">
          <p className="text-xs text-fg-muted">
            Mengalami kendala saat scan QRIS?{" "}
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline hover:text-primary-hover"
              >
                Bayar via Transfer Bank Manual ke WhatsApp Admin
              </a>
            ) : null}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-6 sm:p-8 border-warning/30 bg-bg-surface shadow-sm">
        {/* Status Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-subtle text-warning">
            <AlertCircle className="h-7 w-7" />
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-subtle/80 px-3 py-1 text-xs font-bold text-fg-default">
            <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            Menunggu Pembayaran Manual
          </span>
          <Heading as="h2" className="mt-3 text-xl sm:text-2xl text-fg-default">
            Pesananmu Berhasil Dibuat!
          </Heading>
          <Text size="sm" className="mt-2 max-w-md text-fg-secondary">
            Stok item untuk pesanan <strong className="text-fg-default">{order.reference}</strong> telah kami amankan.
            Saat ini pembuatan kode QRIS otomatis sedang dalam antrean aktivasi teknis, namun kamu bisa langsung menyelesaikan pembayaran melalui{" "}
            <strong>Transfer Bank Manual</strong>.
          </Text>
        </div>

        {/* Ringkasan Singkat Pesanan */}
        <div className="mt-6 rounded-xl border border-border/80 bg-bg-base/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span>Nomor Pesanan</span>
            <span className="font-mono font-bold text-fg-default">{order.reference}</span>
          </div>
          {order.items && order.items.length > 0 ? (
            <div className="border-t border-border/60 pt-2 space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-fg-secondary">
                  <span>
                    {item.title} <span className="text-fg-muted font-mono">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-fg-default">
                    {item.unitPrice ? formatPrice(item.unitPrice * item.quantity) : "-"}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          <div className="border-t border-border pt-2.5 flex items-center justify-between">
            <span className="text-sm font-bold text-fg-default">Total Tagihan</span>
            <span className="font-sans text-lg font-extrabold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Tombol Aksi Utama */}
        <div className="mt-6 space-y-3">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm transition hover:bg-[#20bd5a] active:scale-[0.99]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Lanjutkan Pesanan Manual via WhatsApp</span>
            </a>
          ) : null}

          <p className="text-center text-xs text-fg-muted">
            Admin kami akan segera memberikan nomor rekening resmi (BCA / Mandiri / dll) dan memproses pesananmu.
          </p>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-border/60" />
            <span className="absolute bg-bg-surface px-3 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              atau coba bayar otomatis
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleRetry}
            isLoading={loading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
            className="w-full"
          >
            Coba Buat Kode Pembayaran (QRIS) Lagi
          </Button>

          {errorMsg ? (
            <div className="rounded-lg bg-warning-subtle/50 p-3 text-xs text-fg-secondary text-center">
              {errorMsg}
            </div>
          ) : null}
        </div>

        {/* Keamanan & Garansi */}
        <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-center gap-2 text-xs text-fg-muted">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Pesanan aman &amp; tercatat resmi di database Nurea Knit</span>
        </div>
      </Card>

      {/* Status Live Tracker */}
      <div className="text-center">
        <CheckStatus reference={order.reference} />
      </div>
    </div>
  );
}
