import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { getBySlug } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media, Product } from "@/lib/payload/payload-types";

// ponytail: getBySlug<Product> provides proper typing for product pages
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getWishlistAction } from "@/actions/wishlist";
import { WishlistButton } from "@/features/products/wishlist-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getBySlug<Product>("products", slug);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.title} — Nurea Knit Shop`,
    description: product.description ? undefined : undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getBySlug<Product>("products", slug);

  if (!product) notFound();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  let wishlistIds: number[] = [];
  if (user) {
    try { wishlistIds = await getWishlistAction(); } catch {}
  }

  const firstImage = product.images?.[0]?.image
    ? mediaUrl(product.images[0].image)
    : null;

  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          crumbs={[
            { label: "Shop", href: "/products" },
            { label: product.title },
          ]}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          {firstImage && (
            <div className="overflow-hidden rounded-xl">
              <img src={firstImage} alt="" className="w-full object-cover" />
            </div>
          )}

          <div>
            <div className="flex items-start justify-between">
              <div>
                <Caption>Product</Caption>
                <Heading as="h1" className="mt-2">
                  {product.title}
                </Heading>
              </div>
              <WishlistButton productId={product.id} initialInWishlist={wishlistIds.includes(product.id)} isLoggedIn={user !== null} />
            </div>
            <p className="mt-4 text-2xl font-semibold text-sage">
              {formatPrice(product.price)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.featured && <Badge variant="gold" shape="square">Featured</Badge>}
              {product.type && (
                <Badge variant="sage" shape="square">{product.type === "digital" ? "Digital" : "Physical"}</Badge>
              )}
            </div>
            {product.description && (
              <div className="mt-6">
                <RichText data={product.description} />
              </div>
            )}
          </div>
        </div>

        {product.images && product.images.length > 1 && (
          <div className="mt-12 grid grid-cols-3 gap-4">
            {product.images.slice(1).map((item: Record<string, unknown>, i: number) => {
              const url = mediaUrl(item.image as Media | number | null);
              return url ? (
                <div key={i} className="overflow-hidden rounded-lg">
                  <img src={url} alt="" className="w-full object-cover" loading="lazy" />
                </div>
              ) : null;
            })}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/products"
            className="text-sm text-sage underline transition hover:text-terracotta"
          >
            &larr; Back to Shop
          </Link>
        </div>
      </Container>
    </Section>
  );
}
