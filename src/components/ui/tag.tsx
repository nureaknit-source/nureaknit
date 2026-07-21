import { HTMLAttributes, forwardRef } from "react";

type TagVariant = "sage" | "gold" | "rose" | "terracotta" | "default";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-light-gray text-medium-gray",
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/10 text-gold",
  rose: "bg-rose/10 text-rose",
  terracotta: "bg-terracotta/10 text-terracotta",
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Tag.displayName = "Tag";
