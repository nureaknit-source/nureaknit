"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/payload/utils";

export function CartTotal({ initialTotal }: { initialTotal: number }) {
  const total = useCartStore((s) => s.total);
  const setTotal = useCartStore((s) => s.setTotal);

  useEffect(() => {
    setTotal(initialTotal);
  }, [initialTotal, setTotal]);

  return (
    <span className="text-2xl font-extrabold text-fg-default">
      {formatPrice(total)}
    </span>
  );
}
