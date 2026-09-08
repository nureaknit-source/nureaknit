"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { mediaUrl } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/payload-types";

const Lightbox = dynamic(() => import("@/components/ui/lightbox"), {
  ssr: false,
});

interface GalleryImage {
  url: string;
  cardUrl: string;
  thumbUrl: string;
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
      const fullUrl = mediaUrl(item.image) ?? "";
      const cardUrl = mediaUrl(item.image, "card") ?? fullUrl;
      const thumbUrl = mediaUrl(item.image, "thumbnail") ?? cardUrl;
      return {
        url: fullUrl,
        cardUrl,
        thumbUrl,
        alt: media?.alt ?? "",
      };
    })
    .filter((i) => i.url);

  const [main, setMain] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <>
        <div className="overflow-hidden rounded-lg relative aspect-[4/3] w-full">
          <Image
            src={items[0].cardUrl}
            alt={items[0].alt || title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] w-full object-cover cursor-zoom-in"
            priority={priority}
            onClick={() => setLbOpen(true)}
          />
        </div>
        {lbOpen && (
          <Lightbox
            images={items}
            initialIndex={0}
            onClose={() => setLbOpen(false)}
          />
        )}
      </>
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
              <div className="relative aspect-square w-full">
                <Image
                  src={img.thumbUrl}
                  alt={img.alt}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </nav>

        {/* Main image */}
        <div className="overflow-hidden rounded-lg relative aspect-[4/3] w-full">
          <Image
            src={items[main].cardUrl}
            alt={items[main].alt || title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="cursor-zoom-in object-cover transition duration-300"
            priority={priority}
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
              <div className="relative aspect-square w-16">
                <Image
                  src={img.thumbUrl}
                  alt={img.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
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
