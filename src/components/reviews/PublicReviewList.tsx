import React from "react";
import { formatDate } from "@/lib/payload/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Star, MessageCircleHeart } from "lucide-react";

export interface PublicReviewItem {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
  productTitle?: string;
}

export interface PublicReviewListProps {
  reviews: PublicReviewItem[];
}

export function PublicReviewList({ reviews }: PublicReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircleHeart className="h-8 w-8 text-fg-muted" />}
        title="Belum Ada Ulasan"
        message="Belum ada ulasan saat ini. Jadilah yang pertama berbagi cerita pengalamanmu!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {reviews.map((review) => {
        const displayName = review.userName || review.userEmail?.split("@")[0] || "Pengguna";

        return (
          <Card
            key={review.id}
            hover
            className="flex flex-col h-full p-6 justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-fg-default">{displayName}</p>
                  <p className="text-[11px] text-fg-muted uppercase tracking-wider">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-current text-warning" : "text-fg-muted/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {review.productTitle && (
                <div className="mb-3">
                  <Badge variant="accent" size="sm" className="uppercase">
                    Membeli: {review.productTitle}
                  </Badge>
                </div>
              )}

              <p className="text-sm text-fg-secondary leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-subtle flex items-center justify-center text-primary font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-fg-muted italic">Verified Buyer</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

