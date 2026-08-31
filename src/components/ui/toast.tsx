"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error";
}

let addToast: ((toast: Omit<ToastData, "id">) => void) | null = null;

export function showToast(message: string, type: "success" | "error" = "success") {
  addToast?.({ message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    addToast = ({ message, type }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      addToast = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up flex items-center gap-3 rounded-xl border border-border/80 bg-bg-surface px-4 py-3 text-sm font-semibold shadow-lg text-fg-default ${
            toast.type === "success"
              ? "border-l-4 border-l-success"
              : "border-l-4 border-l-error"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-error" />
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

