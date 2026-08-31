import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";

export default function CheckoutCancelPage() {
  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">Checkout Dibatalkan</Heading>
        <Text className="mt-2">
          Tenang, item di keranjang belanja kamu tetap tersimpan aman kok. Kamu bisa melanjutkannya kapan pun kamu siap.
        </Text>
        <div className="mt-8 flex gap-3">
          <Link href="/profile/cart" className="text-sm text-primary hover:underline">
            Kembali ke Keranjang
          </Link>
          <Link href="/profile/orders" className="text-sm text-primary hover:underline">
            Lihat Pesanan Saya
          </Link>
        </div>
      </Container>
    </Section>
  );
}