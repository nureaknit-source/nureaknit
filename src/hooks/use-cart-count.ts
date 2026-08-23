"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { getCartItemCountAction } from "@/actions/cart";
import { createClient } from "@/utils/supabase/client";

let synced = false;

export function useCartCount(): number {
  const count = useCartStore((s) => s.count);

  useEffect(() => {
    if (synced) return;
    synced = true;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getCartItemCountAction()
          .then(useCartStore.getState().setCount)
          .catch(() => useCartStore.getState().setCount(0));
      } else {
        useCartStore.getState().setCount(0);
      }
    });

    return () => {
      subscription.unsubscribe();
      synced = false;
    };
  }, []);

  return count;
}
