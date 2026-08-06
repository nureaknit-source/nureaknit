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

export const availabilityLabel: Record<string, string> = {
  in_stock: "In Stock",
  dropship: "Dropship",
  pre_order: "Pre-Order",
  unavailable: "Unavailable",
};

export const availabilityVariant: Record<
  string,
  "primary" | "secondary" | "accent" | "error"
> = {
  in_stock: "primary",
  dropship: "secondary",
  pre_order: "accent",
  unavailable: "error",
};

export function availabilityBadgeVariant(
  value?: string | null,
): "primary" | "secondary" | "accent" | "error" {
  return availabilityVariant[value || ""] ?? "secondary";
}
