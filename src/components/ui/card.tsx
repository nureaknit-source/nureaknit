import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border border-light-gray bg-off-white p-6 shadow-sm ${
        hover ? "transition hover:shadow-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";
