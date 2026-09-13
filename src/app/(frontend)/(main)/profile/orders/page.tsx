import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../layout";
import { getOrdersAction } from "@/actions/checkout";
import { groupOrdersByTab } from "@/actions/orders";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/typography";
import { OrdersTabs } from "@/components/orders/OrdersTabs";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/profile/orders");

  // getOrdersAction needs supabase userId, fetch from getUserSession
  const { getUserSession } = await import("@/actions/cart");
  const session = await getUserSession();

  let orders: Awaited<ReturnType<typeof getOrdersAction>> = [];
  let fetchError: string | null = null;
  try {
    orders = await getOrdersAction();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Gagal memuat order.";
  }

  const tabbedOrders = await groupOrdersByTab(orders, session.id);

  return (
    <Section>
      <Container size="sm">
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Kembali ke Profil
        </Link>
        <Heading as="h1">My Orders</Heading>

        {fetchError ? (
          <div className="mt-8 rounded-lg border border-error/20 bg-error-subtle p-4 text-sm text-error">
            {fetchError}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-12 py-16 text-center">
            <p className="mb-4 text-fg-secondary">Kamu belum memiliki riwayat pesanan.</p>
            <Link href="/products" className="text-primary hover:underline">
              Mulai belanja sekarang &rarr;
            </Link>
          </div>
        ) : (
          <OrdersTabs initialTabs={tabbedOrders} />
        )}
      </Container>
    </Section>
  );
}