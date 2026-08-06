import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { WishlistButton } from "@/features/products/wishlist-button";
import {
  mediaUrl,
  formatPrice,
  availabilityLabel,
  availabilityBadgeVariant,
} from "@/lib/payload/utils";
import type { Product } from "@/lib/payload/payload-types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  showWishlist?: boolean;
  showCategory?: boolean;
  isLoggedIn?: boolean;
  wishlistIds?: number[];
  className?: string;
}

export function ProductCard({
  product,
  priority = false,
  showWishlist = false,
  showCategory = true,
  isLoggedIn = false,
  wishlistIds = [],
  className = "",
}: ProductCardProps) {
  const firstImage = product.images?.[0]?.image
    ? mediaUrl(product.images[0].image)
    : null;
  const categoryName =
    product.categories && product.categories.length > 0 &&
    typeof product.categories[0] === "object"
      ? (product.categories[0] as { name?: string }).name || "Uncategorized"
      : "Uncategorized";

  return (
    <Link href={`/products/${product.slug || product.id}`} transitionTypes={["page"]}>
      <Card
        hover
        className={`group relative h-full flex flex-col ${className}`}
      >
        {firstImage ? (
          <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
            <img
              src={firstImage}
              alt=""
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
            />
          </div>
        ) : (
          <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] rounded-t-2xl bg-accent-subtle" />
        )}

        <div className="mb-2 flex flex-wrap gap-2">
          {product.availability && (
            <Badge variant={availabilityBadgeVariant(product.availability)}>
              {availabilityLabel[product.availability]}
            </Badge>
          )}
          {showCategory && product.categories && product.categories.length > 0 && (
            <Badge variant="default">{categoryName}</Badge>
          )}
        </div>

        <h3 className="font-sans text-lg font-bold text-fg-default">
          {product.title}
        </h3>
        <Text className="mt-1 font-bold text-primary">
          {formatPrice(product.price)}
        </Text>

        {showWishlist && (
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton
              productId={product.id}
              initialInWishlist={wishlistIds.includes(product.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
      </Card>
    </Link>
  );
}
