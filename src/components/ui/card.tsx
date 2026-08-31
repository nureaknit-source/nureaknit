import { HTMLAttributes, forwardRef } from "react";

export type CardVariant = "default" | "outline" | "flat";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-bg-surface border border-border/60 shadow-md backdrop-blur-md",
  outline: "bg-transparent border border-border",
  flat: "bg-bg-surface-muted border border-border/40",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hover = true,
      variant = "default",
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={`rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${
        hover ? "transition duration-300 hover:shadow-lg hover:border-border" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";

