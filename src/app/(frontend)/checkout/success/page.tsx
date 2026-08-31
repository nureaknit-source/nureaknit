import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { QrDisplay } from "@/components/checkout/qr-display";
import { CheckStatus } from "@/components/checkout/check-status";
import { getOrderAction } from "@/actions/checkout";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ref = typeof params.ref === "string" ? params.ref : null;
  const pre = typeof params.pre === "string" ? params.pre : null;
  const qr = typeof params.qr === "string" ? params.qr : null;

  let expiresAt: string | undefined;
  if (ref) {
    try {
      const order = await getOrderAction(ref);
      if (order?.expiresAt) expiresAt = order.expiresAt;
    } catch {
      /* not logged in or unavailable */
    }
  }

  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">Pesanan Berhasil Dibuat!</Heading>
        <Text className="mt-2">
          Selesaikan pembayaran dengan scan kode QRIS di bawah ini. Halaman ini akan otomatis memperbarui status begitu pembayaran terverifikasi.
        </Text>

        <div className="mt-8 space-y-4">
          {ref && qr ? <QrDisplay reference={ref} qr={qr} expiresAt={expiresAt} /> : null}

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

        {ref ? (
          <div className="mt-6 text-center">
            <CheckStatus reference={ref} />
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          <Link href="/profile/orders" className="text-sm text-primary hover:underline">
            Lihat Semua Pesanan
          </Link>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Lanjut Belanja
          </Link>
        </div>
      </Container>
    </Section>
  );
}
