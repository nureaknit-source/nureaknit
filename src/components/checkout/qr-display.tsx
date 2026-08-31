"use client";

import { Countdown } from "@/components/checkout/countdown";
import { CheckStatus } from "@/components/checkout/check-status";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Download } from "lucide-react";

export interface QrDisplayProps {
  reference: string;
  qr: string;
  expiresAt?: string;
}

export function QrDisplay({ reference, qr, expiresAt }: QrDisplayProps) {
  const downloadHref = `/api/qris/download?url=${encodeURIComponent(qr)}`;

  return (
    <Card hover={false} className="p-6 text-center">
      <Heading as="h3" className="text-lg">
        Order <span className="text-accent">{reference}</span>
      </Heading>
      <Text size="sm" className="mt-1">
        Scan kode QRIS di bawah ini menggunakan m-banking atau e-wallet pilihanmu (berlaku selama{" "}
        <Countdown className="inline font-bold text-accent" expiresAt={expiresAt} />
        ).
      </Text>
      <div className="my-5 flex justify-center">
        <img
          src={qr}
          alt={`QRIS ${reference}`}
          className="h-64 w-64 rounded-2xl border border-border object-contain bg-white p-2 shadow-xs"
        />
      </div>
      <div className="flex gap-2 justify-center">
        <a
          href={downloadHref}
          download={`qris-${reference}.png`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-surface px-4 py-2 text-xs font-bold text-fg-default shadow-xs transition hover:border-accent hover:text-accent hover:bg-accent-subtle active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Unduh QRIS</span>
        </a>
      </div>
      <Text size="sm" className="mt-3 text-xs text-fg-secondary">
        Screenshot atau simpan gambar QRIS di atas untuk discan langsung dari aplikasi e-wallet atau mobile banking favoritmu.
      </Text>
      <div className="mt-4 rounded-xl border border-border/60 bg-bg-surface-muted p-2.5 text-center">
        <CheckStatus reference={reference} />
      </div>
    </Card>
  );
}

