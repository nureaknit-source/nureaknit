import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { searchContent } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media, Pattern, BlogPost, Product } from "@/lib/payload/payload-types";

export const metadata = {
  title: "Search — Nurea Knit",
  description: "Search patterns, blog posts, and products.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const query = params?.q || "";

  let results: { patterns: Pattern[]; posts: BlogPost[]; products: Product[] } | null = null;
  if (query) {
    results = await searchContent(query);
  }

  const hasResults = results && (results.patterns.length > 0 || results.posts.length > 0 || results.products.length > 0);

  return (
    <Section>
      <Container size="md">
        <Heading as="h1">Search</Heading>
        <Text className="mt-2">Find patterns, tutorials, and products.</Text>

        <form action="/search" method="get" className="mt-6">
          <div className="relative">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Knitting patterns, blog posts, yarn..."
              className="w-full rounded-full border border-border bg-bg-surface px-4 py-2.5 text-sm text-fg-secondary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent-subtle"
              aria-label="Search"
              autoFocus
            />
          </div>
        </form>

        {!query && (
          <div className="mt-12">
            <EmptyState title="Cari sesuatu" message="Masukkan kata kunci di kotak pencarian di atas." />
          </div>
        )}

        {query && !hasResults && (
          <div className="mt-12">
            <EmptyState title="Tidak ada hasil" message={`Tidak ditemukan "${query}" di patterns, blog, atau produk.`} />
          </div>
        )}

        {query && hasResults && (
          <div className="mt-8 space-y-12">
            {results!.patterns.length > 0 && (
              <div>
                <h2 className="font-sans text-xl font-bold text-fg-default">Patterns</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.patterns.map((p) => (
                    <Link key={p.id} href={`/patterns/${p.slug || p.id}`} className="block">
                      <Card className="h-full">
                        {p.image && mediaUrl(p.image as Media | number) && (
                          <img
                            src={mediaUrl(p.image as Media | number) || ""}
                            alt={p.title}
                            className="aspect-[4/3] w-full rounded-t-lg object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-sans text-lg font-bold text-fg-default">{p.title}</h3>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results!.posts.length > 0 && (
              <div>
                <h2 className="font-sans text-xl font-bold text-fg-default">Blog</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug || post.id}`} className="block">
                      <Card className="h-full">
                        {post.coverImage && mediaUrl(post.coverImage as Media | number) && (
                          <img
                            src={mediaUrl(post.coverImage as Media | number) || ""}
                            alt={post.title}
                            className="aspect-[16/9] w-full rounded-t-lg object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-sans text-lg font-bold text-fg-default">{post.title}</h3>
                          {post.excerpt && (
                            <Text size="sm" className="mt-1 line-clamp-2">{post.excerpt}</Text>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results!.products.length > 0 && (
              <div>
                <h2 className="font-sans text-xl font-bold text-fg-default">Products</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.products.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug || product.id}`} className="block">
                      <Card className="h-full">
                        {product.images?.[0]?.image && mediaUrl(product.images[0].image as Media | number) && (
                          <img
                            src={mediaUrl(product.images[0].image as Media | number) || ""}
                            alt={product.title}
                            className="aspect-[4/3] w-full rounded-t-lg object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-sans text-lg font-bold text-fg-default">{product.title}</h3>
                            {product.availability && (
                              <Badge variant={product.availability === "in_stock" ? "primary" : "secondary"}>
                                {product.availability}
                              </Badge>
                            )}
                          </div>
                          {product.price && (
                            <Text className="mt-1 font-bold text-primary">{formatPrice(product.price)}</Text>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
