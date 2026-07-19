import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-sage text-white hover:opacity-90",
  secondary: "bg-charcoal text-white hover:opacity-90",
  outline: "border border-light-gray text-charcoal hover:border-sage hover:text-sage",
  ghost: "text-medium-gray hover:text-charcoal",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
