"use client";

import { useState, useEffect, useMemo } from "react";

const DEFAULT_MINUTES = 15;

export function Countdown({
  expiresAt,
  minutes = DEFAULT_MINUTES,
  className = "",
}: { expiresAt?: string | Date; minutes?: number; className?: string }) {
  const end = useMemo(() => {
    if (expiresAt) {
      const t = new Date(expiresAt).getTime();
      if (Number.isFinite(t)) return t;
    }
    // Fallback: compute relative deadline inside effect (impure-in-effect is allowed).
    return 0;
  }, [expiresAt]);

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let deadline = end;
    if (!deadline) {
      deadline = Date.now() + minutes * 60 * 1000;
    }
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      const i = setTimeout(() => setRemaining(0), 0);
      return () => clearTimeout(i);
    }
    const tick = () => Math.max(0, Math.round((deadline - Date.now()) / 1000));
    const init = setTimeout(() => setRemaining(tick()), 0);
    const t = setInterval(() => setRemaining(tick()), 1000);
    return () => {
      clearTimeout(init);
      clearInterval(t);
    };
  }, [end, minutes]);

  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return <span className={className}>{m}:{s}</span>;
}
