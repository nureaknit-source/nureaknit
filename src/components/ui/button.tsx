import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:opacity-90 shadow-sm",
  secondary: "bg-secondary text-secondary-fg hover:opacity-90 shadow-sm",
  outline: "border border-border text-fg-default hover:border-accent hover:text-accent bg-transparent",
  ghost: "text-fg-muted hover:text-fg-default hover:bg-accent-subtle bg-transparent",
  success: "bg-success text-success-fg hover:opacity-90 shadow-sm",
  danger: "bg-error text-error-fg hover:opacity-90 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
  md: "px-4 py-2 text-sm font-bold gap-2",
  lg: "px-6 py-3 text-sm sm:text-base font-bold gap-2.5",
  icon: "h-9 w-9 p-0 flex items-center justify-center rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-full transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-subtle ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {typeof children === "string" ? "Memproses..." : children}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  ),
);
Button.displayName = "Button";

