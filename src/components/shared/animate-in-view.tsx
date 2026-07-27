"use client";

import { useInView } from "@/hooks/use-in-view";
import type { ReactNode } from "react";

export function AnimateInView({ children, className = "animate-fade-in-up" }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={inView ? className : "opacity-0"}>
      {children}
    </div>
  );
}
