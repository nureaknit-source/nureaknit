import { getCartAction, clearCartAction } from "@/actions/cart";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "./cart-item-row";
import { CartTotal } from "./cart-total";
import { CheckoutButton } from "./checkout-button";
import type { CartItemWithProduct } from "@/actions/cart";

async function clearCartFormAction() {
  "use server";
  await clearCartAction();
}

export default async function CartPage() {
  let items: CartItemWithProduct[] = [];
  let fetchError: string | null = null;

  try {
    items = await getCartAction();
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Gagal memuat keranjang.";
  }

  const purchasable = items.filter(
    (item) => item.product.availability !== "unavailable",
  );
  const subtotal = purchasable.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0,
  );
  const hasPreOrder = purchasable.some(
    (item) => item.product.availability === "pre_order",
  );

  return (
    <Section>
      <Container>
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Kembali ke Profil
        </Link>
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">
          My Cart
        </h1>

        {fetchError ? (
          <div className="mt-8 rounded-lg border border-error/20 bg-error-subtle p-4 text-sm text-error">
            {fetchError}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 py-16 text-center">
            <p className="mb-4 text-fg-secondary">Keranjang belanja masih kosong.</p>
            <Link href="/products">
              <Button variant="primary">Jelajahi produk</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 divide-y divide-border">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t-2 border-border pt-6">
              <span className="text-sm text-fg-muted">Subtotal</span>
              <CartTotal initialTotal={subtotal} />
            </div>

            {hasPreOrder && (
              <p className="mt-3 text-xs text-fg-muted">
                Item pre-order memerlukan konfirmasi admin — Anda akan dihubungi
                via WhatsApp sebelum menyelesaikan pembayaran.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products">
                <Button variant="outline">Lanjutkan Belanja</Button>
              </Link>
              <form action={clearCartFormAction}>
                <Button type="submit" variant="outline">
                  Bersihkan Keranjang
                </Button>
              </form>
              <CheckoutButton disabled={purchasable.length === 0} />
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
