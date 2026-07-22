import type { Media } from "./payload-types";

export function mediaUrl(media?: Media | string | number | null): string | null {
  if (!media) return null;
  if (typeof media === "string") return media;
  if (typeof media === "number") return null;
  return media.url || null;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  easy: "Easy",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function difficultyLabel(value?: string | null): string {
  return difficultyLabels[value || ""] || value || "";
}
