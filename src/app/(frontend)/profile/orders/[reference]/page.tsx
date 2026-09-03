import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderAction } from "@/actions/checkout";
import { PayNowButton } from "../pay-now-button";
import { ManualPaymentFallback } from "@/components/checkout/manual-payment-fallback";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/payload/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  FULFILLMENT_STATUS_LABELS,
  FULFILLMENT_KIND_LABELS,
} from "@/lib/commerce/labels";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await getOrderAction(reference);
  if (!order) notFound();

  return (
    <Section>
      <Container size="sm">
        <Link
          href="/profile/orders"
          className="mb-4 inline-block text-sm font-semibold text-fg-muted hover:text-primary transition"
        >
          &larr; Kembali ke Pesanan Saya
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Heading as="h1" className="text-2xl sm:text-3xl">
              {order.reference}
            </Heading>
            <p className="mt-1 text-xs sm:text-sm text-fg-muted">
              {ORDER_TYPE_LABELS[order.type]} · Dibuat pada {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant="accent" size="md">
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
        </div>

        {order.status === "pending_approval" || order.status === "approved" ? (
          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent-subtle p-5 text-sm text-fg-default">
            <p className="font-bold text-fg-default">Pre-order membutuhkan konfirmasi admin.</p>
            <p className="mt-1 text-fg-secondary">
              Kirim konfirmasi via WhatsApp — tombol pembayaran akan aktif setelah pesanan disetujui admin.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER}?text=${encodeURIComponent(
                `Halo Nurea Knit! Saya ingin mengonfirmasi pre-order saya.\n\nNo. Order: ${order.reference}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-fg shadow-sm transition hover:opacity-90 active:scale-95"
            >
              Konfirmasi via WhatsApp
            </a>
            {order.status === "approved" ? <PayNowButton orderId={order.id} /> : null}
          </div>
        ) : null}

        {order.status === "pending_payment" ? (
          <div className="mt-6">
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
              initialQr={order.paymentQrUrl}
            />
          </div>
        ) : null}

        <Heading as="h3" className="mt-10 text-lg">
          Detail Item
        </Heading>
        <Card padding="none" hover={false} className="mt-3 overflow-hidden">
          <ul className="flex flex-col divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="font-sans font-bold text-fg-default">{item.title}</p>
                  <p className="text-sm text-fg-muted">
                    {item.quantity}x · {formatPrice(item.unitPrice)}
                  </p>
                  {item.promisedEstimate ? (
                    <p className="text-xs text-fg-muted mt-0.5">Estimasi: {item.promisedEstimate}</p>
                  ) : null}
                </div>
                <p className="font-bold text-fg-default">{formatPrice(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="sm" hover={false} className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-fg-muted">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-fg-default pt-1 border-t border-border/50">
            <span>Total</span>
            <span className="text-base text-primary">{formatPrice(order.total)}</span>
          </div>
        </Card>

        <Heading as="h3" className="mt-10 text-lg">
          Informasi Pengiriman
        </Heading>
        <Card padding="sm" hover={false} className="mt-3 space-y-2 text-sm">
          <p className="text-fg-muted">
            No. Telepon / WA: <span className="font-semibold text-fg-default">{order.customerPhone || "-"}</span>
          </p>
          <p className="text-fg-muted">
            Alamat: <span className="font-semibold text-fg-default">{order.customerAddress || "-"}</span>
          </p>
          {order.customerNotes ? (
            <p className="text-fg-muted">
              Catatan: <span className="font-semibold text-fg-default">{order.customerNotes}</span>
            </p>
          ) : null}
          <p className="text-fg-muted">
            Syarat &amp; Ketentuan: <span className="font-semibold text-fg-default">{order.tosAccepted ? "Disetujui" : "-"}</span>{" "}
            (<Link href="/terms" className="text-primary underline hover:text-primary-hover">Lihat Ketentuan</Link>)
          </p>
          <p className="text-fg-muted">
            Kebijakan Retur:{" "}
            <Link href="/refund" className="text-primary underline hover:text-primary-hover">
              Garansi 1x24 Jam dengan Video Unboxing
            </Link>
          </p>
        </Card>

        <Heading as="h3" className="mt-10 text-lg">
          Pengiriman &amp; Status Rilis
        </Heading>
        <Card padding="none" hover={false} className="mt-3 overflow-hidden">
          <ul className="flex flex-col divide-y divide-border">
            {order.groups.length === 0 ? (
              <li className="px-5 py-4 text-sm text-fg-muted">
                Belum ada data pengiriman — informasi akan diperbarui otomatis setelah pembayaran terverifikasi.
              </li>
            ) : (
              order.groups.map((group) => (
                <li key={group.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div>
                    <p className="font-sans font-bold text-fg-default">
                      {FULFILLMENT_KIND_LABELS[group.kind] ?? group.kind}
                    </p>
                    <p className="text-sm text-fg-muted">
                      {group.estimate ? `Estimasi: ${group.estimate}` : "Estimasi menyusul"}
                      {group.trackingNumber ? ` · No. resi: ${group.trackingNumber}` : ""}
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    {FULFILLMENT_STATUS_LABELS[group.status] ?? group.status}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}