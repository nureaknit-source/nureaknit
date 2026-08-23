"use client";

import { Countdown } from "@/components/checkout/countdown";
import { CheckStatus } from "@/components/checkout/check-status";

export function QrDisplay({ reference, qr, expiresAt }: { reference: string; qr: string; expiresAt?: string }) {
  const downloadHref = `/api/qris/download?url=${encodeURIComponent(qr)}`;

  return (
    <div className="rounded-lg border border-border p-5 text-center">
      <p className="font-sans font-bold text-fg-default">
        Order <span className="text-accent">{reference}</span>
      </p>
      <p className="mt-1 text-sm text-fg-muted">
        Scan QRIS di bawah ini (berlaku selama{" "}
        <Countdown className="inline font-medium text-accent" expiresAt={expiresAt} />
        ) agar stok dikirim.
      </p>
      <img
        src={qr}
        alt={`QRIS ${reference}`}
        className="mx-auto my-4 h-64 w-64 rounded-lg border border-border object-contain bg-white"
      />
      <div className="mt-2 flex gap-2 justify-center">
        <a
          href={downloadHref}
          download={`qris-${reference}.png`}
          className="inline-flex items-center justify-center rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent-subtle"
        >
          Unduh QRIS
        </a>
      </div>
      <p className="mt-2 text-xs text-fg-secondary">
        Piontahan gambar di atas untuk memindai QRIS dengan aplikasi QRIS/e-wallet.
      </p>
      <div className="mt-2 rounded border border-border/40 p-2 text-center">
        <CheckStatus reference={reference} />
      </div>
    </div>
  );
}
