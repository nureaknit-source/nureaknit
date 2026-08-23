import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../layout";
import { getOrdersAction } from "@/actions/checkout";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatPrice, formatDate } from "@/lib/payload/utils";
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from "@/lib/commerce/labels";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/profile/orders");

  let orders: Awaited<ReturnType<typeof getOrdersAction>> = [];
  let fetchError: string | null = null;
  try {
    orders = await getOrdersAction();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Gagal memuat order.";
  }

  return (
    <Section>
      <Container size="sm">
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Kembali ke Profil
        </Link>
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">My Orders</h1>

        {fetchError ? (
          <div className="mt-8 rounded-lg border border-error/20 bg-error-subtle p-4 text-sm text-error">
            {fetchError}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-12 py-16 text-center">
            <p className="mb-4 text-fg-secondary">Belum ada order.</p>
            <Link href="/products" className="text-primary hover:underline">
              Mulai belanja
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col divide-y divide-border rounded-lg border border-border">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/profile/orders/${order.reference}`}
                  className="flex flex-col gap-1 px-4 py-4 hover:bg-accent-subtle sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-sans font-bold text-fg-default">{order.reference}</p>
                    <p className="text-sm text-fg-muted">
                      {ORDER_TYPE_LABELS[order.type]} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-fg-default">
                      {formatPrice(order.total)}
                    </span>
                    <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold text-accent">
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}