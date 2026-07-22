interface PayloadMedia {
  id: number;
  alt?: string | null;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null };
    card?: { url?: string | null; width?: number | null; height?: number | null };
    hero?: { url?: string | null; width?: number | null; height?: number | null };
  } | null;
}

export type Media = PayloadMedia;

export interface PatternCategory {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pattern {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  content?: Record<string, unknown> | null;
  difficulty?: "beginner" | "easy" | "intermediate" | "advanced" | null;
  yarnWeight?: string | null;
  image?: Media | number | null;
  pdf?: Media | number | null;
  categories?:
    | { relationTo: "pattern-categories"; value: PatternCategory | number }[]
    | PatternCategory[]
    | number[]
    | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content?: Record<string, unknown> | null;
  coverImage?: Media | number | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioEntry {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  images?:
    | { image: Media | number; id?: string | null }[]
    | null;
  category?: "knitting" | "crochet" | "other" | null;
  year?: number | null;
  featured?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug?: string | null;
  description?: Record<string, unknown> | null;
  price: number;
  images?:
    | { image: Media | number; id?: string | null }[]
    | null;
  type?: "digital" | "physical" | null;
  featured?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: number;
  email: string;
  product: number | Product;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: Record<string, unknown>;
  order?: number | null;
  createdAt: string;
  updatedAt: string;
}
