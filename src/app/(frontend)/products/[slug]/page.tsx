import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Tag } from "@/components/ui/tag";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { getProductBySlug } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/cms-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
  const product = await getProductBySlug(slug);

  if (!product) notFound();

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
            <Caption>Product</Caption>
            <Heading as="h1" className="mt-2">
              {product.title}
            </Heading>
            <p className="mt-4 text-2xl font-semibold text-sage">
              {formatPrice(product.price)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.featured && <Tag variant="gold">Featured</Tag>}
              {product.type && (
                <Tag variant="sage">{product.type === "digital" ? "Digital" : "Physical"}</Tag>
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
