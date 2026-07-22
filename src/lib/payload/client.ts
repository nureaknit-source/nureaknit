import { getPayload } from "payload";
import config from "@payload-config";

interface FindOptions {
  where?: Record<string, unknown>;
  limit?: number;
  page?: number;
  sort?: string;
  depth?: number;
}

function w(where?: Record<string, unknown>) {
  return where as any;
}

export async function getPatterns(options?: FindOptions) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "patterns",
    depth: options?.depth ?? 1,
    sort: options?.sort ?? "-publishedAt",
    page: options?.page ?? 1,
    limit: options?.limit ?? 50,
    where: w(options?.where),
  });
}

export async function getPatternBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "patterns",
    where: { slug: { equals: slug } } as any,
    depth: 2,
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getBlogPosts(options?: FindOptions) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "blog-posts",
    depth: options?.depth ?? 1,
    sort: options?.sort ?? "-publishedAt",
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
    where: w(options?.where),
  });
}

export async function getBlogPostBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "blog-posts",
    where: { slug: { equals: slug } } as any,
    depth: 2,
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getPortfolioEntries(options?: FindOptions) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "portfolio",
    depth: options?.depth ?? 1,
    sort: options?.sort ?? "-createdAt",
    page: options?.page ?? 1,
    limit: options?.limit ?? 50,
    where: w(options?.where),
  });
}

export async function getPortfolioEntryBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolio",
    where: { slug: { equals: slug } } as any,
    depth: 2,
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getProducts(options?: FindOptions) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "products",
    depth: options?.depth ?? 1,
    sort: options?.sort ?? "-createdAt",
    page: options?.page ?? 1,
    limit: options?.limit ?? 50,
    where: w(options?.where),
  });
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } } as any,
    depth: 2,
    limit: 1,
  });
  return result.docs[0] || null;
}

export async function getFAQ(options?: FindOptions) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "faq",
    depth: options?.depth ?? 1,
    sort: options?.sort ?? "order",
    page: options?.page ?? 1,
    limit: options?.limit ?? 100,
    where: w(options?.where),
  });
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

export async function getPatternCategories() {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "pattern-categories",
    depth: 1,
    sort: "name",
    limit: 100,
  });
}
