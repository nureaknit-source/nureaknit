"use client";

import { useState } from "react";
import Lightbox from "@/components/ui/lightbox";
import { mediaUrl } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/payload-types";

interface GalleryImage {
  url: string;
  alt: string;
}

interface Props {
  images: { image: number | Media; id?: string | null }[] | null | undefined;
  title: string;
  priority?: boolean;
}

export function ProductGallery({ images, title, priority = true }: Props) {
  const items: GalleryImage[] = (images ?? [])
    .map((item) => {
      const media = typeof item.image === "object" ? item.image : null;
      return { url: mediaUrl(item.image) ?? "", alt: media?.alt ?? "" };
    })
    .filter((i) => i.url);

  const [main, setMain] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div className="overflow-hidden rounded-lg">
        <img
          src={items[0].url}
          alt={items[0].alt || title}
          className="aspect-[4/3] w-full object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:gap-6 md:grid-cols-[72px_1fr]">
        {/* Desktop: vertical thumbnail stack */}
        <nav className="hidden max-h-[500px] flex-col gap-3 overflow-y-auto md:flex">
          {items.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setMain(i)}
              aria-label={`View image ${i + 1}`}
              className="overflow-hidden rounded-lg ring-1 ring-border transition-colors hover:ring-2 hover:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </nav>

        {/* Main image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={items[main].url}
            alt={items[main].alt || title}
            className="aspect-[4/3] w-full cursor-zoom-in object-cover transition duration-300"
            loading={priority ? "eager" : "lazy"}
            onClick={() => setLbOpen(true)}
          />
        </div>

        {/* Mobile: horizontal scrollable thumbnails */}
        <div className="mt-2 flex gap-2 overflow-x-auto scroll-px-1 md:hidden">
          {items.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setMain(i)}
              aria-label={`View image ${i + 1}`}
              className="shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition-colors hover:ring-2 hover:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="aspect-square w-16 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {lbOpen && (
        <Lightbox
          images={items}
          initialIndex={main}
          onClose={() => setLbOpen(false)}
        />
      )}
    </>
  );
}
