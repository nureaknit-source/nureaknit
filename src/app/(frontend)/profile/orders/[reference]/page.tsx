import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderAction } from "@/actions/checkout";
import { PayNowButton } from "../pay-now-button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
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
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Semua Order
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-sans text-3xl font-extrabold text-fg-default">{order.reference}</h1>
            <p className="mt-1 text-sm text-fg-muted">
              {ORDER_TYPE_LABELS[order.type]} · dibuat {formatDate(order.createdAt)}
            </p>
          </div>
          <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-bold text-accent">
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>

        {order.status === "pending_approval" || order.status === "approved" ? (
          <div className="mt-6 rounded-lg border border-accent/20 bg-accent-subtle p-4 text-sm text-fg-default">
            <p className="font-bold">Pre-order butuh konfirmasi admin.</p>
            <p className="mt-1 text-fg-secondary">
              Kirim konfirmasi via WhatsApp — setelah disetujui, tombol pembayaran akan aktif.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER}?text=${encodeURIComponent(
                `Halo Nurea Knit! Saya ingin mengonfirmasi pre-order saya.\n\nNo. Order: ${order.reference}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90"
            >
              Konfirmasi via WhatsApp
            </a>
            {order.status === "approved" ? <PayNowButton orderId={order.id} /> : null}
          </div>
        ) : null}

        <h2 className="mt-10 font-sans text-lg font-bold text-fg-default">Item</h2>
        <ul className="mt-3 flex flex-col divide-y divide-border rounded-lg border border-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="font-sans font-bold text-fg-default">{item.title}</p>
                <p className="text-sm text-fg-muted">
                  {item.quantity}x · {formatPrice(item.unitPrice)}
                </p>
                {item.promisedEstimate ? (
                  <p className="text-xs text-fg-muted">Estimasi: {item.promisedEstimate}</p>
                ) : null}
              </div>
              <p className="font-bold text-fg-default">{formatPrice(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 rounded-lg border border-border p-4 text-sm">
          <div className="flex justify-between text-fg-muted">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-fg-default">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <h2 className="mt-10 font-sans text-lg font-bold text-fg-default">Informasi Pengiriman</h2>
        <div className="mt-3 space-y-1 rounded-lg border border-border p-4 text-sm">
          <p className="text-fg-muted">
            No. Telepon: <span className="font-semibold text-fg-default">{order.customerPhone || "-"}</span>
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
            ToS: <span className="font-semibold text-fg-default">{order.tosAccepted ? "Disetujui" : "-"}</span>
          </p>
        </div>

        <h2 className="mt-10 font-sans text-lg font-bold text-fg-default">Pengiriman & Rilis</h2>
        <ul className="mt-3 flex flex-col divide-y divide-border rounded-lg border border-border">
          {order.groups.length === 0 ? (
            <li className="px-4 py-3 text-sm text-fg-muted">
              Belum ada — dibuat otomatis setelah pembayaran diterima.
            </li>
          ) : (
            order.groups.map((group) => (
              <li key={group.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-sans font-bold text-fg-default">
                    {FULFILLMENT_KIND_LABELS[group.kind] ?? group.kind}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {group.estimate ? `Estimasi: ${group.estimate}` : "Estimasi menyusul"}
                    {group.trackingNumber ? ` · No. resi: ${group.trackingNumber}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold text-accent">
                  {FULFILLMENT_STATUS_LABELS[group.status] ?? group.status}
                </span>
              </li>
            ))
          )}
        </ul>
      </Container>
    </Section>
  );
}