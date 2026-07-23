"use client";

import { useEffect, useState } from "react";

interface ToastData {
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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up rounded-lg border-l-4 px-4 py-3 text-sm font-bold shadow-lg ${
            toast.type === "success"
              ? "border-l-success bg-success-subtle text-success-fg"
              : "border-l-error bg-error-subtle text-error-fg"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
