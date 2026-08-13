"use client";

import Link from "next/link";
import { useCartCount } from "@/hooks/use-cart-count";
import { ShoppingCart } from "lucide-react";

export function FloatingCart() {
  const count = useCartCount();
  if (count <= 0) return null;

  return (
    <Link
      href="/profile/cart"
      transitionTypes={["page"]}
      aria-label={`Keranjang belanja, ${count} item`}
      title="Lihat keranjang"
      className="fixed bottom-6 right-6 z-[40] flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg md:hidden"
    >
      <ShoppingCart className="h-6 w-6 text-primary-fg" />
      <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-primary-fg">
        {count}
      </span>
    </Link>
  );
}
