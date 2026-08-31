import React from "react";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/payload/utils";

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export interface ProductReviewsProps {
  reviews: ReviewItem[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6 text-fg-muted text-sm">
        Belum ada ulasan untuk produk ini. Jadilah yang pertama membagikan ceritamu!
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold text-fg-default">{averageRating}</span>
          <span className="text-fg-muted text-xs sm:text-sm font-medium"> / 5</span>
        </div>
        <div className="text-xs sm:text-sm text-fg-muted">
          Berdasarkan {reviews.length} ulasan
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          const userName = review.userName || review.userEmail?.split("@")[0] || "Pengguna";
          return (
            <div key={String(review.id)} className="border-b border-border pb-4 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs sm:text-sm text-fg-default">{userName}</span>
                <span className="text-[11px] sm:text-xs text-fg-muted">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? "fill-current text-warning" : "text-fg-muted/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed mt-1">{review.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

