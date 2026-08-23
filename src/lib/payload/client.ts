import { getPayload } from "payload";
import type { CollectionSlug, Where } from "payload";
import config from "@payload-config";

interface FindOptions {
  where?: Where | Record<string, unknown>;
  limit?: number;
  page?: number;
  sort?: string;
  depth?: number;
}

interface PaginatedDocs<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const defaults: Record<string, { sort?: string; limit: number; depth: number }> = {
  patterns: { sort: "-publishedAt", limit: 50, depth: 1 },
  "blog-posts": { sort: "-publishedAt", limit: 20, depth: 1 },
  products: { sort: "-createdAt", limit: 50, depth: 1 },
  faq: { sort: "order", limit: 100, depth: 1 },
  "pattern-categories": { sort: "name", limit: 100, depth: 1 },
  "product-categories": { sort: "name", limit: 100, depth: 1 },
};

export async function getCollection<T>(collection: CollectionSlug, opts?: FindOptions) {
  const payload = await getPayload({ config });
  const d = defaults[collection] || { limit: 50, depth: 1 };
  return payload.find({
    collection,
    depth: opts?.depth ?? d.depth,
    sort: opts?.sort ?? d.sort,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? d.limit,
    where: opts?.where as Where,
  }) as unknown as PaginatedDocs<T>;
}

export async function getBySlug<T>(collection: CollectionSlug, slug: string, depth = 2) {
  const result = await getCollection<T>(collection, { where: { slug: { equals: slug } }, depth, limit: 1 });
  return result.docs[0] || null;
}
