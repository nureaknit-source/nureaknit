"use client";

import { useEffect, useState, useCallback } from "react";
import { getCartItemCountAction } from "@/actions/cart";
import { createClient } from "@/utils/supabase/client";

export function useCartCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      setCount(await getCartItemCountAction());
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) refresh();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) refresh();
      else setCount(0);
    });

    const onCartUpdated = () => refresh();
    window.addEventListener("cart:updated", onCartUpdated);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("cart:updated", onCartUpdated);
    };
  }, [refresh]);

  return count;
}
