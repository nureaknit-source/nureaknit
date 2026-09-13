"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/payload/utils";

export interface CartTotalProps {
  initialTotal: number;
  className?: string;
}

export function CartTotal({ initialTotal, className = "" }: CartTotalProps) {
  const total = useCartStore((s) => s.total);
  const setTotal = useCartStore((s) => s.setTotal);

  useEffect(() => {
    setTotal(initialTotal);
  }, [initialTotal, setTotal]);

  return (
    <span className={`text-xl sm:text-2xl font-extrabold text-primary ${className}`}>
      {formatPrice(total)}
    </span>
  );
}

