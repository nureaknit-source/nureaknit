"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  ShoppingBag,
  MapPin,
  Clock,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  FileText,
} from "lucide-react";
import { Countdown } from "@/components/checkout/countdown";
import { CheckStatus } from "@/components/checkout/check-status";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { formatPrice } from "@/lib/payload/utils";
import { showToast } from "@/components/ui/toast";
import { buildManualPaymentWaLink } from "@/lib/commerce/whatsapp";

export interface QrOrderItem {
  id?: number | string;
  title: string;
  quantity: number;
  unitPrice?: number;
}

export interface QrDisplayProps {
  reference: string;
  qr: string;
  expiresAt?: string;
  total?: number;
  subtotal?: number;
  items?: QrOrderItem[];
  customerPhone?: string | null;
  customerAddress?: string | null;
  customerNotes?: string | null;
}

export function QrDisplay({
  reference,
  qr,
  expiresAt,
  total,
  subtotal,
  items = [],
  customerPhone,
  customerAddress,
  customerNotes,
}: QrDisplayProps) {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<"mobile" | "desktop">("mobile");

  const downloadHref = `/api/qris/download?url=${encodeURIComponent(qr)}`;

  const copyToClipboard = async (text: string, type: "ref" | "total") => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (type === "ref") {
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2000);
        showToast("Nomor pesanan berhasil disalin!", "success");
      } else {
        setCopiedTotal(true);
        setTimeout(() => setCopiedTotal(false), 2000);
        showToast("Nominal pembayaran berhasil disalin!", "success");
      }
    } catch {
      showToast("Gagal menyalin teks ke clipboard.", "error");
    }
  };

  const waLink = buildManualPaymentWaLink({
    reference,
    customerPhone,
    customerAddress,
    customerNotes,
    items,
    total: total ?? 0,
  });

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const effectiveSubtotal =
    subtotal ??
    items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * (item.quantity || 1), 0);
  const formattedTotal = total !== undefined ? formatPrice(total) : null;

  return (
    <div className="space-y-6">
      {/* 1. Header Ringkasan Pembayaran (Highlight Total & Timer) */}
      <Card hover={false} className="overflow-hidden border-border/80 bg-bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold text-fg-default">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Menunggu Pembayaran
            </span>
            <span className="text-xs text-fg-muted">QRIS Dinamis</span>
          </div>

          {expiresAt ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface-hover border border-border/60 px-3 py-1 text-xs text-fg-secondary">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>Selesaikan dalam:</span>
              <Countdown className="font-mono font-bold text-accent" expiresAt={expiresAt} />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-fg-muted">
              Total Pembayaran
            </span>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-sans text-2xl sm:text-3xl font-extrabold text-fg-default tracking-tight">
                {formattedTotal || "Menghitung..."}
              </span>
              {total !== undefined ? (
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(total), "total")}
                  title="Salin nominal angka"
                  className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-bg-surface-hover px-2 py-1 text-[11px] font-semibold text-fg-secondary hover:border-accent hover:text-accent transition active:scale-95"
                >
                  {copiedTotal ? (
                    <>
                      <Check className="h-3 w-3 text-success" />
                      <span className="text-success">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end items-start justify-between border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
            <span className="text-xs font-medium text-fg-muted">No. Pesanan</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-sm sm:text-base font-bold text-primary">
                {reference}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(reference, "ref")}
                title="Salin nomor pesanan"
                className="p-1 rounded-md text-fg-muted hover:text-fg-default hover:bg-bg-surface-active transition"
              >
                {copiedRef ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Grid Utama: Kolom Kiri (QR & Bayar) + Kolom Kanan (Rincian Pesanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: Kartu QRIS & Aksi */}
        <div className="lg:col-span-7 space-y-6">
          <Card hover={false} className="p-6 text-center border-border/80 bg-bg-surface shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-full bg-primary-subtle px-3 py-0.5 text-[11px] font-bold text-fg-default uppercase tracking-wider">
                QRIS Standar Nasional
              </span>
            </div>

            <Heading as="h3" className="mt-2 text-lg sm:text-xl font-bold text-fg-default">
              Scan untuk Membayar
            </Heading>
            <Text size="sm" className="mt-1 text-xs sm:text-sm text-fg-secondary max-w-sm mx-auto">
              Gunakan aplikasi mobile banking (BCA, Mandiri, BRI, dll) atau e-wallet (GoPay, OVO, DANA, ShopeePay) pilihanmu.
            </Text>

            {/* Gambar QRIS */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="relative rounded-2xl border border-border/80 bg-white p-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr}
                  alt={`QRIS Pembayaran Nurea Knit ${reference}`}
                  className="h-56 w-56 sm:h-64 sm:w-64 object-contain"
                />
              </div>

              <span className="mt-2 text-[11px] text-fg-muted font-medium">
                Merchant: <strong className="text-fg-default font-semibold">Nurea Knit</strong>
              </span>
            </div>

            {/* Tombol Unduh QRIS */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={downloadHref}
                download={`qris-${reference}.png`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-5 py-2.5 text-xs sm:text-sm font-bold text-fg-default shadow-xs transition hover:border-accent hover:text-accent hover:bg-accent-subtle active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Gambar QRIS</span>
              </a>
            </div>

            {/* Tip Khusus Pengguna Smartphone */}
            <div className="mt-5 rounded-xl border border-border/60 bg-bg-surface-hover/80 p-3.5 text-left text-xs text-fg-secondary">
              <div className="flex items-start gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-fg-default font-semibold">Membuka di smartphone ini?</strong> Unduh gambar QRIS di atas, lalu buka aplikasi e-wallet / mobile banking kamu dan pilih menu <span className="font-semibold text-fg-default">Scan &gt; Ambil dari Galeri</span>.
                </p>
              </div>
            </div>

            {/* Status Auto-Checker */}
            <div className="mt-4 rounded-xl border border-border/50 bg-bg-surface-muted p-3 text-center">
              <CheckStatus reference={reference} />
            </div>
          </Card>

          {/* Panduan Langkah Pembayaran Praktis */}
          <Card hover={false} className="p-5 border-border/70 bg-bg-surface shadow-xs">
            <button
              type="button"
              onClick={() => setGuideOpen(!guideOpen)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-fg-default">
                  Petunjuk Cara Membayar QRIS
                </span>
              </div>
              {guideOpen ? (
                <ChevronUp className="h-4 w-4 text-fg-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-fg-muted" />
              )}
            </button>

            {guideOpen ? (
              <div className="mt-4 pt-3 border-t border-border/60">
                {/* Tab Switcher */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveGuideTab("mobile")}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      activeGuideTab === "mobile"
                        ? "bg-accent-subtle text-fg-default border border-accent/40"
                        : "bg-bg-surface-hover text-fg-muted border border-border/40 hover:text-fg-default"
                    }`}
                  >
                    Bayar di HP yang Sama
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGuideTab("desktop")}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      activeGuideTab === "desktop"
                        ? "bg-accent-subtle text-fg-default border border-accent/40"
                        : "bg-bg-surface-hover text-fg-muted border border-border/40 hover:text-fg-default"
                    }`}
                  >
                    Scan dari Layar / Komputer
                  </button>
                </div>

                {activeGuideTab === "mobile" ? (
                  <ol className="space-y-2 text-xs text-fg-secondary list-decimal list-inside leading-relaxed">
                    <li>Klik tombol <strong>Unduh Gambar QRIS</strong> di atas (atau ambil screenshot kode QR).</li>
                    <li>Buka aplikasi m-Banking (BCA, Mandiri, BRImo, dll) atau e-Wallet (GoPay, OVO, Dana, ShopeePay).</li>
                    <li>Pilih menu <strong>QRIS / Scan</strong>, lalu ketuk ikon <strong>Galeri / Foto</strong>.</li>
                    <li>Pilih gambar QRIS yang baru saja diunduh.</li>
                    <li>Pastikan nama merchant adalah <strong>Nurea Knit</strong> dan nominal sesuai ({formattedTotal || "Rp"}).</li>
                    <li>Masukkan PIN transaksi kamu untuk menyelesaikan pembayaran.</li>
                  </ol>
                ) : (
                  <ol className="space-y-2 text-xs text-fg-secondary list-decimal list-inside leading-relaxed">
                    <li>Buka aplikasi m-Banking atau e-Wallet di smartphone kamu.</li>
                    <li>Pilih menu <strong>QRIS / Scan</strong>.</li>
                    <li>Arahkan kamera smartphone ke kode QR yang muncul di layar laptop / komputer ini.</li>
                    <li>Periksa nama merchant (<strong>Nurea Knit</strong>) dan nominal pembayaran.</li>
                    <li>Masukkan PIN untuk menyelesaikan transaksi. Halaman ini akan otomatis terverifikasi!</li>
                  </ol>
                )}
              </div>
            ) : null}
          </Card>
        </div>

        {/* KOLOM KANAN: Rincian Pesanan & Alamat */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Rincian Barang yang Dibayar */}
          <Card hover={false} className="p-5 sm:p-6 border-border/80 bg-bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-accent" />
                <h4 className="font-sans text-sm sm:text-base font-bold text-fg-default">
                  Rincian Pesanan
                </h4>
              </div>
              {totalQuantity > 0 ? (
                <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-bold text-fg-default">
                  {totalQuantity} {totalQuantity > 1 ? "items" : "item"}
                </span>
              ) : null}
            </div>

            {/* List Barang */}
            <div className="divide-y divide-border/60 py-1">
              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={item.id ?? idx} className="py-3 flex items-start justify-between gap-3 text-xs sm:text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-fg-default line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {item.quantity}x {item.unitPrice ? formatPrice(item.unitPrice) : ""}
                      </p>
                    </div>
                    <span className="font-bold text-fg-default shrink-0">
                      {item.unitPrice ? formatPrice(item.unitPrice * item.quantity) : "-"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-fg-muted">
                  Detail item pesanan #{reference}
                </div>
              )}
            </div>

            {/* Subtotal & Total Breakdown */}
            <div className="border-t border-border/70 pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Subtotal Produk</span>
                <span className="font-medium text-fg-default">
                  {formatPrice(effectiveSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Biaya Layanan / Admin</span>
                <span className="text-success font-medium">Gratis</span>
              </div>
              <div className="border-t border-dashed border-border/80 pt-2.5 flex items-center justify-between">
                <span className="font-bold text-fg-default">Total Tagihan</span>
                <span className="font-sans text-base sm:text-lg font-extrabold text-primary">
                  {formattedTotal || formatPrice(effectiveSubtotal)}
                </span>
              </div>
            </div>
          </Card>

          {/* Card Informasi Pengiriman */}
          {customerPhone || customerAddress || customerNotes ? (
            <Card hover={false} className="p-5 border-border/80 bg-bg-surface shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                <MapPin className="h-4 w-4 text-accent" />
                <h4 className="font-sans text-sm font-bold text-fg-default">
                  Tujuan Pengiriman
                </h4>
              </div>

              {customerPhone ? (
                <div className="text-xs">
                  <span className="text-fg-muted">No. Telepon / WhatsApp:</span>
                  <p className="font-semibold text-fg-default mt-0.5">{customerPhone}</p>
                </div>
              ) : null}

              {customerAddress ? (
                <div className="text-xs">
                  <span className="text-fg-muted">Alamat Pengiriman:</span>
                  <p className="text-fg-secondary mt-0.5 leading-relaxed">{customerAddress}</p>
                </div>
              ) : null}

              {customerNotes ? (
                <div className="rounded-lg bg-bg-surface-hover p-2.5 text-xs text-fg-secondary">
                  <div className="flex items-center gap-1 text-fg-muted font-medium mb-0.5">
                    <FileText className="h-3 w-3" />
                    <span>Catatan Pesanan:</span>
                  </div>
                  <p className="italic text-fg-default">{customerNotes}</p>
                </div>
              ) : null}
            </Card>
          ) : null}

          {/* Card Bantuan WhatsApp & Garansi */}
          <Card hover={false} className="p-4 border-dashed border-border/80 bg-bg-surface-hover/60 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-fg-default">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Transaksi Aman &amp; Terverifikasi</span>
            </div>
            <p className="text-[11px] text-fg-muted leading-relaxed">
              Mengalami kendala scan QRIS atau ingin konfirmasi manual ke admin?
            </p>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Hubungi WhatsApp Admin Nurea Knit</span>
              </a>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

