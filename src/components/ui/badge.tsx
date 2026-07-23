import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "accent" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent-subtle text-secondary",
  primary: "bg-primary text-primary-fg",
  secondary: "bg-secondary text-secondary-fg",
  accent: "bg-accent text-accent-fg",
  error: "bg-error text-error-fg",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";
