import { getPayload } from "payload";
import config from "@payload-config";
import { getCartAction } from "@/actions/cart";
import { getProfileAction } from "@/actions/profile";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { CheckoutForm } from "./checkout-form";
import { formatPrice } from "@/lib/payload/utils";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const productId =
    typeof params.product === "string" ? Number(params.product) : undefined;
  const qty =
    typeof params.qty === "string" ? Math.max(1, Math.floor(Number(params.qty) || 1)) : 1;

  const payload = await getPayload({ config });
  const profile = await getProfileAction();

  let lines: { title: string; price: number; quantity: number }[] = [];
  let prefillProductId: number | undefined;
  let prefillQty = 1;

  if (productId) {
    const product = await payload.findByID({ collection: "products", id: productId });
    if (product) {
      prefillProductId = productId;
      prefillQty = qty;
      lines = [{ title: product.title, price: product.price ?? 0, quantity: qty }];
    }
  } else {
    const cart = await getCartAction();
    lines = cart.map((l) => ({
      title: l.product.title,
      price: l.product.price ?? 0,
      quantity: l.quantity,
    }));
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">Checkout</Heading>
        <Text className="mt-2">
          Tinggal selangkah lagi! Lengkapi detail kontak dan alamat pengirimanmu dengan benar ya.
        </Text>

        <div className="mt-6 divide-y divide-border rounded-lg border border-border">
          {lines.map((l, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-fg-default">{l.title}</p>
                <p className="text-xs text-fg-muted">
                  {l.quantity}x {formatPrice(l.price)}
                </p>
              </div>
              <p className="text-sm font-bold text-fg-default">
                {formatPrice(l.price * l.quantity)}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-fg-muted">Subtotal</span>
            <span className="font-sans text-lg font-extrabold text-fg-default">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <CheckoutForm
          defaultName={profile.name}
          productId={prefillProductId}
          qty={prefillQty}
        />
      </Container>
    </Section>
  );
}