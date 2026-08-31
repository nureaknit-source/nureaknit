import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";

import { mediaUrl, formatPrice, availabilityLabel } from "@/lib/payload/utils";
import type { Product } from "@/lib/payload/payload-types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  showCategory?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  priority = false,
  showCategory = true,
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
          <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] overflow-hidden rounded-t-2xl relative">
            <Image
              src={firstImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] rounded-t-2xl bg-accent-subtle" />
        )}

        <h3 className="font-sans text-base sm:text-lg font-bold text-fg-default line-clamp-2">
          {product.title}
        </h3>

        <div className="mb-2 flex flex-wrap gap-1.5 sm:gap-2">
          {product.availability && (
            <Badge variant="outline">
              {availabilityLabel[product.availability]}
            </Badge>
          )}
          {product.availability === "in_stock" &&
            product.lowStockThreshold != null &&
            (product.stock ?? 0) - (product.reservedStock ?? 0) <= product.lowStockThreshold && (
              <Badge variant="outline">Stok Menipis</Badge>
            )}
          {showCategory && product.categories && product.categories.length > 0 && (
            <Badge variant="outline">{categoryName}</Badge>
          )}
        </div>

        {product.availability === "pre_order" && (
          <p className="mb-2 text-2xs sm:text-xs text-fg-muted">
            {product.estimatedAvailability
              ? `Perkiraan tersedia: ${product.estimatedAvailability}`
              : "Pre-order — memerlukan konfirmasi admin"}
          </p>
        )}

        <Text size="base" className="mt-1 text-sm sm:text-base font-bold text-primary">
          {formatPrice(product.price)}
        </Text>
      </Card>
    </Link>
  );
}
