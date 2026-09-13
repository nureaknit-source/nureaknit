import { CheckoutHeader } from "@/components/layout/checkout-header";
import { CheckoutFooter } from "@/components/layout/checkout-footer";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <CheckoutHeader />
      <main id="checkout-content" className="flex-1">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
}
