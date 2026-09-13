import { getCartAction } from "@/actions/cart";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CartItemRow } from "./cart-item-row";
import { CartTotal } from "./cart-total";
import { CheckoutButton } from "./checkout-button";
import { ClearCartButton } from "./clear-cart-button";
import type { CartItemWithProduct } from "@/actions/cart";
import { ShoppingBag, ArrowLeft, ShieldCheck, Info } from "lucide-react";


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
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Profil</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-fg-default">Keranjang Belanja</h1>
          {items.length > 0 && (
            <Badge variant="primary" size="md">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Badge>
          )}
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-error/20 bg-error-subtle p-4 text-sm text-error">
            {fetchError}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8 text-primary" />}
            title="Keranjang Belanja Masih Kosong"
            message="Yuk temukan benang rajut premium, pola cantik, atau kit rajut impianmu!"
            action={
              <Link href="/products">
                <Button variant="primary" size="lg">
                  Mulai Belanja
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Cart Items */}
            <div className="space-y-4 lg:col-span-8">
              <Card padding="none" hover={false} className="divide-y divide-border overflow-hidden">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </Card>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link href="/products">
                  <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Lanjut Belanja
                  </Button>
                </Link>
                <ClearCartButton />

              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <Card padding="md" hover={false} className="sticky top-24 space-y-5">
                <Heading as="h3" className="text-lg border-b border-border/60 pb-3">
                  Ringkasan Pesanan
                </Heading>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-fg-muted">
                    <span>Total Item ({purchasable.reduce((acc, i) => acc + i.quantity, 0)})</span>
                    <span className="font-medium text-fg-default">{purchasable.length} produk</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-bold text-fg-default text-base">Subtotal</span>
                    <CartTotal initialTotal={subtotal} />
                  </div>
                </div>

                {hasPreOrder && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent-subtle p-3 text-xs text-accent">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Terdapat item <strong>Pre-order</strong>. Admin akan menghubungimu via WhatsApp untuk konfirmasi detail sebelum pesanan diproses.
                    </span>
                  </div>
                )}

                <CheckoutButton
                  disabled={purchasable.length === 0}
                  className="w-full"
                  size="lg"
                />

                <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-fg-muted">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>Pembayaran aman &amp; QRIS otomatis</span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

