import { HTMLAttributes, forwardRef } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "image" | "circle";
}

const variants = {
  text: "h-4 w-full rounded",
  card: "h-48 w-full rounded-xl",
  image: "aspect-[4/3] w-full rounded-xl",
  circle: "h-12 w-12 rounded-full",
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "text", className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse bg-accent-subtle ${variants[variant]} ${className}`}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
