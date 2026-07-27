import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { getBySlug } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media, Product } from "@/lib/payload/payload-types";

const availabilityLabel: Record<string, string> = {
  in_stock: "In Stock",
  dropship: "Dropship",
  pre_order: "Pre-Order",
  unavailable: "Unavailable",
};

const availabilityBadge: Record<string, "primary" | "secondary" | "accent" | "error"> = {
  in_stock: "primary",
  dropship: "secondary",
  pre_order: "accent",
  unavailable: "error",
};

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

  const firstImage = product.images?.[0]?.image
    ? mediaUrl(product.images[0].image)
    : null;

  const availability = product.availability || "in_stock";
  const showOrderButton = availability !== "unavailable";
  const orderLabel = availability === "pre_order" ? "Pre-Order" : "Pesan Sekarang";

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
            <div className="overflow-hidden rounded-lg">
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
            </div>
            <p className="mt-4 text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.availability && (
                <Badge variant={availabilityBadge[product.availability] || "default"}>
                  {availabilityLabel[product.availability] || product.availability}
                </Badge>
              )}
              {product.categories && product.categories.length > 0 && (
                <Badge variant="default">
                  {typeof product.categories[0] === "object"
                    ? product.categories[0]?.name || "Uncategorized"
                    : "Uncategorized"}
                </Badge>
              )}
              {product.availability === "in_stock" && product.stock !== undefined && product.stock !== null && (
                <Badge variant="secondary">
                  Stock: {product.stock}
                </Badge>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {showOrderButton && (
                <Link
                  href={`/contact?subject=${encodeURIComponent("Pesan: " + product.title)}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95"
                >
                  {orderLabel}
                </Link>
              )}
              {product.availability === "unavailable" && (
                <span className="inline-flex items-center rounded-full bg-error-subtle px-6 py-3 text-sm font-bold text-error-fg">
                  Stok Habis
                </span>
              )}
              {product.linkedProducts && product.linkedProducts.length > 0 && (
                product.linkedProducts.map((item: Record<string, unknown>, i: number) => {
                  const linkedProduct = item.product as Product;
                  const label = (item.label as string) || linkedProduct?.title || "View";
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
                })
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
            className="text-sm text-primary underline transition hover:text-accent"
          >
            &larr; Back to Shop
          </Link>
        </div>
      </Container>
    </Section>
  );
}
