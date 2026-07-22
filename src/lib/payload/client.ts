import { getPayload } from "payload";
import config from "@payload-config";

interface FindOptions {
  where?: Record<string, unknown>;
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
  portfolio: { sort: "-createdAt", limit: 50, depth: 1 },
  products: { sort: "-createdAt", limit: 50, depth: 1 },
  faq: { sort: "order", limit: 100, depth: 1 },
  "pattern-categories": { sort: "name", limit: 100, depth: 1 },
};

export async function getCollection<T>(collection: string, opts?: FindOptions) {
  const payload = await getPayload({ config });
  const d = defaults[collection] || { limit: 50, depth: 1 };
  return payload.find({
    collection: collection as any,
    depth: opts?.depth ?? d.depth,
    sort: opts?.sort ?? d.sort,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? d.limit,
    where: opts?.where as any,
  }) as unknown as PaginatedDocs<T>;
}

export async function getBySlug<T>(collection: string, slug: string, depth = 2) {
  const result = await getCollection<T>(collection, { where: { slug: { equals: slug } }, depth, limit: 1 });
  return result.docs[0] || null;
}

export async function searchContent(query: string) {
  const payload = await getPayload({ config });
  const [patterns, posts, products] = await Promise.all([
    payload.find({ collection: "patterns", where: { title: { contains: query } } as any, limit: 10 }),
    payload.find({ collection: "blog-posts", where: { title: { contains: query } } as any, limit: 10 }),
    payload.find({ collection: "products", where: { title: { contains: query } } as any, limit: 10 }),
  ]);
  return { patterns: patterns.docs, posts: posts.docs, products: products.docs };
}
