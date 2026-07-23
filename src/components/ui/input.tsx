import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-fg-default">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-full border border-border bg-[rgba(244,235,225,0.5)] px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle ${className}`}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
