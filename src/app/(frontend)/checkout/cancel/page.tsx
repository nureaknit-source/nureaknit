import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function CheckoutCancelPage() {
  return (
    <Section>
      <Container size="sm">
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">Checkout Dibatalkan</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Tidak ada masalah — keranjang kamu masih tersimpan. Kamu bisa checkout kapan saja.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/profile/cart" className="text-sm text-primary hover:underline">
            Kembali ke Keranjang
          </Link>
          <Link href="/profile/orders" className="text-sm text-primary hover:underline">
            Lihat Order
          </Link>
        </div>
      </Container>
    </Section>
  );
}