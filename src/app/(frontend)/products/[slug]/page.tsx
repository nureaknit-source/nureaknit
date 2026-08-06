import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { WishlistButton } from "@/features/products/wishlist-button";
import { ProductGallery } from "@/features/products/product-gallery";
import { getBySlug } from "@/lib/payload/client";
import { formatPrice, availabilityLabel, availabilityBadgeVariant } from "@/lib/payload/utils";
import type { Product } from "@/lib/payload/payload-types";
import { getWishlistAction } from "@/actions/wishlist";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

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
    description: product.description || undefined,
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

  const availability = product.availability || "in_stock";
  const showOrderButton = availability !== "unavailable";
  const orderLabel =
    availability === "pre_order" ? "Pre-Order" : "Pesan Sekarang";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  let wishlistIds: number[] = [];
  if (user) {
    try {
      wishlistIds = await getWishlistAction();
    } catch {}
  }

  return (
    <Section>
      <Container size="lg">
        <Breadcrumbs
          crumbs={[
            { label: "Shop", href: "/products" },
            { label: product.title },
          ]}
        />

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Gallery */}
          <div className="lg:pb-4">
            <ProductGallery
              images={product.images}
              title={product.title}
              priority
            />
          </div>

          {/* Product info (sticks on desktop while scrolling) */}
          <div className="lg:col-start-2 lg:sticky lg:top-24">
            <div className="flex items-start justify-between">
              <div>
                <Caption>Product</Caption>
                <Heading as="h1" className="mt-2">
                  {product.title}
                </Heading>
              </div>
              <WishlistButton
                productId={product.id}
                initialInWishlist={wishlistIds.includes(product.id)}
                isLoggedIn={!!user}
              />
            </div>

            <p className="mt-4 text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.availability && (
                <Badge
                  variant={availabilityBadgeVariant(product.availability)}
                >
                  {availabilityLabel[product.availability]}
                </Badge>
              )}
              {product.categories && product.categories.length > 0 && (
                <Badge variant="default">
                  {typeof product.categories[0] === "object"
                    ? (product.categories[0] as { name?: string }).name ||
                      "Uncategorized"
                    : "Uncategorized"}
                </Badge>
              )}
              {product.availability === "in_stock" &&
                product.stock !== undefined &&
                product.stock !== null && (
                  <Badge variant="secondary">Stock: {product.stock}</Badge>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {showOrderButton ? (
                <Link
                  href={`/contact?subject=${encodeURIComponent("Pesan: " + product.title)}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95"
                >
                  {orderLabel}
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-full bg-error-subtle px-6 py-3 text-sm font-bold text-error-fg">
                  Stok Habis
                </span>
              )}
              {product.linkedProducts &&
                product.linkedProducts.length > 0 &&
                product.linkedProducts.map(
                  (item: Record<string, unknown>, i: number) => {
                    const linkedProduct = item.product as Product;
                    const label =
                      (item.label as string) ||
                      linkedProduct?.title ||
                      "View";
                    const href = linkedProduct?.slug
                      ? `/products/${linkedProduct.slug}`
                      : linkedProduct?.id
                        ? `/products/${linkedProduct.id}`
                        : "#";
                    return (
                      <Link
                        key={i}
                        href={href}
                        className="inline-flex items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95"
                      >
                        {label}
                      </Link>
                    );
                  },
                )}
            </div>

            {product.description && (
              <div className="mt-6">
                <RichText data={product.description} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/products"
            className="text-sm text-primary underline transition hover:text-accent"
          >
            &larr; Back to Shop
          </Link>
        </div>
      </Container>
    </Section>
  );
}
