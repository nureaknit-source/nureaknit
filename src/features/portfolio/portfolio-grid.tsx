"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import Lightbox from "@/components/ui/lightbox";

interface PortfolioImage {
  url: string;
  alt: string;
}

interface Entry {
  id: number;
  title: string;
  slug?: string | null;
  category?: string | null;
  year?: number | null;
  images: PortfolioImage[];
}

interface Props {
  entries: Entry[];
}

export function PortfolioGrid({ entries }: Props) {
  const [lightbox, setLightbox] = useState<{ open: boolean; images: PortfolioImage[]; index: number }>({
    open: false,
    images: [],
    index: 0,
  });

  const allImages = entries.flatMap((e) => e.images);

  return (
    <>
      <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-6 break-inside-avoid">
            <Card className="overflow-hidden p-0">
              {entry.images.length > 0 && (
                <button
                  onClick={() => {
                    const startIndex = allImages.indexOf(entry.images[0]);
                    setLightbox({ open: true, images: allImages, index: startIndex });
                  }}
                  className="w-full text-left"
                >
                  <img
                    src={entry.images[0].url}
                    alt={entry.images[0].alt}
                    className="w-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              )}
              <div className="p-4">
                <Link href={`/portfolio/${entry.slug || entry.id}`}>
                  <h3 className="font-serif text-lg font-semibold text-charcoal transition hover:text-sage">
                    {entry.title}
                  </h3>
                </Link>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.category && (
                    <Tag variant={entry.category === "knitting" ? "sage" : "rose"}>
                      {entry.category}
                    </Tag>
                  )}
                  {entry.year && <Tag>{entry.year}</Tag>}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {lightbox.open && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox({ ...lightbox, open: false })}
        />
      )}
    </>
  );
}
