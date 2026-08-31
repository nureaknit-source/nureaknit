import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { ProductActions } from "@/features/products/product-actions";
import { ProductGallery } from "@/features/products/product-gallery";
import { getBySlug } from "@/lib/payload/client";
import { formatPrice, availabilityLabel } from "@/lib/payload/utils";
import type { Product } from "@/lib/payload/payload-types";
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


  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <Section className="pt-8 sm:pt-12">
      <Container size="lg">
        <Breadcrumbs
          crumbs={[
            { label: "Shop", href: "/products" },
            { label: product.title },
          ]}
        />

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Gallery */}
          <div className="pb-4">
            <ProductGallery
              images={product.images}
              title={product.title}
              priority
            />
          </div>

          {/* Product info (sticks on desktop while scrolling) */}
          <div className="lg:col-start-2 lg:sticky lg:top-24">
            <div>
              <Caption>Product</Caption>
              <Heading as="h1" className="mt-2">
                {product.title}
              </Heading>
            </div>

            <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
               {product.availability && (
                 <Badge variant="outline">
                   {availabilityLabel[product.availability]}
                 </Badge>
               )}
               {product.categories && product.categories.length > 0 && (
                 <Badge variant="outline">
                   {typeof product.categories[0] === "object"
                     ? (product.categories[0] as { name?: string }).name ||
                       "Uncategorized"
                     : "Uncategorized"}
                 </Badge>
               )}
               {product.availability === "in_stock" &&
                product.stock !== undefined &&
                product.stock !== null && (
                  <Badge variant="outline">
                    Stock: {Math.max(0, (product.stock ?? 0) - (product.reservedStock ?? 0))}
                  </Badge>
                )}
            </div>

            {product.availability === "pre_order" && (
              <div className="mt-4 rounded-lg border border-accent-subtle bg-accent-subtle/40 p-3 text-sm text-fg-secondary">
                Pesanan pre-order memerlukan konfirmasi admin — slot pengerjaanmu akan langsung dikunci setelah pesanan disetujui, lalu kamu bisa menyelesaikan pembayaran dengan nyaman.
                {product.estimatedAvailability &&
                  ` Perkiraan tersedia: ${product.estimatedAvailability}.`}
              </div>
            )}

            {product.availability === "in_stock" &&
              product.lowStockThreshold != null &&
              (product.stock ?? 0) - (product.reservedStock ?? 0) <= product.lowStockThreshold && (
                <div className="mt-4 rounded-lg border border-error/20 bg-error-subtle p-3 text-sm text-error">
                  Stok menipis (sisa {Math.max(0, (product.stock ?? 0) - (product.reservedStock ?? 0))}) — pesan sekarang sebelum kehabisan!
                </div>
              )}

            <ProductActions
              productId={product.id}
              isLoggedIn={isLoggedIn}
              maxStock={product.stock}
              availability={product.availability || undefined}
            />

            {product.linkedProducts &&
              product.linkedProducts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.linkedProducts.map(
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
              )}
          </div>
        </div>

        {/* Deskripsi di bawah */}
        {product.description && (
          <div className="mt-12">
            <Heading as="h2" className="mb-4">
              Detail &amp; Deskripsi Produk
            </Heading>
            <RichText data={product.description} />
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/products"
            className="text-sm text-primary underline transition hover:text-accent"
          >
            &larr; Kembali ke Shop
          </Link>
        </div>
      </Container>
    </Section>
  );
}
