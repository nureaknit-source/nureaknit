import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  secondary: "bg-secondary text-secondary-fg hover:opacity-90",
  outline: "border border-border text-fg-default hover:border-accent hover:text-accent",
  ghost: "text-fg-muted hover:text-fg-default",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-subtle ${variantStyles[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
