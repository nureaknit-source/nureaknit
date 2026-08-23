import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
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
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">Order Dibuat</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Order berhasil dibuat. Selesaikan pembayaran di bawah ini. Halaman ini akan otomatis
          memperbarui status saat Midtrans konfirmasi.
        </p>

        <div className="mt-8 space-y-4">
          {ref && qr ? <QrDisplay reference={ref} qr={qr} expiresAt={expiresAt} /> : null}

          {pre && !ref ? (
            <div className="rounded-lg border border-accent/20 bg-accent-subtle p-5">
              <p className="font-sans font-bold text-fg-default">
                Order Pre-Order <span className="text-accent">{pre}</span>
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Kirim konfirmasi via WhatsApp — tombol bayar aktif setelah admin menyetujui.
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
            <p className="text-sm text-fg-muted">Tidak ada order dalam parameter. Cek halaman order kamu.</p>
          ) : null}
        </div>

        {ref ? (
          <div className="mt-6 text-center">
            <CheckStatus reference={ref} />
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          <Link href="/profile/orders" className="text-sm text-primary hover:underline">
            Lihat Semua Order
          </Link>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Lanjut Belanja
          </Link>
        </div>
      </Container>
    </Section>
  );
}
