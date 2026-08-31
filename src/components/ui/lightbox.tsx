"use client";

import { useEffect, useCallback, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  url: string;
  alt: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
    },
    [onClose, images.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const current = images[currentIndex];
  if (!current || !isClient) return null;


  return createPortal(
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-overlay/80 backdrop-blur-sm"
      onClick={onClose}
    >

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface/20 text-fg-inverse backdrop-blur-md transition hover:bg-bg-surface/40 hover:text-fg-default active:scale-95"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-4 px-4" onClick={(e) => e.stopPropagation()}>
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface/20 text-fg-inverse backdrop-blur-md transition hover:bg-bg-surface/40 hover:text-fg-default active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <img
          src={current.url}
          alt={current.alt}
          className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
        />
        {currentIndex < images.length - 1 && (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface/20 text-fg-inverse backdrop-blur-md transition hover:bg-bg-surface/40 hover:text-fg-default active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="absolute bottom-6 rounded-full bg-bg-surface/20 px-3 py-1 text-xs font-semibold text-fg-inverse backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    document.body
  );
}


