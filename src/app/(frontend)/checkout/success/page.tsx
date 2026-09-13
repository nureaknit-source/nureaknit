import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { QrDisplay } from "@/components/checkout/qr-display";
import { ManualPaymentFallback } from "@/components/checkout/manual-payment-fallback";
import { getOrderAction } from "@/actions/checkout";
import { getCachedUserSession } from "@/utils/supabase/server";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const refParam = typeof params.ref === "string" ? params.ref : null;
  const preParam = typeof params.pre === "string" ? params.pre : null;
  const reference = refParam || preParam;
  const fallback = params.fallback === "true" || params.fallback === "1";

  // Jika tidak ada reference dalam URL, arahkan pengguna ke daftar pesanan
  if (!reference) {
    redirect("/profile/orders");
  }

  // 1. Auth Guard: Pengguna wajib login untuk melihat detail konfirmasi pesanan
  const user = await getCachedUserSession();
  if (!user) {
    const returnUrl = `/checkout/success?ref=${encodeURIComponent(reference)}${fallback ? "&fallback=1" : ""}`;
    redirect(`/login?redirect=${encodeURIComponent(returnUrl)}`);
  }

  // 2. Server-side ownership validation: getOrderAction hanya mengembalikan order jika userId === session.userId
  let order;
  try {
    order = await getOrderAction(reference);
  } catch {
    notFound();
  }

  // Jika pesanan tidak ditemukan atau bukan milik pengguna yang sedang login, tampilkan 404
  if (!order) {
    notFound();
  }

  const effectiveQr = order.paymentQrUrl || null;
  const isPreOrder = order.type === "pre_order";
  const showFallback = Boolean(fallback || !effectiveQr);

  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">
          {order.status === "paid" ? "Pembayaran Terverifikasi!" : "Pesanan Berhasil Dibuat!"}
        </Heading>
        <Text className="mt-2">
          {isPreOrder
            ? "Pesanan pre-order kamu telah berhasil dicatat. Silakan lakukan konfirmasi ke admin via WhatsApp."
            : order.status === "paid"
            ? "Terima kasih! Pembayaran untuk pesanan ini telah diterima dan sedang diproses."
            : showFallback
            ? "Pesananmu telah aman tercatat di sistem. Silakan lanjutkan konfirmasi pembayaran manual via WhatsApp atau coba buat kode QRIS kembali."
            : "Selesaikan pembayaran dengan scan kode QRIS di bawah ini. Halaman ini akan otomatis memperbarui status begitu pembayaran terverifikasi."}
        </Text>

        <div className="mt-8 space-y-4">
          {isPreOrder ? (
            <div className="rounded-lg border border-accent/20 bg-accent-subtle p-5">
              <p className="font-sans font-bold text-fg-default">
                Pesanan Pre-Order <span className="text-accent">{order.reference}</span>
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Konfirmasi pesananmu via WhatsApp — tombol pembayaran akan aktif segera setelah admin menyetujui pesanan.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER}?text=${encodeURIComponent(
                  `Halo Nurea Knit! Saya ingin mengonfirmasi pre-order saya.\n\nNo. Order: ${order.reference}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90"
              >
                Konfirmasi via WhatsApp
              </a>
            </div>
          ) : order.status === "paid" ? (
            <div className="rounded-lg border border-success/30 bg-success-subtle p-5 text-center">
              <p className="font-sans font-bold text-success">
                Pesanan #{order.reference} Sudah Lunas
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Kami sedang menyiapkan pesananmu. Kamu dapat memantau status pengiriman di halaman pesanan.
              </p>
              <Link
                href={`/profile/orders/${encodeURIComponent(order.reference)}`}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90"
              >
                Lihat Rincian Pesanan
              </Link>
            </div>
          ) : showFallback ? (
            <ManualPaymentFallback
              order={{
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
              }}
              initialQr={effectiveQr}
            />
          ) : effectiveQr ? (
            <div className="space-y-4">
              <QrDisplay reference={order.reference} qr={effectiveQr} expiresAt={order.expiresAt ?? undefined} />
            </div>
          ) : null}
        </div>

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
