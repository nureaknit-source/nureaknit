import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateInView } from "@/components/shared/animate-in-view";
import { EmptyState } from "@/components/shared/empty-state";
import { getCollection } from "@/lib/payload/client";
import { mediaUrl, formatPrice } from "@/lib/payload/utils";
import type { Media, Product, ProductCategory } from "@/lib/payload/payload-types";
import { getWishlistAction } from "@/actions/wishlist";
import { WishlistButton } from "@/features/products/wishlist-button";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

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

export const metadata = {
  title: "Shop — Nurea Knit",
  description: "Browse knitting and crochet products, tools, and accessories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.category) where["categories.slug"] = { equals: params.category };

  const { docs: products } = await getCollection<Product>("products", { where });
  const { docs: categories } = await getCollection<ProductCategory>("product-categories");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  let wishlistIds: number[] = [];
  if (user) {
    try { wishlistIds = await getWishlistAction(); } catch {}
  }

  return (
    <Section>
      <Container>
        <Heading as="h1">Shop</Heading>
        <Text className="mt-2">Tools, accessories, and more.</Text>

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/products"
              transitionTypes={['page']}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                !params.category
                  ? "bg-primary text-primary-fg"
                  : "bg-accent-subtle text-fg-secondary hover:bg-primary-subtle"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug || cat.id}`}
                transitionTypes={['page']}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  params.category === (cat.slug || cat.id)
                    ? "bg-primary text-primary-fg"
                    : "bg-accent-subtle text-fg-secondary hover:bg-primary-subtle"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="mt-12">
            <AnimateInView><EmptyState title="Belum ada produk" message="Produk akan segeri hadir!" /></AnimateInView>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const firstImage = product.images?.[0]?.image
                ? mediaUrl(product.images[0].image as Media | number)
                : null;
              return (
                <AnimateInView key={product.id} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                  <Link href={`/products/${product.slug || product.id}`} transitionTypes={['page']}>
                    <Card hover className="relative h-full flex flex-col">
                      {firstImage ? (
                          <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                          <img
                            src={firstImage}
                            alt=""
                            className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] rounded-t-lg bg-accent-subtle" />
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
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
                      </div>
                      <div className="absolute right-4 top-4">
                        <WishlistButton productId={product.id} initialInWishlist={wishlistIds.includes(product.id)} isLoggedIn={user !== null} />
                      </div>
                      <h3 className="font-sans text-lg font-bold text-fg-default">
                        {product.title}
                      </h3>
                      <Text className="mt-1 font-bold text-primary">
                        {formatPrice(product.price)}
                      </Text>
                    </Card>
                  </Link>
                </AnimateInView>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
