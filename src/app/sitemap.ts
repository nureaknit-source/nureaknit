import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchSlugs(collection: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/${collection}?limit=1000&depth=0&fields=slug`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs || [])
      .map((doc: { slug?: string | null }) => doc.slug)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [patternSlugs, blogSlugs, productSlugs] = await Promise.all([
    fetchSlugs("patterns"),
    fetchSlugs("blog-posts"),
    fetchSlugs("products"),
  ]);

  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/patterns`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/coaching`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const patternRoutes = patternSlugs.map((slug: string) => ({
    url: `${BASE_URL}/patterns/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = blogSlugs.map((slug: string) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productRoutes = productSlugs.map((slug: string) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...patternRoutes,
    ...blogRoutes,
    ...productRoutes,
  ];
}
