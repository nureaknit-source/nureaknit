"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface ReviewFormProps {
  productId: number;
  orderId: number;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function checkExisting() {
      try {
        const res = await fetch(`/api/reviews?order=${orderId}&product=${productId}`);
        const data = await res.json();
        if (data.review) {
          setRating(data.review.rating);
          setComment(data.review.comment);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Gagal mengecek ulasan:", err);
      } finally {
        setFetching(false);
      }
    }
    checkExisting();
  }, [productId, orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId,
          order: orderId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal mengirim ulasan");
      }

      setMessage(
        isEditing
          ? "Ulasanmu telah diperbarui."
          : "Terima kasih! Ulasanmu berhasil dikirim dan akan segera tampil setelah disetujui admin.",
      );
      setIsEditing(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-center text-sm text-fg-muted">Memuat data ulasan...</div>;
  }

  const activeStars = hoverRating ?? rating;

  return (
    <Card hover={false} className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Heading as="h3" className="text-lg">
          {isEditing ? "Edit Ulasanmu" : "Bagikan Pengalamanmu"}
        </Heading>

        {message && (
          <div className="rounded-xl border border-success/30 bg-success-subtle p-3.5 text-sm font-medium text-success">
            {message}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-fg-default">
            Rating
          </label>
          <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(null)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                className="p-1 rounded-full text-warning transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-warning-subtle"
                aria-label={`Beri rating ${star} dari 5 bintang`}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= activeStars
                      ? "fill-current text-warning"
                      : "text-fg-muted/40"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold text-fg-muted">
              {activeStars} / 5 Bintang
            </span>
          </div>
        </div>

        <Textarea
          id="comment"
          label="Cerita & Ulasan"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Ceritakan pengalaman serumu merajut pola atau menggunakan produk ini..."
        />

        <Button type="submit" isLoading={loading}>
          {isEditing ? "Simpan Perubahan" : "Kirim Ulasan"}
        </Button>
      </form>
    </Card>
  );
}

