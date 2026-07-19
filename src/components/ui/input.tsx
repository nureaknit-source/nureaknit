import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-lg border border-light-gray px-3 py-2 text-sm text-charcoal placeholder:text-medium-gray focus:border-sage focus:ring-2 focus:ring-sage/10 ${className}`}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
