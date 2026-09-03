import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { QrDisplay } from "@/components/checkout/qr-display";
import { CheckStatus } from "@/components/checkout/check-status";
import { ManualPaymentFallback } from "@/components/checkout/manual-payment-fallback";
import { getOrderAction, type OrderDetail } from "@/actions/checkout";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ref = typeof params.ref === "string" ? params.ref : null;
  const pre = typeof params.pre === "string" ? params.pre : null;
  const qr = typeof params.qr === "string" ? params.qr : null;
  const fallback = params.fallback === "true" || params.fallback === "1";

  let order: OrderDetail | null = null;
  let expiresAt: string | undefined;

  if (ref) {
    try {
      order = await getOrderAction(ref);
      if (order?.expiresAt) expiresAt = order.expiresAt;
    } catch {
      /* not logged in or unavailable */
    }
  }

  const effectiveQr = qr || order?.paymentQrUrl || null;
  const showFallback = Boolean(ref && (fallback || !effectiveQr));

  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">Pesanan Berhasil Dibuat!</Heading>
        <Text className="mt-2">
          {showFallback
            ? "Pesananmu telah aman tercatat di sistem. Silakan lanjutkan konfirmasi pembayaran manual via WhatsApp atau coba buat kode QRIS kembali."
            : "Selesaikan pembayaran dengan scan kode QRIS di bawah ini. Halaman ini akan otomatis memperbarui status begitu pembayaran terverifikasi."}
        </Text>

        <div className="mt-8 space-y-4">
          {showFallback && ref ? (
            <ManualPaymentFallback
              order={
                order
                  ? {
                      id: order.id,
                      reference: order.reference,
                      total: order.total,
                      customerName: null,
                      customerPhone: order.customerPhone,
                      customerAddress: order.customerAddress,
                      customerNotes: order.customerNotes,
                      items: order.items.map((i) => ({
                        title: i.title,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                      })),
                      paymentQrUrl: order.paymentQrUrl,
                      expiresAt: order.expiresAt,
                    }
                  : {
                      id: 0,
                      reference: ref,
                      total: 0,
                    }
              }
              initialQr={effectiveQr}
            />
          ) : ref && effectiveQr ? (
            <div className="space-y-4">
              <QrDisplay reference={ref} qr={effectiveQr} expiresAt={expiresAt} />
            </div>
          ) : null}

          {pre && !ref ? (
            <div className="rounded-lg border border-accent/20 bg-accent-subtle p-5">
              <p className="font-sans font-bold text-fg-default">
                Pesanan Pre-Order <span className="text-accent">{pre}</span>
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Konfirmasi pesananmu via WhatsApp — tombol pembayaran akan aktif segera setelah admin menyetujui pesanan.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER}?text=${encodeURIComponent(
                  `Halo Nurea Knit! Saya ingin mengonfirmasi pre-order saya.\n\nNo. Order: ${pre}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90"
              >
                Konfirmasi via WhatsApp
              </a>
            </div>
          ) : null}

          {!ref && !pre ? (
            <p className="text-sm text-fg-muted">Tidak ada detail pesanan dalam parameter. Silakan cek halaman pesanan kamu.</p>
          ) : null}
        </div>

        {ref && !showFallback ? (
          <div className="mt-6 text-center">
            <CheckStatus reference={ref} />
          </div>
        ) : null}

        <div className="mt-8 flex gap-4">
          <Link href="/profile/orders" className="text-sm font-medium text-primary hover:underline">
            Lihat Semua Pesanan Saya
          </Link>
          <span className="text-fg-muted">·</span>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            Lanjut Belanja
          </Link>
        </div>
      </Container>
    </Section>
  );
}
