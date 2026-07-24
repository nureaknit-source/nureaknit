import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-lg bg-bg-surface p-6 shadow-md backdrop-blur-md ${
        hover ? "transition hover:shadow-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";
