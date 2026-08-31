import { HTMLAttributes, forwardRef } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "error"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent-subtle text-secondary",
  primary: "bg-primary text-primary-fg",
  secondary: "bg-secondary text-secondary-fg",
  accent: "bg-accent text-accent-fg",
  success: "bg-success-subtle text-success",
  error: "bg-error text-error-fg",
  outline: "border border-border bg-transparent text-fg-default",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-0.5 text-xs",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full font-bold ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";

