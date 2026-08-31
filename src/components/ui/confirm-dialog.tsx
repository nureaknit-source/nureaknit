"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Trash2, AlertTriangle, CheckCircle2, X } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const emptySubscribe = () => () => {};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );


  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    },
    [onCancel, isLoading],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open || !isClient) return null;

  const iconMap = {
    danger: <Trash2 className="h-6 w-6 text-error" />,
    warning: <AlertTriangle className="h-6 w-6 text-warning" />,
    primary: <CheckCircle2 className="h-6 w-6 text-primary" />,
  };

  const badgeBgMap = {
    danger: "bg-error-subtle",
    warning: "bg-warning-subtle",
    primary: "bg-primary-subtle",
  };

  const buttonVariantMap = {
    danger: "danger" as const,
    warning: "primary" as const,
    primary: "primary" as const,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-overlay/40 p-4 backdrop-blur-xs transition-opacity"
      onClick={!isLoading ? onCancel : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-bg-surface p-6 shadow-xl border border-border/80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 rounded-full p-1.5 text-fg-muted hover:bg-bg-surface-muted hover:text-fg-default transition active:scale-95 disabled:opacity-40"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${badgeBgMap[variant]} shadow-xs`}>
            {iconMap[variant]}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <Heading as="h3" display className="text-lg font-bold text-fg-default">
              {title}
            </Heading>
            <Text size="sm" className="mt-1 text-fg-secondary leading-relaxed">
              {message}
            </Text>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariantMap[variant]}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 sm:flex-initial"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}



