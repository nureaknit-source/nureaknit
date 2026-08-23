"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (loading || disabled) return;
    setLoading(true);
    router.push("/checkout");
  };

  return (
    <Button type="button" onClick={handleCheckout} disabled={loading || disabled}>
      {loading ? "Memproses..." : "Checkout"}
    </Button>
  );
}