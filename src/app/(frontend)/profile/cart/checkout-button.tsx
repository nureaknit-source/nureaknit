"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonSize } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface CheckoutButtonProps {
  disabled?: boolean;
  className?: string;
  size?: ButtonSize;
}

export function CheckoutButton({
  disabled = false,
  className = "",
  size = "lg",
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (loading || disabled) return;
    setLoading(true);
    router.push("/checkout");
  };

  return (
    <Button
      type="button"
      size={size}
      onClick={handleCheckout}
      isLoading={loading}
      disabled={disabled}
      rightIcon={<ArrowRight className="h-4 w-4" />}
      className={className}
    >
      Lanjut ke Checkout
    </Button>
  );
}