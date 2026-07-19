import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "sage" | "gold" | "rose" | "terracotta";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-light-gray text-medium-gray",
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
  rose: "bg-rose/10 text-rose",
  terracotta: "bg-terracotta/10 text-terracotta",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";
