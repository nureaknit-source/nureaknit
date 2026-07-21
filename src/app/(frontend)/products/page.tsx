import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getProducts } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/payload-types";

export const metadata = {
  title: "Shop — Nurea Knit",
  description: "Browse knitting and crochet products, tools, and accessories.",
};

export default async function ProductsPage() {
  const { docs: products } = await getProducts({ limit: 50 });

  return (
    <Section>
      <Container>
        <Heading as="h1">Shop</Heading>
        <Text className="mt-2">Tools, accessories, and more.</Text>

        {products.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada produk" message="Produk akan segera hadir!" />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const firstImage = product.images?.[0]?.image
                ? mediaUrl(product.images[0].image as Media | number)
                : null;
              return (
                <Link key={product.id} href={`/products/${product.slug || product.id}`}>
                  <Card hover className="h-full flex flex-col">
                    {firstImage ? (
                      <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                        <img
                          src={firstImage}
                          alt=""
                          className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] rounded-t-xl bg-light-gray" />
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {product.featured && <Tag variant="gold">Featured</Tag>}
                      {product.type && (
                        <Tag variant="sage">{product.type === "digital" ? "Digital" : "Physical"}</Tag>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">
                      {product.title}
                    </h3>
                    <Text className="mt-1 font-medium text-sage">
                      {formatPrice(product.price)}
                    </Text>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
